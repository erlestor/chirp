import { env } from "~/env.mjs"
import { createTRPCContext } from "~/server/api/trpc"
import { appRouter } from "~/server/api/root"
import { createOpenApiNextHandler } from "trpc-openapi"
import type { NextApiRequest, NextApiResponse } from "next"
import NextCors from "nextjs-cors"

// export API handler

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO: unsure if cors is needed here for clerk

  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })

  return createOpenApiNextHandler({
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`)
          }
        : undefined,
  })(req, res)
}

export default handler
