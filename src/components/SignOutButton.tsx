import { useClerk } from "@clerk/nextjs"

export const SignOutButton = () => {
  const { signOut } = useClerk()

  return (
    <div className="p-4 bg-red w-16">
      <button onClick={void signOut}>Sign out</button>
    </div>
  )
}
