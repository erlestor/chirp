import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { api } from "~/utils/api"
import { PageLayout } from "@ui/layout"
import Image from "next/image"
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper"
import { Feed } from "@ui/feed"
import { useUser } from "@clerk/nextjs"
import { Navbar } from "@ui/navbar"
import { useState } from "react"
import { Button } from "@ui/button"
import { useToggleFollow } from "~/utils/hooks"
import { NotFound } from "~/components/404"

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const [followingText, setFollowingText] = useState<"Following" | "Unfollow">("Following")
  const { isSignedIn, user: currentUser } = useUser()

  const { mutate: mutateFollow } = useToggleFollow()

  const { data: user } = api.profile.getUserByUsername.useQuery({
    username,
  })

  if (!user || !user.username) return <NotFound message="This user could not be found" />

  const { data: isFollowing, isLoading } = api.profile.isFollowing.useQuery({
    followedId: user.id,
  })

  const isCurrentUser = currentUser && user.id === currentUser.id

  const handleFollow = () => {
    mutateFollow({ followedId: user.id })
  }

  return (
    <>
      <Head>
        <title>{"@" + user.username}</title>
      </Head>
      <PageLayout>
        <Navbar
          page={
            <>
              <div>{user.username}</div>
            </>
          }
          back
        />
        <div className=" relative h-36 bg-slate-600">
          <Image
            src={user.profilePicture}
            alt="profile"
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-white dark:border-black"
            priority
          />
        </div>
        <div className="flex h-20 items-start justify-end">
          {isSignedIn && !isLoading && !isCurrentUser && (
            <>
              {isFollowing && (
                <Button
                  className="m-4 w-[105px] hover:border-red-700 hover:text-red-700"
                  onClick={handleFollow}
                  onMouseEnter={() => setFollowingText("Unfollow")}
                  onMouseLeave={() => setFollowingText("Following")}
                  disabled={isLoading}
                >
                  {followingText}
                </Button>
              )}
              {!isFollowing && (
                <Button contained className="m-4" onClick={handleFollow} disabled={isLoading}>
                  Follow
                </Button>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col gap-1 p-4">
          <div className="text-2xl font-bold">{`@${user.username ?? ""}`}</div>
          <div className="flex gap-5">
            <div className="flex gap-1">
              <span>{user.following.length}</span>
              <span className="text-dim">Following</span>
            </div>
            <div className="flex gap-1">
              <span>{user.followedBy.length}</span>
              <span className="text-dim">
                {user.followedBy.length !== 1 ? "Followers" : "Follower"}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full border-b border-slate-600" />
        <Feed authorId={user.id} page="user" />
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
