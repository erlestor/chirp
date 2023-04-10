import { clerkClient } from "@clerk/nextjs/server"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc"
import { filterUserForClient } from "../helpers/filterUserForClient"
import type { Post } from "@prisma/client"
import { emojiValidator } from "~/utils/zodValidators"
import { ratelimit } from "../helpers/ratelimit"

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

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
    })

    return addUserDataToPosts(posts)
  }),

  getInfinitePosts: publicProcedure
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
      // const cursor = "clfwm1b8w000cuyiszq5xuclp" as string

      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "desc",
        },
        // filtering
        where: authorId ? { authorId: authorId } : undefined,
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

  getPostsByUserId: publicProcedure.input(z.object({ userId: z.string() })).query(
    async ({ ctx, input }) =>
      await ctx.prisma.post
        .findMany({
          where: {
            authorId: input.userId,
          },
          take: 100,
          orderBy: [{ createdAt: "desc" }],
        })
        .then(addUserDataToPosts)
  ),

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
