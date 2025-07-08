"use client"

import * as React from "react"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface InterventionDatePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function InterventionDatePicker({
  value,
  onChange,
  placeholder = "Seleziona intervallo date",
  className,
  disabled = false,
}: InterventionDatePickerProps) {
  const formatDateRange = (range: DateRange | undefined) => {
    if (!range) return placeholder

    if (range.from) {
      if (range.to) {
        return `${format(range.from, "dd/MM/yyyy", { locale: it })} - ${format(range.to, "dd/MM/yyyy", { locale: it })}`
      }
      return format(range.from, "dd/MM/yyyy", { locale: it })
    }

    return placeholder
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
            variant="outline"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(value)}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            className="rounded-lg border shadow-sm"
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}