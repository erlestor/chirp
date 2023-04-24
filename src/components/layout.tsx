/* eslint-disable react/no-unescaped-entities */
import { SignInButton, useUser } from "@clerk/nextjs"
import { useState, type PropsWithChildren } from "react"
import { Inter } from "next/font/google"
import { Sidebar } from "./sidebar"

const inter = Inter({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-inter",
})

export const PageLayout = (props: PropsWithChildren) => {
  const { isLoaded, isSignedIn } = useUser()
  const [showPopover, setShowPopover] = useState(false)

  const handlePageClick = () => {
    if (showPopover) {
      setShowPopover(false)
      return
    }
  }

  return (
    <main className={`${inter.className} font-sans`} onClick={handlePageClick}>
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
    </main>
  )
}
