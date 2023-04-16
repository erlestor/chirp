import Link from "next/link"
import { BsArrowLeftShort } from "react-icons/bs"

export const Navbar = ({
  page,
  back,
  children,
}: {
  page: string | React.ReactNode
  back?: boolean
  children?: React.ReactNode
}) => {
  return (
    <div className="sticky top-0 bg-black bg-opacity-70 backdrop-blur-md z-10">
      <div className="p-4 flex gap-2">
        {back && (
          <Link href="/" className="rounded-full hover:bg-gray-900">
            <BsArrowLeftShort size={30} />
          </Link>
        )}
        <div className="text-xl font-bold ">{page}</div>
      </div>
      {children}
    </div>
  )
}
