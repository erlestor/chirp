import { toast } from "react-hot-toast"
import { api } from "~/utils/api"

export const useToggleFollow = () => {
  const utils = api.useContext()

  return api.profile.toggleFollowUser.useMutation({
    onMutate: async ({ followedId }) => {
      await utils.profile.isFollowing.cancel()
      // TODO: optimistically update getUserByUsername aswell. The followedBy list needs appending or removing
      // later on I'll check if following from getUserByUsername mby

      const prevData = utils.profile.isFollowing.getData()

      utils.profile.isFollowing.setData({ followedId }, (old) => !old)

      return { prevData }
    },
    onError: (err, input, ctx) => {
      const { followedId } = input
      const wasFollowing = ctx?.prevData

      // revert optimistc update
      // TODO: it aint workin
      utils.profile.isFollowing.setData({ followedId }, ctx?.prevData)

      const errorMessage = err.data?.zodError?.fieldErrors.content
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0])
        return
      }

      if (err.data?.code === "TOO_MANY_REQUESTS") {
        toast.error(err.message)
        return
      }

      toast.error(`Failed to ${wasFollowing ? "unfollow" : "follow"}! Please try again later`)
    },
    onSettled: () => {
      void utils.profile.isFollowing.invalidate()
      void utils.profile.getUserByUsername.invalidate()
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
