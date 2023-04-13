import { type NextApiRequest, type NextApiResponse } from "next"
import { appRouter } from "../../../server/api/root"
import { createTRPCContext } from "../../../server/api/trpc"
import { TRPCError } from "@trpc/server"
import { getHTTPStatusCodeFromError } from "@trpc/server/http"
import { z } from "zod"

const bodyValidator = z.object({
  data: z.object({
    id: z.string(),
    username: z.string(),
    profile_image_url: z.string(),
  }),
})

const userByIdHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create context and caller
  const ctx = createTRPCContext({ req, res })
  const caller = appRouter.createCaller(ctx)

  try {
    if (req.method !== "POST") throw new Error("Method not allowed. Must be POST")

    const body = bodyValidator.parse(req.body)
    const { id, username, profile_image_url: profilePicture } = body.data

    if (typeof id !== "string") throw new Error("id must be a string")
    if (typeof username !== "string") throw new Error("username must be a string")
    if (typeof profilePicture !== "string") throw new Error("profilePicture must be a string")

    const user = await caller.profile.createUser({ id, username, profilePicture })
    res.status(200).json(user) // replace with user
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occured
      const httpCode = getHTTPStatusCodeFromError(cause)
      return res.status(httpCode).json(cause)
    }
    // Another error occured
    console.error(cause)
    res.status(500).json({ message: cause ?? "Internal server error" })
  }
}

export default userByIdHandler
