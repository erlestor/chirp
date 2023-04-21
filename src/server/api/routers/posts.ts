import { clerkClient } from "@clerk/nextjs/server"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc"
import { emojiValidator } from "~/utils/zodValidators"

import { filterUserForClient } from "../helpers/filterUserForClient"
import { ratelimit } from "../helpers/ratelimit"

import type { Post } from "@prisma/client"

const addUserDataToPosts = async (posts: Post[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100,
    })
  ).map(filterUserForClient)

  return posts.map((post) => {
    const author = users.find((user) => user.id === post.authorId)

    if (!author || !author.username)
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Author for post not found" })

    return { post, author: { ...author, username: author.username } }
  })
}

export const postsRouter = createTRPCRouter({
  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const post = await ctx.prisma.post.findUnique({
      where: {
        id: input.id,
      },
    })

    if (!post) throw new TRPCError({ code: "NOT_FOUND" })

    return (await addUserDataToPosts([post]))[0]
  }),

  getInfinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        authorId: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50
      const { cursor, authorId } = input

      // const userId = ctx.userId

      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "desc",
        },
        where: authorId
          ? { authorId: authorId }
          : // : userId
            // ? { NOT: { authorId: userId } }
            undefined,
      })

      let nextCursor: typeof cursor | undefined = undefined

      if (posts.length > limit) {
        const nextPost = posts.pop()
        nextCursor = nextPost?.id
      }

      const postsWithUser = await addUserDataToPosts(posts)

      return {
        posts: postsWithUser,
        nextCursor,
      }
    }),

  getInfiniteFollowing: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      // TODO: filtrering på followingOnly
      // hent posts der author te post e i following lista te currentUser

      const limit = input.limit ?? 50
      const { cursor } = input

      const currentUserId = ctx.userId

      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "desc",
        },
        where: {
          author: {
            followedBy: {
              some: {
                followerId: currentUserId,
              },
            },
          },
        },
      })

      let nextCursor: typeof cursor | undefined = undefined

      if (posts.length > limit) {
        const nextPost = posts.pop()
        nextCursor = nextPost?.id
      }

      const postsWithUser = await addUserDataToPosts(posts)

      return {
        posts: postsWithUser,
        nextCursor,
      }
    }),

  create: privateProcedure
    .input(
      z.object({
        content: emojiValidator,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId

      const { success } = await ratelimit.limit(authorId)

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" })

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
        },
      })

      return post
    }),
})
