import { useClerk, useUser } from "@clerk/nextjs"
import { type ReactNode } from "react"
import { FaKiwiBird } from "react-icons/fa"
import { AiFillHome, AiOutlineHome } from "react-icons/ai"
import { BsThreeDots } from "react-icons/bs"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

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
    <Link
      href={href}
      className="flex items-center rounded-full p-3 hover:bg-hover-light dark:hover:bg-hover-dark"
    >
      {children}
      {text && <span className="ml-5 hidden text-xl font-medium md:block">{text}</span>}
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

  const router = useRouter()

  const handleUserBtnClick = () => {
    setShowPopover(!showPopover)
  }

  return (
    <div className="sticky bottom-0 z-10 flex justify-around bg-white px-4 py-1 dark:bg-black md:top-0 md:h-screen md:flex-col md:justify-start md:bg-transparent md:py-4 md:pl-0 md:dark:bg-transparent">
      <Navlink href="/">
        <FaKiwiBird size={30} />
      </Navlink>
      <Navlink href="/" text="Home">
        {router.pathname === "/" ? <AiFillHome size={30} /> : <AiOutlineHome size={30} />}
      </Navlink>
      {user && user.username && (
        <div className="flex h-full flex-col justify-end">
          {showPopover && (
            <div className="absolute bottom-[88px] right-0 z-20 mt-2 w-full rounded-xl border border-slate-600 bg-white dark:bg-black md:relative md:bottom-1">
              <button
                onClick={() => {
                  void signOut()
                }}
                className="pointer-events-auto w-full rounded-2xl p-4 text-left transition hover:bg-hover-light dark:hover:bg-hover-dark"
              >
                Sign out
              </button>
            </div>
          )}
          <button
            onClick={handleUserBtnClick}
            className="flex items-center rounded-full p-3 transition hover:bg-hover-light dark:hover:bg-hover-dark"
          >
            <Image
              src={user.profileImageUrl}
              alt={`@${user.username}'s profile picture`}
              className="mr-3 h-12 w-12 rounded-full"
              width={48}
              height={48}
            />
            <span className="mr-10 hidden md:block ">@{user.username}</span>
            <BsThreeDots className="hidden md:block" size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
