import InfiniteScroll from "react-infinite-scroll-component"
import { LoadingPage, LoadingSpinner } from "~/components/loading"
import { PostView } from "~/components/postview"
import { api } from "~/utils/api"

export const Feed = ({ authorId, limit }: { authorId?: string; limit?: number }) => {
  const { data, isLoading, fetchNextPage, hasNextPage, refetch } =
    api.posts.getInfinitePosts.useInfiniteQuery(
      {
        limit: limit,
        authorId: authorId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )

  if (isLoading) return <LoadingPage />

  const posts = data?.pages.flatMap((page) => page.posts)

  if (!posts) return <div />

  return (
    <InfiniteScroll
      dataLength={posts.length} //This is important field to render the next data
      next={() => {
        void fetchNextPage()
      }}
      hasMore={hasNextPage ?? true}
      loader={
        <div className="flex justify-center w-full p-4">
          <LoadingSpinner size={40} />
        </div>
      }
      endMessage={
        <div className="text-center w-full text-md p-4 text-slate-300">No more posts...</div>
      }
      // scrollableTarget="scrollableDiv"
      // below props only if you need pull down functionality
      refreshFunction={refetch}
      pullDownToRefresh
      pullDownToRefreshThreshold={50}
      pullDownToRefreshContent={
        <div className="flex justify-center w-full text-center text-md">
          &#8595; Pull down to refresh
        </div>
      }
      releaseToRefreshContent={
        <div className="flex justify-center w-full text-center text-md">
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
