"use client"

import * as React from "react"
import { Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  icon?: boolean
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, error, icon = true, ...props }, ref) => {
    // Function to validate date format (DD/MM/YYYY)
    const isValidDateFormat = (dateString: string): boolean => {
      if (!dateString) return true
      const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
      if (!regex.test(dateString)) return false

      // Additional validation for valid date
      const [day, month, year] = dateString.split("/").map(Number)
      const date = new Date(year, month - 1, day)
      return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    }

    // Handle input validation
    const [localError, setLocalError] = React.useState<string>("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      if (value && !isValidDateFormat(value)) {
        setLocalError("Please use DD/MM/YYYY format")
      } else {
        setLocalError("")
      }

      // Call the original onChange handler if provided
      if (props.onChange) {
        props.onChange(e)
      }
    }

    return (
      <div className="relative">
        <Input
          type="text"
          placeholder="DD/MM/YYYY"
          className={cn(error || localError ? "border-red-500" : "", className)}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        {icon && (
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        )}
        {(error || localError) && <p className="text-red-500 text-xs mt-1">{error || localError}</p>}
      </div>
    )
  },
)

DateInput.displayName = "DateInput"

export { DateInput }
