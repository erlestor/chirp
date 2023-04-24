import { useClerk, useUser } from "@clerk/nextjs"
import { type ReactNode, useState } from "react"
import { FaKiwiBird } from "react-icons/fa"
import { AiFillHome } from "react-icons/ai"
import { BsThreeDots } from "react-icons/bs"
import Image from "next/image"
import Link from "next/link"

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

export const Sidebar = ({
  showPopover,
  setShowPopover,
}: {
  showPopover: boolean
  setShowPopover: (showPopover: boolean) => void
}) => {
  const { user } = useUser()
  const { signOut } = useClerk()

  const handleUserBtnClick = () => {
    setShowPopover(!showPopover)
  }

  return (
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
            <div className="relative bottom-1 right-0 z-10 mt-2 w-full rounded-xl border border-slate-600">
              <button
                onClick={() => {
                  void signOut()
                }}
                className="pointer-events-auto w-full rounded-2xl p-4 text-left transition hover:bg-dark"
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
  )
}
