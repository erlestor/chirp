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

  createUser: publicProcedure.input(userValidator).query(async ({ ctx, input }) => {
    const { id, username, profilePicture } = input

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
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = input

      const update = await ctx.prisma.user.update({
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

  followUser: privateProcedure
    .input(z.object({ followedId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId

      const { success } = await ratelimit.limit(userId)

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" })

      const follow = await ctx.prisma.follow.create({
        data: {
          followerId: userId,
          followingId: input.followedId,
        },
      })
      return follow
    }),

  unfollowUser: privateProcedure
    .input(z.object({ followedId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId

      const { success } = await ratelimit.limit(userId)

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" })

      const unfollow = await ctx.prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: input.followedId,
          },
        },
      })
      return unfollow
    }),
})
