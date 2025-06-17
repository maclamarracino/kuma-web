import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  children: React.ReactNode
  className?: string
}

export function Button({
  variant = "default",
  size = "default",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"
  
  const variantStyles = {
    default: "bg-[#8a7e55] text-white hover:bg-[#736a47]",
    outline: "border border-[#8a7e55] text-[#8a7e55] bg-transparent hover:bg-[#f5efe6]",
    ghost: "bg-transparent hover:bg-gray-100"
  }
  
  const sizeStyles = {
    default: "h-10 py-2 px-4",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10"
  }
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`
  
  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  )
}
