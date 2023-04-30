import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { api } from "~/utils/api"
import { PageLayout } from "@ui/layout"
import { PostView } from "@ui/postview"
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper"
import { Navbar } from "@ui/navbar"

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: fullPost } = api.posts.getById.useQuery({
    id,
  })

  if (!fullPost) return <div>404</div>

  return (
    <>
      <Head>
        <title>{fullPost.post.content + " - @" + fullPost.author.username}</title>
        <meta property="og:image" content="https://chirp-erlestor.vercel.app/api/og" />
      </Head>
      <PageLayout>
        <Navbar page="Post" back />
        <PostView {...fullPost} />
      </PageLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper()

  const id = context.params?.id
  // UX unfriendly. Give feedback to user instead :/
  if (typeof id !== "string") throw new Error("no id")

  await ssg.posts.getById.prefetch({ id })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  }
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" }
}

export default SinglePostPage
