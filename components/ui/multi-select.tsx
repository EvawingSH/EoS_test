"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Badge } from "./badge"
import { Command, CommandGroup, CommandItem } from "./command"
import { Command as CommandPrimitive } from "cmdk"

export interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  id?: string
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
}

export function MultiSelect({ id, options, selected, onChange, placeholder }: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleUnselect = React.useCallback(
    (optionValue: string) => {
      onChange(selected.filter((s) => s !== optionValue))
    },
    [onChange, selected],
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const newSelected = [...selected]
            newSelected.pop()
            onChange(newSelected)
          }
        }
        if (e.key === "Escape") {
          input.blur()
          setOpen(false)
        }
      }
    },
    [onChange, selected],
  )

  // Filter options that are not already selected
  const selectables = React.useMemo(
    () => options.filter((option) => !selected.includes(option.value) || option.value === "all"),
    [options, selected],
  )

  // Handle selection of an option
  const handleSelect = React.useCallback(
    (value: string) => {
      setInputValue("")

      // If "all" is selected, clear other selections
      if (value === "all") {
        onChange(["all"])
        return
      }

      // If selecting a non-"all" option, remove "all" from the selection
      let newSelected = selected.includes("all") ? selected.filter((s) => s !== "all") : [...selected]

      // Toggle the selection
      if (newSelected.includes(value)) {
        newSelected = newSelected.filter((s) => s !== value)
        // If nothing is selected, default to "all"
        if (newSelected.length === 0) {
          newSelected = ["all"]
        }
      } else {
        newSelected.push(value)
      }

      onChange(newSelected)
    },
    [onChange, selected],
  )

  // Add click outside handler
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={containerRef}>
      <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent" id={id}>
        <div
          className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.map((optionValue) => {
              const selectedOption = options.find((o) => o.value === optionValue)
              return selectedOption ? (
                <Badge key={optionValue} variant="secondary">
                  {selectedOption.label}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(optionValue)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUnselect(optionValue)
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ) : null
            })}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => {
                setOpen(false)
                setInputValue("")
              }}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
            />
          </div>
        </div>
        <div className="relative mt-2">
          {open && selectables.length > 0 ? (
            <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto max-h-[200px]">
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onSelect={() => {
                        handleSelect(option.value)
                        // Close the dropdown after selection
                        setOpen(false)
                      }}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </div>
          ) : null}
        </div>
      </Command>
    </div>
  )
}
