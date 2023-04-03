import type { RouterOutputs } from "~/utils/api"
import { LoadingPage } from "./loading"
import { PostView } from "./postview"

type PostWithUser = RouterOutputs["posts"]["getAll"]

export const Feed = (props: { data: PostWithUser | undefined; isLoading: boolean }) => {
  const { data, isLoading: postsLoading } = props

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
