import type { ReactNode } from "react"

export const Button = (props: {
  children: ReactNode
  className?: string
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  disabled?: boolean
}) => {
  const extraClassNames = props.className ?? ""

  return (
    <button
      {...props}
      className={
        "rounded-full border border-slate-400 px-4 py-1.5 text-center font-semibold" +
        " " +
        extraClassNames
      }
    >
      {props.children}
    </button>
  )
}
