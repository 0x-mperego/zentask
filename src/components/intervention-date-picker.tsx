"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"

interface InterventionDatePickerProps {
  value?: DateRange
  onChange?: (dateRange: DateRange | undefined) => void
}

export function InterventionDatePicker({ value, onChange }: InterventionDatePickerProps) {
  return (
    <Calendar
      mode="range"
      defaultMonth={value?.from}
      selected={value}
      onSelect={onChange}
      className="rounded-lg border shadow-sm"
      numberOfMonths={1}
    />
  )
}