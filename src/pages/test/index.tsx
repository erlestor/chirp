import { Fragment } from "react"
import { PageLayout } from "~/components/layout"
import { LoadingPage } from "~/components/loading"
import { PostView } from "~/components/postview"
import { api } from "~/utils/api"

const InfiniteFeed = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.posts.getInfinitePosts.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        keepPreviousData: true,
      }
    )

  if (isLoading) return <LoadingPage />

  if (!data) return <div />

  return (
    <PageLayout>
      {data?.pages.map((page, i) => (
        <Fragment key={i}>
          {page.posts.map((fullPost) => (
            <PostView key={fullPost.post.id} {...fullPost} />
          ))}
        </Fragment>
      ))}
      <button
        onClick={() => {
          void fetchNextPage()
        }}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        Load more
      </button>
    </PageLayout>
  )
}

export default InfiniteFeed
