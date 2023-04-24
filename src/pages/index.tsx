import { useUser } from "@clerk/nextjs"
import { type NextPage } from "next"
import { api } from "~/utils/api"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { LoadingSpinner } from "@ui/loading"
import { PageLayout } from "@ui/layout"
import { emojiValidator } from "~/utils/zodValidators"
import Link from "next/link"
import Head from "next/head"
import { Feed } from "@ui/feed"
import { Navbar } from "@ui/navbar"
import { Button } from "@ui/button"
import { LogoPage } from "@ui/logo"
import { useCreatePost } from "~/utils/hooks"
import { Tabs } from "~/components/tabs"
import { tabs, useTabContext } from "~/utils/context"

const CreatePostWizard = () => {
  const [input, setInput] = useState("")
  const { user } = useUser()

  const { mutate, isLoading: isPosting } = useCreatePost({ setInput })

  const handleSubmit = () => {
    const result = emojiValidator.safeParse(input)

    if (!result.success) {
      const error = result.error.issues[0]
      if (!error?.message) toast.error("Failed to post! Please try again later")
      else toast.error(error.message)
      return
    }

    mutate({ content: input })
  }

  if (!user || !user.username) return <div />

  return (
    <div className="flex w-full gap-3">
      <Link href={"/@" + user.username}>
        <Image
          src={user.profileImageUrl}
          alt="profile picture"
          className="h-14 w-14 rounded-full hover:brightness-75"
          width={56}
          height={56}
        />
      </Link>
      <input
        type="text"
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            handleSubmit()
          }
        }}
        disabled={isPosting}
      />
      {!isPosting && (
        <div className="flex items-center">
          <div>
            <Button contained onClick={handleSubmit} disabled={input === "" || isPosting}>
              Post
            </Button>
          </div>
        </div>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  )
}

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser()

  // start fetching posts earlier for better load time. caching
  api.posts.getInfinite.useInfiniteQuery({}, {})
  api.posts.getInfiniteFollowing.useInfiniteQuery({}, {})

  // Return empty div if user is not loaded, looks better on load
  // If you're not logged in already you will only see a black screen. Fix this!
  if (!userLoaded) return <LogoPage />

  return (
    <>
      <Head>
        <meta property="og:image" content="https://chirp-taupe-eight.vercel.app/api/og" />
      </Head>
      <PageLayout>
        <Navbar page="Home">{isSignedIn && <Tabs />}</Navbar>
        {isSignedIn && (
          <div className="flex border-b border-slate-600 p-4">
            <CreatePostWizard />
          </div>
        )}
        <Feed />
      </PageLayout>
    </>
  )
}

export default Home
