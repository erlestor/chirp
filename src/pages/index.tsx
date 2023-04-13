import { useUser } from "@clerk/nextjs"
import { type NextPage } from "next"
import { api } from "~/utils/api"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { LoadingSpinner } from "../components/loading"
import { PageLayout } from "~/components/layout"
import { emojiValidator } from "~/utils/zodValidators"
import Link from "next/link"
import { Feed } from "~/components/feed"
import Head from "next/head"
import { Navbar } from "~/components/navbar"

const CreatePostWizard = () => {
  const [input, setInput] = useState("")
  const { user } = useUser()

  const utils = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("")
      void utils.posts.getInfinitePosts.invalidate()
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if (errorMessage && errorMessage[0]) toast.error(errorMessage[0])
      else {
        toast.error("Failed to post! Please try again later")
      }
    },
  })

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
    <div className="flex gap-3 w-full">
      <Link href={"/@" + user.username}>
        <Image
          src={user.profileImageUrl}
          alt="profile picture"
          className="w-14 h-14 rounded-full"
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
      {input !== "" && !isPosting && (
        <button onClick={handleSubmit} disabled={isPosting}>
          Post
        </button>
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
  const { isLoaded: userLoaded, isSignedIn, user } = useUser()
  console.log(user)
  const [page, setPage] = useState<"For you" | "Following">("For you")

  // start fetching posts for better load time. caching
  api.posts.getInfinitePosts.useInfiniteQuery({}, {})

  // Return empty div if user is not loaded, looks better on load
  // If you're not logged in already you will only see a black screen. Fix this!
  if (!userLoaded) return <div />

  return (
    <>
      <Head>
        <meta property="og:image" content="https://chirp-taupe-eight.vercel.app/api/og" />
      </Head>
      <PageLayout>
        <Navbar page="Home">
          <div className="pt-3 flex border-b border-slate-600">
            <button
              className={`text-slate-400 flex grow pt-3 text-center justify-center w-1/2 hover:bg-slate-900`}
              onClick={() => setPage("For you")}
            >
              <div
                className={`pb-3 ${
                  page === "For you" ? "text-slate-100 border-b-4 border-blue-500 font-bold" : ""
                }
              `}
              >
                For you
              </div>
            </button>
            <button
              className={`text-slate-400 flex grow pt-3 text-center justify-center w-1/2 hover:bg-slate-900`}
              onClick={() => setPage("Following")}
            >
              <div
                className={`pb-3 ${
                  page === "Following" ? "text-slate-100 border-b-4 border-blue-500 font-bold" : ""
                }
              `}
              >
                Following
              </div>
            </button>
          </div>
        </Navbar>
        {isSignedIn && (
          <div className="border-b border-slate-600 p-4 flex">
            <CreatePostWizard />
          </div>
        )}
        <Feed followingOnly={page === "Following"} />
      </PageLayout>
    </>
  )
}

export default Home
