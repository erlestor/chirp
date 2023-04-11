import { clerkClient } from "@clerk/nextjs/server"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc"
import { filterUserForClient } from "../helpers/filterUserForClient"
import { ratelimit } from "../helpers/ratelimit"

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      })

      if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "User not found" })

      return filterUserForClient(user)
    }),

  createUser: privateProcedure.query(async ({ ctx, input }) => {
    const user = ctx.user

    if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "User not found" })

    const prismaUser = await ctx.prisma.user.create({
      data: {
        id: user.id,
        username: user.username!,
        profilePicture: user.profilePicture,
      },
    })

    return prismaUser
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
      return follow
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
