/* eslint-disable react/no-unescaped-entities */
import { SignInButton, useClerk, useUser } from "@clerk/nextjs"
import Link from "next/link"
import { useState, type PropsWithChildren, type ReactNode } from "react"
import { FaKiwiBird } from "react-icons/fa"
import { AiFillHome } from "react-icons/ai"
import { BsThreeDots } from "react-icons/bs"
import Image from "next/image"
import { Inter } from "next/font/google"

const inter = Inter({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-inter",
})

const Navlink = ({
  children,
  href,
  text,
}: {
  children: ReactNode
  href: string
  text?: string
}) => {
  return (
    <Link href={href} className="flex items-center rounded-full p-3 hover:bg-dark">
      {children}
      {text && <span className="ml-5 text-xl font-medium">{text}</span>}
    </Link>
  )
}

export const PageLayout = (props: PropsWithChildren) => {
  const [showPopover, setShowPopover] = useState(false)
  const { isLoaded, isSignedIn } = useUser()
  const { user } = useUser()
  const { signOut } = useClerk()

  const handleUserBtnClick = () => {
    setShowPopover((prev) => !prev)
  }

  return (
    <main className={`${inter.className} font-sans`}>
      <div className="flex justify-center">
        <div className="sticky top-0 flex h-screen flex-col py-4 pr-4">
          <div>
            <Navlink href="/">
              <FaKiwiBird size={30} />
            </Navlink>
            <Navlink href="/" text="Home">
              <AiFillHome size={30} />
            </Navlink>
          </div>
          {user && user.username && (
            <div className="flex h-full flex-col justify-end">
              {showPopover && (
                <div className="relative bottom-3 rounded-2xl border border-slate-600">
                  <button
                    onClick={() => {
                      void signOut()
                    }}
                    className="w-full rounded-2xl p-4 text-left transition hover:bg-dark"
                  >
                    Sign out
                  </button>
                </div>
              )}
              <button
                onClick={handleUserBtnClick}
                className="flex items-center rounded-full p-3 transition hover:bg-dark"
              >
                <Image
                  src={user.profileImageUrl}
                  alt={`@${user.username}'s profile picture`}
                  className="mr-3 h-12 w-12 rounded-full"
                  width={48}
                  height={48}
                />
                <span className="mr-10 ">@{user.username}</span>
                <BsThreeDots size={18} />
              </button>
            </div>
          )}
        </div>
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
