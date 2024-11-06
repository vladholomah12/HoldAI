"use client"

import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  children,
  variant = 'default',
  size = 'default',
  ...props
}, ref) => {
  return (
    <button
      className={cn(
        "rounded-lg font-medium transition-colors",
        {
          'default': 'bg-blue-600 text-white hover:bg-blue-700',
          'outline': 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
          'ghost': 'text-blue-600 hover:bg-blue-50'
        }[variant],
        {
          'default': 'h-10 px-4 py-2',
          'sm': 'h-8 px-3 py-1',
          'lg': 'h-12 px-6 py-3'
        }[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = "Button"

export { Button }