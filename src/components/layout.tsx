/* eslint-disable react/no-unescaped-entities */
import { SignInButton, useUser } from "@clerk/nextjs"
import type { PropsWithChildren } from "react"

export const PageLayout = (props: PropsWithChildren) => {
  const { isLoaded, isSignedIn } = useUser()

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="w-full md:max-w-2xl border-x border-slate-400 min-h-screen">
        {props.children}
      </div>
      {isLoaded && !isSignedIn && (
        <div className="fixed bottom-0 p-4 bg-black w-full justify-center flex gap-4">
          <div className="text-xl">Don't miss what's happening</div>
          <SignInButton />
        </div>
      )}
    </main>
  )
}
