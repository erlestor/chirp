import Link from "next/link"
import { BsArrowLeftShort } from "react-icons/bs"

export const Navbar = ({ page, back }: { page: string; back?: boolean }) => {
  return (
    <div className="p-4 sticky top-0 bg-black bg-opacity-50 backdrop-blur-sm flex gap-2 align-center">
      {back && (
        <Link href="/" className="rounded-full hover:bg-gray-900">
          <BsArrowLeftShort size={30} />
        </Link>
      )}
      <div className="text-xl font-bold ">{page}</div>
    </div>
  )
}
