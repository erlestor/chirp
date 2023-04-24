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

export const DarkmodeContext = createContext<boolean>(true)

export const SetDarkmodeContext = createContext<Dispatch<SetStateAction<boolean>>>((value) => {
  console.log("Setting darkmode to ", value)
})

export function useDarkmodeContext() {
  return useContext(DarkmodeContext)
}

export function useSetDarkmodeContext() {
  return useContext(SetDarkmodeContext)
}
