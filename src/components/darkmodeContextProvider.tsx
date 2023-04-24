import { DarkmodeContext, SetDarkmodeContext, useDarkmode } from "~/utils/darkmode"

export default function DarkmodeContextProvider({ children }: { children: React.ReactNode }) {
  const [darkmode, setDarkmode] = useDarkmode()

  return (
    <DarkmodeContext.Provider value={darkmode}>
      <SetDarkmodeContext.Provider value={setDarkmode}>{children}</SetDarkmodeContext.Provider>
    </DarkmodeContext.Provider>
  )
}
