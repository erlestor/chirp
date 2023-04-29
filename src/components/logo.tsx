import { FaKiwiBird } from "react-icons/fa"
import { PageLayout } from "./layout"

export const LogoPage = () => {
  return (
    <PageLayout layout="simple">
      <div className="flex h-screen w-full items-center justify-center ">
        <FaKiwiBird size={60} />
      </div>
    </PageLayout>
  )
}
