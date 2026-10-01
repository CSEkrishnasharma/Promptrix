import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/src/lib/utils"

const buttonVariants = cva(
  "relative cursor-pointer z-0 inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:transition-transform before:duration-1000 before:content-[''] hover:scale-105 hover:before:translate-x-[0%] hover:before:translate-y-[0%] active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 before:bg-zinc-800 dark:before:bg-zinc-200 hover:text-zinc-100 dark:hover:text-zinc-900",
        destructive: "bg-red-500 text-slate-50 border border-red-600 before:bg-red-700 hover:text-white",
        outline: "border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 before:bg-zinc-100 dark:before:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100",
        secondary: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 before:bg-zinc-200 dark:before:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100",
        ghost: "bg-transparent text-zinc-600 dark:text-zinc-300 before:bg-zinc-100 dark:before:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50",
        link: "text-indigo-500 underline-offset-4 hover:underline before:hidden hover:scale-100",
        glass: "bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white before:bg-black/10 dark:before:bg-white/10 hover:text-zinc-900 dark:hover:text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
