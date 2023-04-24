/* eslint-disable react/no-unescaped-entities */
import { SignInButton, useUser } from "@clerk/nextjs"
import { useState, type PropsWithChildren } from "react"
import { Inter } from "next/font/google"
import { Sidebar } from "./sidebar"
import { useDarkmodeContext } from "~/utils/darkmode"

const inter = Inter({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-inter",
})

export const PageLayout = (props: PropsWithChildren) => {
  const { isLoaded, isSignedIn } = useUser()
  const [showPopover, setShowPopover] = useState(false)

  const darkmode = useDarkmodeContext()

  const handlePageClick = () => {
    if (showPopover) {
      setShowPopover(false)
      return
    }
  }

  return (
    <main
      className={`${inter.className} font-sans ${darkmode ? "dark" : ""}`}
      onClick={handlePageClick}
    >
      <div className="bg-white text-slate-900 transition duration-300 dark:bg-black dark:text-slate-100">
        <div className={`${showPopover ? "pointer-events-none" : ""} flex justify-center`}>
          <Sidebar showPopover={showPopover} setShowPopover={setShowPopover} />
          <div className="min-h-screen w-full border-slate-600 md:max-w-2xl md:border-x">
            {props.children}
          </div>
        </div>
        {isLoaded && !isSignedIn && (
          <div className="fixed bottom-0 flex w-full justify-center gap-4 bg-black p-4">
            <div className="text-xl">Don't miss what's happening</div>
            <SignInButton />
          </div>
        )}
      </div>
    </main>
  )
}
