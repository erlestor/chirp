import type { GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { api } from "~/utils/api"
import { PageLayout } from "~/components/layout"
import Image from "next/image"
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper"
import { Feed } from "~/components/feed"
import { useUser } from "@clerk/nextjs"
import { Navbar } from "~/components/navbar"
import { LoadingSpinner } from "~/components/loading"
import { toast } from "react-hot-toast"
import { useState } from "react"
import { Button } from "~/components/button"
import { SignOutButton } from "~/components/SignOutButton"

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const [followingText, setFollowingText] = useState<"Following" | "Unfollow">("Following")

  const { isSignedIn, user: currentUser } = useUser()

  const { data: user } = api.profile.getUserByUsername.useQuery({
    username,
  })

  if (!user || !user.username) return <div>404</div>

  const { data: follow, isLoading: isFollowLoading } = api.profile.isFollowing.useQuery({
    followedId: user.id,
  })

  const utils = api.useContext()

  const { mutate: mutateFollow, isLoading: followLoading } = api.profile.followUser.useMutation({
    onMutate: async () => {
      await utils.profile.isFollowing.cancel()
      const wasFollowing = utils.profile.isFollowing.getData()
      // optimist update
      utils.profile.isFollowing.setData({ followedId: user.id }, () => !wasFollowing)

      return { wasFollowing }
    },
    onError: (e, data, ctx) => {
      // if mutation fails, use context value from mutate, aka previous value
      utils.profile.isFollowing.setData({ followedId: user.id }, () => ctx?.wasFollowing)
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if (errorMessage && errorMessage[0]) toast.error(errorMessage[0])
      else {
        toast.error("Failed to follow! Please try again later")
      }
    },
    onSettled: () => {
      void utils.profile.isFollowing.invalidate()
    },
  })

  const { mutate: mutateUnfollow, isLoading: unfollowLoading } =
    api.profile.unfollowUser.useMutation({
      onSuccess: () => {
        void utils.profile.isFollowing.invalidate()
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content
        if (errorMessage && errorMessage[0]) toast.error(errorMessage[0])
        else {
          toast.error("Failed to unfollow! Please try again later")
        }
      },
    })

  const handleFollow = () => {
    // TODO: check if user is already following
    mutateFollow({ followedId: user.id })
  }

  const handleUnfollow = () => {
    // TODO: check if user is following
    mutateUnfollow({ followedId: user.id })
  }

  const isCurrentUser = currentUser && user.id === currentUser.id
  const isLoading = followLoading || unfollowLoading || isFollowLoading
  const isFollowing = follow

  return (
    <>
      <Head>
        <title>{user.username}</title>
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
        <div className=" bg-slate-600 h-36 relative">
          <Image
            src={user.profilePicture}
            alt="profile"
            width={128}
            height={128}
            className="-mb-[64px] absolute left-0 ml-4 bottom-0 rounded-full border-4 border-black"
            priority
          />
        </div>
        <div className="h-24" />
        <div className="flex justify-between items-center">
          <div className="p-4 text-2xl font-bold">{`@${user.username ?? ""}`}</div>
          {isSignedIn && (
            <>
              {isCurrentUser && (
                <div className="m-4">
                  <SignOutButton />
                </div>
              )}
              {!isLoading && !isCurrentUser && !isFollowing && (
                <Button className="m-4" onClick={handleFollow} disabled={isLoading}>
                  Follow
                </Button>
              )}
              {/* TODO: replace false with if the user is already following */}
              {!isLoading && !isCurrentUser && isFollowing && (
                <Button
                  className="w-[105px] m-4 hover:text-red-700 hover:border-red-700"
                  onClick={handleUnfollow}
                  onMouseEnter={() => setFollowingText("Unfollow")}
                  onMouseLeave={() => setFollowingText("Following")}
                  disabled={isLoading}
                >
                  {followingText}
                </Button>
              )}
              {!isCurrentUser && isLoading && (
                <div className="p-4 flex items-center justify-center">
                  <LoadingSpinner size={20} />
                </div>
              )}
            </>
          )}
        </div>
        <div className="border-b border-slate-600 w-full" />
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
