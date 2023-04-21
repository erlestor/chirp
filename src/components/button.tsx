import type { ReactNode } from "react"

export const Button = (props: {
  children: ReactNode
  className?: string
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  disabled?: boolean
  contained?: boolean
}) => {
  const { contained, className } = props

  return (
    <button
      {...props}
      className={`rounded-full border border-slate-400 px-4 py-1.5 text-center font-semibold ${
        contained ? "bg-slate-100 text-black" : ""
      } ${className ?? ""}`}
    >
      {props.children}
    </button>
  )
}
