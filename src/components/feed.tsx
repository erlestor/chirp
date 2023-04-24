import InfiniteScroll from "react-infinite-scroll-component"
import { LoadingPage, LoadingSpinner } from "@ui/loading"
import { PostView } from "@ui/postview"
import { api } from "~/utils/api"

export const Feed = ({
  authorId,
  limit,
  followingOnly,
}: {
  authorId?: string
  limit?: number
  followingOnly?: boolean
}) => {
  // this is so ugly man wtf

  const query = followingOnly ? api.posts.getInfiniteFollowing : api.posts.getInfinite

  const { data, isLoading, fetchNextPage, hasNextPage, refetch } = query.useInfiniteQuery(
    { limit: limit, authorId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )

  if (isLoading) return <LoadingPage />

  const posts = data?.pages.flatMap((page) => page.posts)

  if (!posts) return <div />

  return (
    <InfiniteScroll
      dataLength={posts.length} // Required field to render the next data
      next={() => {
        void fetchNextPage()
      }}
      hasMore={hasNextPage ?? true}
      loader={
        <div className="flex w-full justify-center p-4">
          <LoadingSpinner size={40} />
        </div>
      }
      endMessage={<div className="text-md w-full p-4 text-center text-dim">No more posts...</div>}
      // scrollableTarget="scrollableDiv"
      // below props only if you need pull down functionality
      refreshFunction={refetch}
      pullDownToRefresh={window.innerWidth < 768}
      pullDownToRefreshThreshold={50}
      pullDownToRefreshContent={
        <div className="text-md flex w-full justify-center text-center">
          &#8595; Pull down to refresh
        </div>
      }
      releaseToRefreshContent={
        <div className="text-md flex w-full justify-center text-center">
          &#8593; Release to refresh
        </div>
      }
    >
      {posts.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </InfiniteScroll>
  )
}
