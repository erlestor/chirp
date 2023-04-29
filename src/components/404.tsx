import React from "react"
import { PageLayout } from "./layout"

export const NotFound = ({ message }: { message?: string }) => {
  return (
    <PageLayout layout="simple">
      <div className="flex h-screen w-screen items-center justify-center">
        <span className="text-xl">{`404${message ? " - " + message : ""}`}</span>
      </div>
    </PageLayout>
  )
}
