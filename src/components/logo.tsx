import { FaKiwiBird } from "react-icons/fa"
import { useDarkmodeContext } from "~/utils/context"

export const LogoPage = () => {
  const { darkmode } = useDarkmodeContext()

  return (
    <div className={darkmode ? "dark" : ""}>
      <div className="flex h-screen w-full items-center justify-center bg-white text-slate-900 dark:bg-black dark:text-slate-100">
        <FaKiwiBird size={60} />
      </div>
    </div>
  )
}
