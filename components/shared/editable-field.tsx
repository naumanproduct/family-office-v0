"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"

export type FieldType = "text" | "textarea" | "date" | "select" | "combobox" | "email" | "phone" | "url" | "number"

export interface EditableFieldProps {
  value: any
  onChange: (value: any) => void
  type: FieldType
  placeholder?: string
  options?: ComboboxOption[] // For select/combobox types
  className?: string
  disabled?: boolean
  formatDisplay?: (value: any) => React.ReactNode // Custom display formatter
  minDate?: Date // For date picker
  maxDate?: Date // For date picker
}

export function EditableField({
  value,
  onChange,
  type,
  placeholder,
  options = [],
  className,
  disabled = false,
  formatDisplay,
  minDate,
  maxDate,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [localValue, setLocalValue] = React.useState(value)
  const [isHovered, setIsHovered] = React.useState(false)

  // Update local value when prop changes
  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleSave = () => {
    onChange(localValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setLocalValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && type !== "textarea") {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  // Render the display value
  const renderDisplayValue = () => {
    if (formatDisplay) {
      return formatDisplay(value)
    }

    switch (type) {
      case "date":
        if (!value) return placeholder || "Select date"
        try {
          const date = new Date(value)
          if (isNaN(date.getTime())) {
            return placeholder || "Select date"
          }
          return format(date, "PPP")
        } catch (error) {
          return placeholder || "Select date"
        }
      case "select":
      case "combobox":
        const option = options.find(opt => opt.value === value)
        return option?.label || value || placeholder || "Select option"
      case "email":
        return value ? <a href={`mailto:${value}`} className="text-blue-600 hover:underline">{value}</a> : placeholder || "No email"
      case "phone":
        return value ? <a href={`tel:${value}`} className="text-blue-600 hover:underline">{value}</a> : placeholder || "No phone"
      case "url":
        return value ? <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{value}</a> : placeholder || "No URL"
      default:
        return value || placeholder || "Click to edit"
    }
  }

  // Render the edit control
  const renderEditControl = () => {
    switch (type) {
      case "text":
      case "email":
      case "phone":
      case "url":
      case "number":
        return (
          <Input
            type={type === "number" ? "number" : "text"}
            value={localValue || ""}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            placeholder={placeholder}
            className="h-8 text-sm"
            autoFocus
          />
        )

      case "textarea":
        return (
          <Textarea
            value={localValue || ""}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            placeholder={placeholder}
            className="text-sm min-h-[60px]"
            autoFocus
          />
        )

      case "date":
        return (
          <Popover open={isEditing} onOpenChange={setIsEditing}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-8 w-full justify-start text-left font-normal text-sm",
                  !localValue && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {localValue ? (
                  (() => {
                    try {
                      const date = new Date(localValue)
                      if (isNaN(date.getTime())) {
                        return <span>{placeholder || "Pick a date"}</span>
                      }
                      return format(date, "PPP")
                    } catch (error) {
                      return <span>{placeholder || "Pick a date"}</span>
                    }
                  })()
                ) : (
                  <span>{placeholder || "Pick a date"}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={localValue && !isNaN(new Date(localValue).getTime()) ? new Date(localValue) : undefined}
                onSelect={(date) => {
                  setLocalValue(date?.toISOString())
                  onChange(date?.toISOString())
                  setIsEditing(false)
                }}
                disabled={(date) => {
                  if (minDate && date < minDate) return true
                  if (maxDate && date > maxDate) return true
                  return false
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )

      case "combobox":
        return (
          <Combobox
            options={options}
            value={localValue || ""}
            onValueChange={(newValue) => {
              setLocalValue(newValue)
              onChange(newValue)
              setIsEditing(false)
            }}
            placeholder={placeholder || "Select option"}
            className="h-8 w-full"
          />
        )

      case "select":
        return (
          <Popover open={isEditing} onOpenChange={setIsEditing}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isEditing}
                className="h-8 w-full justify-between text-sm"
              >
                {localValue
                  ? options.find((option) => option.value === localValue)?.label
                  : placeholder || "Select option"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder={`Search ${placeholder?.toLowerCase() || "options"}...`} />
                <CommandList>
                  <CommandEmpty>No option found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={(currentValue) => {
                          setLocalValue(currentValue)
                          onChange(currentValue)
                          setIsEditing(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            localValue === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )

      default:
        return null
    }
  }

  if (disabled) {
    return <div className={cn("text-sm", className)}>{renderDisplayValue()}</div>
  }

  if (isEditing && (type === "date" || type === "select" || type === "combobox")) {
    return <div className={cn("w-full", className)}>{renderEditControl()}</div>
  }

  if (isEditing) {
    return (
      <div className={cn("w-full", className)}>
        {renderEditControl()}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "text-sm cursor-pointer rounded px-2 py-1 -mx-2 -my-1 transition-colors",
        isHovered && "bg-muted/50",
        className
      )}
      onClick={() => !disabled && setIsEditing(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderDisplayValue()}
    </div>
  )
} 