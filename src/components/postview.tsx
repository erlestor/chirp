import type { RouterOutputs } from "../utils/api"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { BsBookmark, BsBookmarkFill } from "react-icons/bs"

type PostWithUser = RouterOutputs["posts"]["getInfinite"]["posts"][0]

dayjs.extend(relativeTime)

export const PostView = ({ post, author }: PostWithUser) => {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <div className="flex border-b border-slate-600 transition hover:bg-hover-light dark:hover:bg-hover-dark">
      <Link className="p-4" href={`/@${author.username}`}>
        <Image
          src={author.profilePicture}
          alt={`@${author.username}'s profile picture`}
          className="h-14 w-14 rounded-full transition hover:brightness-75"
          width={56}
          height={56}
        />
      </Link>
      <div className="flex grow flex-col">
        <div className="flex gap-1">
          <Link className="pt-4" href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link className="flex grow pr-4 pt-4" href={`/post/${post.id}`}>
            <span className="font-thin text-dim">{` · ${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <div className="flex flex-col gap-2 pb-1 pr-4">
          <Link href={`/post/${post.id}`}>
            <span className="grow text-2xl">{post.content}</span>
          </Link>
          <div className="flex w-full gap-4">
            <button
              onClick={() => setLiked((prev) => !prev)}
              className={`${
                liked ? "text-pink-500" : "text-dim"
              } w-fit rounded-full p-2 hover:bg-pink-500 hover:bg-opacity-30 hover:text-pink-500`}
            >
              {liked ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
            </button>
            <button
              onClick={() => setBookmarked((prev) => !prev)}
              className={`${
                bookmarked ? "text-sky-500" : "text-dim"
              } w-fit rounded-full p-2 hover:bg-sky-500 hover:bg-opacity-30 hover:text-sky-500`}
            >
              {bookmarked ? <BsBookmarkFill size={18} /> : <BsBookmark size={18} />}
            </button>
            <Link className="flex grow" href={`/post/${post.id}`} />
          </div>
        </div>
      </div>
    </div>
  )
}
