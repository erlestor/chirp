import { ReactNode } from "react"

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
        "font-semibold px-4 py-1.5 border border-slate-400 rounded-full text-center" +
        " " +
        extraClassNames
      }
    >
      {props.children}
    </button>
  )
}
