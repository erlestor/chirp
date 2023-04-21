import type { RouterOutputs } from "../utils/api"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Image from "next/image"
import Link from "next/link"

type PostWithUser = RouterOutputs["posts"]["getInfinite"]["posts"][0]

dayjs.extend(relativeTime)

export const PostView = ({ post, author }: PostWithUser) => {
  return (
    <div className="flex border-b border-slate-600">
      <Link className="p-4" href={`/@${author.username}`}>
        <Image
          src={author.profilePicture}
          alt={`@${author.username}'s profile picture`}
          className="h-14 w-14 rounded-full hover:brightness-75"
          width={56}
          height={56}
        />
      </Link>
      <div className="flex grow flex-col">
        <div className="text-dim flex gap-1">
          <Link className="pt-4" href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link className="flex grow pr-4 pt-4" href={`/post/${post.id}`}>
            <span className="font-thin">{` · ${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <Link className="pb-4 pr-4" href={`/post/${post.id}`}>
          <span className="grow text-2xl">{post.content}</span>
        </Link>
      </div>
    </div>
  )
}
