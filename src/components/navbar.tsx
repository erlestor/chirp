import Link from "next/link"
import { BsArrowLeftShort } from "react-icons/bs"
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md"
import { useDarkmode, useToggleDarkmode } from "~/utils/state"

export const Navbar = ({
  page,
  back,
  children,
}: {
  page: string | React.ReactNode
  back?: boolean
  children?: React.ReactNode
}) => {
  const darkmode = useDarkmode()
  const toggleDarkmode = useToggleDarkmode()

  return (
    <div className="sticky top-0 z-10 bg-opacity-70 backdrop-blur-md">
      <div className="flex p-2">
        <div className="flex grow gap-2 p-2">
          {back && (
            <Link href="/" className="rounded-full hover:bg-hover-light dark:hover:bg-hover-dark">
              <BsArrowLeftShort size={30} />
            </Link>
          )}
          <div className="flex text-xl font-bold">{page}</div>
        </div>
        <button
          onClick={toggleDarkmode}
          className="h-10 w-10 items-center rounded-full p-2 hover:bg-hover-light dark:hover:bg-hover-dark"
        >
          {darkmode ? <MdOutlineDarkMode size={25} /> : <MdOutlineLightMode size={25} />}
        </button>
      </div>
      {children}
    </div>
  )
}
