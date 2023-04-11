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
        followingOnly: z.boolean().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50
      const { cursor, authorId, followingOnly } = input

      const authorFilter = authorId ? { authorId: authorId } : {}
      const followFilter = followingOnly ? { following: { some: { id: ctx.userId } } } : {}
      const filter = { ...authorFilter, ...followFilter }

      // vil hent ut posts der det finnes en follow med followerId lik ctx.userId og followedId lik authorId
      // treng da relation post n->1 user, user 2->n follow
      // første steg blir da å sørg for at æ lagre users på egen database i tillegg te clerk

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
