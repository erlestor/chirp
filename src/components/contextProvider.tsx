import { DarkmodeContext, TabContext, useDarkmode, useTab } from "~/utils/context"

export default function DarkmodeContextProvider({ children }: { children: React.ReactNode }) {
  const [darkmode, setDarkmode] = useDarkmode()

  const [tab, setTab] = useTab()

  return (
    <DarkmodeContext.Provider value={{ darkmode, setDarkmode }}>
      <TabContext.Provider value={{ tab, setTab }}>{children}</TabContext.Provider>
    </DarkmodeContext.Provider>
  )
}
