import type { RouterOutputs } from "../utils/api"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Image from "next/image"
import Link from "next/link"

type PostWithUser = RouterOutputs["posts"]["getInfinite"]["posts"][0]

dayjs.extend(relativeTime)

export const PostView = ({ post, author }: PostWithUser) => {
  return (
    <div className="border-b border-slate-600 hover:bg-gray-950 flex">
      <Link className="p-4" href={`/@${author.username}`}>
        <Image
          src={author.profilePicture}
          alt={`@${author.username}'s profile picture`}
          className="w-14 h-14 rounded-full"
          width={56}
          height={56}
        />
      </Link>
      <div className="flex flex-col grow">
        <div className="flex text-slate-300 gap-1">
          <Link className="pt-4" href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link className="flex grow pt-4 pr-4" href={`/post/${post.id}`}>
            <span className="font-thin">{` · ${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <Link className="pb-4 pr-4" href={`/post/${post.id}`}>
          <span className="text-2xl grow">{post.content}</span>
        </Link>
      </div>
    </div>
  )
}
