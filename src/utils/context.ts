import { useContext } from "react"
import { useEffect, useState, createContext, useRef } from "react"
import type { Dispatch, SetStateAction } from "react"

export function useLocalStorage<T>(key: string, fallbackValue: T) {
  const [value, setValue] = useState(fallbackValue)
  const firstload = useRef(true)

  useEffect(() => {
    const stored = localStorage.getItem(key)
    setValue(stored ? (JSON.parse(stored) as T) : fallbackValue)
  }, [])

  useEffect(() => {
    if (firstload.current) {
      firstload.current = false
      return
    }
    localStorage.setItem(key, JSON.stringify(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return [value, setValue] as const
}

export function useDarkmode() {
  return useLocalStorage<boolean>("darkmode", true)
}

export const DarkmodeContext = createContext<{
  darkmode: boolean
  setDarkmode: Dispatch<SetStateAction<boolean>>
}>({
  darkmode: true,
  setDarkmode: (value) => {
    console.log("default func", value)
  },
})

export function useDarkmodeContext() {
  return useContext(DarkmodeContext)
}

export const tabs = ["For you", "Following"]

export function useTab() {
  return useLocalStorage<string>("tab", "For you")
}

export const TabContext = createContext<{
  tab: string
  setTab: Dispatch<SetStateAction<string>>
}>({
  tab: "For you",
  setTab: (value) => {
    console.log("default func", value)
  },
})

export function useTabContext() {
  return useContext(TabContext)
}
