import { create } from "zustand"
import { persist } from "zustand/middleware"

// docs for if you wanna add more stores
// https://github.com/pmndrs/zustand

interface DarkmodeState {
  darkmode: boolean
  toggleDarkmode: () => void
}

const useDarkmodeStore = create<DarkmodeState>()(
  persist(
    (set) => ({
      darkmode: true,
      toggleDarkmode: () => set((state) => ({ darkmode: !state.darkmode })),
    }),
    { name: "darkmode" }
  )
)

export const useDarkmode = () => useDarkmodeStore((state) => state.darkmode)
export const useToggleDarkmode = () => useDarkmodeStore((state) => state.toggleDarkmode)

interface TabState {
  tab: "For you" | "Following"
  toggleTab: () => void
}

const useTabStore = create<TabState>()(
  persist(
    (set) => ({
      tab: "For you",
      toggleTab: () =>
        set((state) => {
          if (state.tab === "For you")
            return {
              tab: "Following",
            }
          return { tab: "For you" }
        }),
    }),
    { name: "tab" }
  )
)

export const useTab = () => useTabStore((state) => state.tab)
export const useToggleTab = () => useTabStore((state) => state.toggleTab)
