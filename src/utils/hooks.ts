import { toast } from "react-hot-toast"
import { api } from "~/utils/api"

export const useFollowUser = () => {
  const utils = api.useContext()

  return api.profile.followUser.useMutation({
    onSuccess: () => {
      void utils.profile.isFollowing.invalidate()
      void utils.profile.getFollowers.invalidate()
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
      void utils.profile.getFollowers.invalidate()
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
