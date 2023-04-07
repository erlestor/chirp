import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { api } from "~/utils/api"
import { PageLayout } from "~/components/layout"
import Image from "next/image"
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper"
import { Feed } from "~/components/feed"
import { SignOutButton, useUser } from "@clerk/nextjs"
import { Navbar } from "~/components/navbar"

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({
    username,
  })

  const { user: currentUser } = useUser()

  if (!user || !user.username) return <div>404</div>

  const isCurrentUser = currentUser?.id === user.id

  return (
    <>
      <Head>
        <title>{user.username}</title>
      </Head>
      <PageLayout>
        <Navbar page={user.username} back />
        <div className=" bg-slate-600 h-36 relative">
          <Image
            src={user.profilePicture}
            alt="profile"
            width={128}
            height={128}
            className="-mb-[64px] absolute left-0 ml-4 bottom-0 rounded-full border-4 border-black"
          />
        </div>
        <div className="h-32" />
        <div className="p-4 text-2xl font-bold">{`@${user.username ?? ""}`}</div>
        <div className="border-b border-slate-100 w-full" />
        <Feed authorId={user.id} />
      </PageLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper()

  const slug = context.params?.slug
  // UX unfriendly. Give feedback to user instead :/
  if (typeof slug !== "string") throw new Error("no slug")

  const username = slug.replace("@", "")
  await ssg.profile.getUserByUsername.prefetch({ username })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  }
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" }
}

export default ProfilePage
