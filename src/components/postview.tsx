import type { RouterOutputs } from "../utils/api"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Image from "next/image"
import Link from "next/link"

type PostWithUser = RouterOutputs["posts"]["getAll"][number]

dayjs.extend(relativeTime)

export const PostView = (props: PostWithUser) => {
  const { post, author } = props

  return (
    <div key={post.id} className="p-4 border-b border-slate-400 flex gap-3">
      <Link href={`/@${author.username}`}>
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
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin flex grow">{` · ${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <Link href={`/post/${post.id}`}>
          <span className="text-2xl grow">{post.content}</span>
        </Link>
      </div>
    </div>
  )
}