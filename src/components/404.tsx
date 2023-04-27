import React from "react"
import { useDarkmode } from "~/utils/context"
import { inter } from "./layout"

export const NotFound = ({ message }: { message?: string }) => {
  const [darkmode] = useDarkmode()

  return (
    <div className={`${inter.className} font-sans ${darkmode ? "dark" : ""}`}>
      <div className="font-inter flex h-screen w-screen items-center justify-center bg-white text-slate-900 dark:bg-black dark:text-slate-100">
        <span className="text-xl">{`404${message ? " - " + message : ""}`}</span>
      </div>
    </div>
  )
}
