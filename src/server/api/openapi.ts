import { generateOpenApiDocument } from "trpc-openapi"
import { appRouter } from "./root"

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "Chirp OpenAPI",
  description: "OpenAPI compliant REST API built using tRPC with Next.js",
  version: "1.0.0",
  baseUrl: "http://localhost:3000/api/test",
  tags: ["users"],
})
