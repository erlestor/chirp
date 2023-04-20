import Image from "next/image"

export const LogoPage = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Image src="/bird.png" alt="bird" width="90" height="50" />
    </div>
  )
}
