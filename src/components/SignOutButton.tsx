import { useClerk } from "@clerk/nextjs"
import { Button } from "./button"

export const SignOutButton = () => {
  const { signOut } = useClerk()

  return (
    <Button
      onClick={() => {
        void signOut()
      }}
    >
      Sign out
    </Button>
  )
}
