import type { Column } from "@tanstack/react-table"

/**
 * Returns the common pinning styles for a column.
 */
export function getCommonPinningStyles<TData>({
  column,
}: {
  column: Column<TData>
}): React.CSSProperties {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn = column.getIsLastColumn("left")
  const isFirstRightPinnedColumn = column.getIsFirstColumn("right")

  return {
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    borderRightWidth: isLastLeftPinnedColumn ? "1px" : undefined,
    borderLeftWidth: isFirstRightPinnedColumn ? "1px" : undefined,
  }
}

/**
 * Defines the filter variant types for columns
 */
export type FilterVariant = 
  | "text"
  | "select" 
  | "multi-select"
  | "date"
  | "date-range"
  | "number"
  | "boolean"

/**
 * Defines the structure for filter options
 */
export interface FilterOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  count?: number
}

/**
 * Extended column meta for filtering
 */
export interface DataTableColumnMeta {
  label?: string
  variant?: FilterVariant
  options?: FilterOption[]
  placeholder?: string
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> extends DataTableColumnMeta {}
}