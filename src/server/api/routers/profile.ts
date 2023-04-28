import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc"
import { ratelimit } from "../helpers/ratelimit"
import { userValidator } from "~/utils/zodValidators"

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const { username } = input

      const user = await ctx.prisma.user.findFirst({
        where: { username: username },
        include: {
          followedBy: {
            select: {
              follower: true,
            },
          },
          following: {
            select: {
              following: true,
            },
          },
        },
      })

      if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "User not found" })

      return user
    }),

  createUser: publicProcedure
    .meta({ openapi: { method: "POST", path: "/createUser" } })
    .input(
      z.object({
        data: z.object({
          id: z.string(),
          username: z.string(),
          profile_image_url: z.string(),
        }),
      })
    )
    .output(userValidator)
    .query(async ({ ctx, input }) => {
      const { id, username, profile_image_url: profilePicture } = input.data

      const user = await ctx.prisma.user.create({
        data: {
          id,
          username,
          profilePicture,
        },
      })

      return user
    }),

  deleteUser: publicProcedure
    .meta({ openapi: { method: "POST", path: "/deleteUser" } })
    .input(z.object({ data: z.object({ id: z.string() }) }))
    .output(userValidator)
    .query(async ({ ctx, input }) => {
      const { id: userId } = input.data

      await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          posts: {
            deleteMany: {},
          },
          following: {
            deleteMany: {},
          },
          followedBy: {
            deleteMany: {},
          },
        },
      })

      const user = await ctx.prisma.user.delete({
        where: {
          id: userId,
        },
      })

      return user
    }),

  isFollowing: privateProcedure
    .input(z.object({ followedId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.userId

      const follow = await ctx.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: input.followedId,
          },
        },
      })
      return !!follow
    }),

  toggleFollowUser: privateProcedure
    .input(z.object({ followedId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId

      const { success } = await ratelimit.limit(userId)

      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests. Try waiting :)",
        })

      const filter = {
        followerId_followingId: {
          followerId: userId,
          followingId: input.followedId,
        },
      }

      const existingFollow = await ctx.prisma.follow.findUnique({
        where: filter,
      })

      // if user is following, delete that follow object
      if (existingFollow) {
        const unfollow = await ctx.prisma.follow.delete({
          where: filter,
        })
        return unfollow
      }

      // if user is not following, create a follow object
      const follow = await ctx.prisma.follow.create({
        data: {
          followerId: userId,
          followingId: input.followedId,
        },
      })

      return follow
    }),
})
