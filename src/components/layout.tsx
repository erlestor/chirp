/* eslint-disable react/no-unescaped-entities */
import { SignInButton, useUser } from "@clerk/nextjs"
import { useState, type PropsWithChildren, useRef, useEffect } from "react"
import { Inter } from "next/font/google"
import { Sidebar } from "./sidebar"

const inter = Inter({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-inter",
})

interface Props extends PropsWithChildren {
  layout?: "simple" | "default"
}

export const PageLayout = ({ children, layout = "default" }: Props) => {
  const { isLoaded, isSignedIn } = useUser()
  const [showPopover, setShowPopover] = useState(false)
  const firstRender = useRef(true)

  const handlePageClick = () => {
    if (showPopover) {
      setShowPopover(false)
      return
    }
  }

  useEffect(() => {
    if (firstRender.current) firstRender.current = false
  }, [])

  return (
    <main
      className={`${inter.className} bg-white font-sans text-slate-900 ${
        firstRender.current === false ? "transition duration-300" : ""
      } dark:bg-black dark:text-slate-100`}
      onClick={handlePageClick}
    >
      {layout === "default" && (
        <>
          <div
            className={`${
              showPopover ? "pointer-events-none" : ""
            } flex flex-col-reverse justify-center md:flex-row`}
          >
            <Sidebar showPopover={showPopover} setShowPopover={setShowPopover} />
            <div className="min-h-screen w-full border-slate-600 md:max-w-2xl md:border-x">
              {children}
            </div>
          </div>
          {isLoaded && !isSignedIn && (
            <div className="fixed bottom-0 z-20 flex w-full justify-center gap-4 bg-white p-4 dark:bg-black">
              <div className="text-xl">Don't miss what's happening</div>
              <SignInButton />
            </div>
          )}
        </>
      )}
      {layout === "simple" && <>{children}</>}
    </main>
  )
}
