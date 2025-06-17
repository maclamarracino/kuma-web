import { ReactNode } from "react"

interface AlertProps {
  children: ReactNode
  variant?: "success" | "error" | "warning" | "info" | "destructive"
}

export function Alert({ children, variant = "info" }: AlertProps) {
  const baseClasses = "border p-4 rounded"
  const variantClasses = {
    success: "border-green-400 bg-green-100 text-green-800",
    error: "border-red-400 bg-red-100 text-red-800",
    warning: "border-yellow-400 bg-yellow-100 text-yellow-800",
    info: "border-blue-400 bg-blue-100 text-blue-800",
    destructive: "border-red-600 bg-red-200 text-red-900",
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </div>
  )
}

export function AlertDescription({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-sm text-yellow-700">{children}</p>
}

