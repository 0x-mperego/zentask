"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Filter,
  X,
  Download,
  Calendar as CalendarIcon,
  ChevronDown,
} from "lucide-react"
import { format } from "date-fns"
import { it } from "date-fns/locale"

export interface FilterOption {
  label: string
  value: string
}

export interface DateRange {
  from?: Date
  to?: Date
}

export interface FilterConfig {
  key: string
  label: string
  type: "select" | "multiselect" | "daterange" | "text"
  options?: FilterOption[]
  placeholder?: string
}

export interface FilterValue {
  search?: string
  dateRange?: DateRange
  filters: Record<string, string | string[]>
}

interface FilterToolbarProps {
  searchPlaceholder?: string
  filters?: FilterConfig[]
  value?: FilterValue
  onChange?: (value: FilterValue) => void
  onExport?: () => void
  exportLabel?: string
  showExport?: boolean
  showClearAll?: boolean
  className?: string
  loading?: boolean
}

export function FilterToolbar({
  searchPlaceholder = "Cerca...",
  filters = [],
  value = { filters: {} },
  onChange,
  onExport,
  exportLabel = "Esporta Excel",
  showExport = true,
  showClearAll = true,
  className,
  loading = false,
}: FilterToolbarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false)
  const [datePickerOpen, setDatePickerOpen] = React.useState<string | null>(null)

  const handleSearchChange = React.useCallback((search: string) => {
    onChange?.({
      ...value,
      search,
    })
  }, [value, onChange])

  const handleFilterChange = React.useCallback((key: string, filterValue: string | string[]) => {
    onChange?.({
      ...value,
      filters: {
        ...value.filters,
        [key]: filterValue,
      },
    })
  }, [value, onChange])

  const handleDateRangeChange = React.useCallback((dateRange: DateRange) => {
    onChange?.({
      ...value,
      dateRange,
    })
  }, [value, onChange])

  const clearAllFilters = React.useCallback(() => {
    onChange?.({
      search: "",
      dateRange: undefined,
      filters: {},
    })
    setIsFiltersOpen(false)
  }, [onChange])

  const getActiveFiltersCount = React.useCallback(() => {
    let count = 0
    
    if (value.search) count++
    if (value.dateRange?.from || value.dateRange?.to) count++
    
    Object.values(value.filters).forEach(filterValue => {
      if (Array.isArray(filterValue)) {
        if (filterValue.length > 0) count++
      } else if (filterValue) {
        count++
      }
    })
    
    return count
  }, [value])

  const renderFilterBadges = React.useCallback(() => {
    const badges: React.ReactNode[] = []

    // Search badge
    if (value.search) {
      badges.push(
        <Badge key="search" variant="secondary" className="gap-1">
          <Search className="h-3 w-3" />
          {value.search}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => handleSearchChange("")}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )
    }

    // Date range badge
    if (value.dateRange?.from || value.dateRange?.to) {
      const { from, to } = value.dateRange
      const label = from && to 
        ? `${format(from, "dd/MM/yyyy", { locale: it })} - ${format(to, "dd/MM/yyyy", { locale: it })}`
        : from 
        ? `Dal ${format(from, "dd/MM/yyyy", { locale: it })}`
        : to
        ? `Fino al ${format(to, "dd/MM/yyyy", { locale: it })}`
        : ""

      badges.push(
        <Badge key="daterange" variant="secondary" className="gap-1">
          <CalendarIcon className="h-3 w-3" />
          {label}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => handleDateRangeChange({})}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )
    }

    // Filter badges
    filters.forEach(filter => {
      const filterValue = value.filters[filter.key]
      if (!filterValue) return

      if (Array.isArray(filterValue) && filterValue.length > 0) {
        badges.push(
          <Badge key={filter.key} variant="secondary" className="gap-1">
            {filter.label}: {filterValue.length} selezionati
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => handleFilterChange(filter.key, [])}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )
      } else if (typeof filterValue === "string" && filterValue) {
        const option = filter.options?.find(opt => opt.value === filterValue)
        badges.push(
          <Badge key={filter.key} variant="secondary" className="gap-1">
            {filter.label}: {option?.label || filterValue}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => handleFilterChange(filter.key, "")}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )
      }
    })

    return badges
  }, [value, filters, handleSearchChange, handleDateRangeChange, handleFilterChange])

  const activeFiltersCount = getActiveFiltersCount()
  const activeBadges = renderFilterBadges()

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Toolbar */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={value.search || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
            disabled={loading}
          />
        </div>

        {/* Filters Toggle */}
        {filters.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="gap-2"
            disabled={loading}
          >
            <Filter className="h-4 w-4" />
            Filtri
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
            <ChevronDown className={cn("h-4 w-4 transition-transform", isFiltersOpen && "rotate-180")} />
          </Button>
        )}

        {/* Export */}
        {showExport && (
          <Button onClick={onExport} disabled={loading} className="gap-2">
            <Download className="h-4 w-4" />
            {exportLabel}
          </Button>
        )}
      </div>

      {/* Active Filters Badges */}
      {activeBadges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtri attivi:</span>
          {activeBadges}
          {showClearAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-6 text-xs text-muted-foreground"
            >
              Rimuovi tutti
            </Button>
          )}
        </div>
      )}

      {/* Expandable Filters */}
      {isFiltersOpen && filters.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filters.map((filter) => {
                const filterValue = value.filters[filter.key]

                if (filter.type === "select") {
                  return (
                    <div key={filter.key} className="space-y-2">
                      <Label>{filter.label}</Label>
                      <Select
                        value={typeof filterValue === "string" ? filterValue : ""}
                        onValueChange={(val) => handleFilterChange(filter.key, val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={filter.placeholder || `Seleziona ${filter.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {filter.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )
                }

                if (filter.type === "text") {
                  return (
                    <div key={filter.key} className="space-y-2">
                      <Label>{filter.label}</Label>
                      <Input
                        placeholder={filter.placeholder}
                        value={typeof filterValue === "string" ? filterValue : ""}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      />
                    </div>
                  )
                }

                return null
              })}

              {/* Date Range Filter */}
              <div className="space-y-2">
                <Label>Periodo</Label>
                <Popover open={datePickerOpen === "daterange"} onOpenChange={(open) => setDatePickerOpen(open ? "daterange" : null)}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {value.dateRange?.from ? (
                        value.dateRange.to ? (
                          <>
                            {format(value.dateRange.from, "dd/MM/yyyy", { locale: it })} -{" "}
                            {format(value.dateRange.to, "dd/MM/yyyy", { locale: it })}
                          </>
                        ) : (
                          format(value.dateRange.from, "dd/MM/yyyy", { locale: it })
                        )
                      ) : (
                        <span>Seleziona periodo</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={value.dateRange?.from}
                      selected={{
                        from: value.dateRange?.from,
                        to: value.dateRange?.to,
                      }}
                      onSelect={(range) => {
                        handleDateRangeChange({
                          from: range?.from,
                          to: range?.to,
                        })
                        if (range?.from && range?.to) {
                          setDatePickerOpen(null)
                        }
                      }}
                      numberOfMonths={2}
                      locale={it}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}