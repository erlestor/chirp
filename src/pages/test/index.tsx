import InfiniteScroll from "react-infinite-scroll-component"
import { PageLayout } from "~/components/layout"
import { LoadingPage, LoadingSpinner } from "~/components/loading"
import { PostView } from "~/components/postview"
import { api } from "~/utils/api"

const InfiniteFeed = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.posts.getInfinitePosts.useInfiniteQuery(
      {
        limit: 11,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )

  if (isLoading) return <LoadingPage />

  const posts = data?.pages.flatMap((page) => page.posts)

  if (!posts) return <div />

  return (
    <PageLayout>
      <InfiniteScroll
        dataLength={posts.length} //This is important field to render the next data
        next={() => {
          console.log("fetching next page")
          void fetchNextPage()
        }}
        hasMore={hasNextPage ?? true}
        loader={
          <div className="flex justify-center w-full p-4">
            <LoadingSpinner size={40} />
          </div>
        }
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        scrollableTarget="scrollableDiv"
        // below props only if you need pull down functionality
        // refreshFunction={this.refresh}
        // pullDownToRefresh
        // pullDownToRefreshThreshold={50}
        // pullDownToRefreshContent={
        //   <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
        // }
        // releaseToRefreshContent={
        //   <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
        // }
      >
        {posts.map((fullPost) => (
          <PostView key={fullPost.post.id} {...fullPost} />
        ))}
      </InfiniteScroll>
    </PageLayout>
  )
}

export default InfiniteFeed
