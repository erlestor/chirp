import { type NextApiRequest, type NextApiResponse } from "next"
import { appRouter } from "../../../server/api/root"
import { createTRPCContext } from "../../../server/api/trpc"
import { TRPCError } from "@trpc/server"
import { getHTTPStatusCodeFromError } from "@trpc/server/http"

const userByIdHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create context and caller
  const ctx = createTRPCContext({ req, res })
  const caller = appRouter.createCaller(ctx)

  try {
    const { id, username, profilePicture } = req.query

    console.log(req.query)

    if (typeof id !== "string") throw new Error("id must be a string")
    if (typeof username !== "string") throw new Error("username must be a string")
    if (typeof profilePicture !== "string") throw new Error("profilePicture must be a string")

    const user = await caller.profile.createUser({ id, username, profilePicture })
    res.status(200).json({}) // replace with user
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occured
      const httpCode = getHTTPStatusCodeFromError(cause)
      return res.status(httpCode).json(cause)
    }
    // Another error occured
    console.error(cause)
    res.status(500).json({ message: "Internal server error" })
  }
}

export default userByIdHandler
