import { toast } from "react-hot-toast"
import { api } from "~/utils/api"

export const useFollowUser = () => {
  const utils = api.useContext()

  return api.profile.followUser.useMutation({
    onSuccess: () => {
      void utils.profile.isFollowing.invalidate()
      void utils.profile.getUserByUsername.invalidate()
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if (errorMessage && errorMessage[0]) toast.error(errorMessage[0])
      else {
        toast.error("Failed to follow! Please try again later")
      }
    },
  })
}

export const useUnfollowUser = () => {
  const utils = api.useContext()

  return api.profile.unfollowUser.useMutation({
    onSuccess: () => {
      void utils.profile.isFollowing.invalidate()
      void utils.profile.getUserByUsername.invalidate()
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if (errorMessage && errorMessage[0]) toast.error(errorMessage[0])
      else {
        toast.error("Failed to unfollow! Please try again later")
      }
    },
  })
}

export const useCreatePost = ({ setInput }: { setInput?: (input: string) => void }) => {
  const utils = api.useContext()

  return api.posts.create.useMutation({
    onSuccess: () => {
      setInput && setInput("")
      void utils.posts.getInfinite.invalidate()
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if (errorMessage && errorMessage[0]) toast.error(errorMessage[0])
      else {
        toast.error("Failed to post! Please try again later")
      }
    },
  })
}
