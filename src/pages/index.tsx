import { SignInButton, useUser } from "@clerk/nextjs"
import { type NextPage } from "next"
import { api } from "~/utils/api"
import Image from "next/image"
import { LoadingPage } from "~/components/loading"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { LoadingSpinner } from "../components/loading"
import { PageLayout } from "~/components/layout"
import { PostView } from "~/components/postview"
import { emojiValidator } from "~/utils/zodValidators"
import Link from "next/link"

const CreatePostWizard = () => {
  const [input, setInput] = useState("")
  const { user } = useUser()

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("")
      void ctx.posts.getAll.invalidate()
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

    if (result.success) {
      mutate({ content: input })
      return
    }

    const error = result.error.issues[0]
    if (!error?.message) toast.error("Failed to post! Please try again later")
    else toast.error(error.message)
  }

  if (!user || !user.username) return null

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

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery()

  if (postsLoading) return <LoadingPage />

  if (!data) return <div>Something went wrong</div>

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  )
}

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser()

  // start fetching asap
  api.posts.getAll.useQuery()

  // Return empty div if user is not loaded, caching makes sure we dont fetch twice
  if (!userLoaded) return <div />

  return (
    <>
      <PageLayout>
        <div className="border-b border-slate-400 p-4 flex">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {isSignedIn && <CreatePostWizard />}
        </div>
        <Feed />
      </PageLayout>
    </>
  )
}

export default Home
