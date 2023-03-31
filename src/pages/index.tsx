import { SignInButton, useUser } from '@clerk/nextjs'
import { type NextPage } from 'next'
import Head from 'next/head'
import { api } from '~/utils/api'
import type { RouterOutputs } from '../utils/api'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Image from 'next/image'
import { LoadingPage, LoadingSpinner } from '~/components/loading'

dayjs.extend(relativeTime)

const CreatePostWizard = () => {
  const { user } = useUser()

  console.log(user)

  if (!user) return null

  return (
    <div className='flex gap-3 w-full'>
      <Image
        src={user.profileImageUrl}
        alt='profile picture'
        className='w-14 h-14 rounded-full'
        width={56}
        height={56}
      />
      <input
        type='text'
        placeholder='Type some emojis!'
        className='grow bg-transparent outline-none'
      />
    </div>
  )
}

type PostWithUser = RouterOutputs['posts']['getAll'][number]

const PostView = (props: PostWithUser) => {
  const { post, author } = props

  return (
    <div key={post.id} className='p-4 border-b border-slate-400 flex gap-3'>
      <Image
        src={author.profilePicture}
        alt={`@${author.username}'s profile picture`}
        className='w-14 h-14 rounded-full'
        width={56}
        height={56}
      />
      <div className='flex flex-col'>
        <div className='flex text-slate-300 gap-1'>
          <span>{`@${author.username}`}</span>
          <span className='font-thin'>{` · ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span className='text-2xl'>{post.content}</span>
      </div>
    </div>
  )
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery()

  if (postsLoading) return <LoadingPage />

  if (!data) return <div>Something went wrong</div>

  return (
    <div className='flex flex-col'>
      {data.map(fullPost => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  )
}

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser()

  // start fetching asap
  api.posts.getAll.useQuery()

  // Return empty div if user is not loaded, caching makes sure we dont fetch twice
  if (!userLoaded) return <div />

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='flex justify-center h-screen'>
        <div className='w-full md:max-w-2xl border-x border-slate-400'>
          <div className='border-b border-slate-400 p-4 flex'>
            {!isSignedIn && (
              <div className='flex justify-center'>
                <SignInButton />
              </div>
            )}
            {isSignedIn && <CreatePostWizard />}
          </div>
          <Feed />
        </div>
      </main>
    </>
  )
}

export default Home
