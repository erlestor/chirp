import type { ButtonHTMLAttributes } from "react"
import { cva } from "class-variance-authority"
import type { VariantProps } from "class-variance-authority"

const button = cva(
  "rounded-full border border-slate-400 px-4 py-1.5 text-center font-medium disabled:brightness-50",
  {
    variants: {
      contained: {
        true: "bg-slate-100 text-black enabled:hover:brightness-90 transition",
      },
    },
    defaultVariants: {
      contained: false,
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = ({ className, contained, ...props }: ButtonProps) => (
  <button className={button({ className, contained })} {...props} />
)
