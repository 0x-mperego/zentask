"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { X, Save, Loader2 } from "lucide-react"

interface FormSheetProps {
  title: string
  description?: string
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent) => void | Promise<void>
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  loading?: boolean
  disabled?: boolean
  size?: "sm" | "default" | "lg" | "xl" | "2xl" | "full"
  className?: string
}

const sizeClasses = {
  sm: "max-w-sm",
  default: "max-w-md",
  lg: "max-w-lg", 
  xl: "max-w-xl",
  "2xl": "max-w-6xl",
  full: "max-w-full",
}

export function FormSheet({
  title,
  description,
  trigger,
  open,
  onOpenChange,
  children,
  onSubmit,
  onCancel,
  submitLabel = "Salva",
  cancelLabel = "Annulla",
  loading = false,
  disabled = false,
  size = "default",
  className,
}: FormSheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  
  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }, [isControlled, onOpenChange])

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading || disabled) return
    
    try {
      await onSubmit?.(e)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }, [onSubmit, loading, disabled])

  const handleCancel = React.useCallback(() => {
    if (loading) return
    onCancel?.()
    handleOpenChange(false)
  }, [onCancel, loading, handleOpenChange])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape" && !loading) {
      handleCancel()
    }
  }, [handleCancel, loading])

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      
      <SheetContent 
        className={cn("flex flex-col", sizeClasses[size], className)}
        onKeyDown={handleKeyDown}
        onInteractOutside={(e) => {
          if (loading) {
            e.preventDefault()
          }
        }}
      >
        {/* Header */}
        <SheetHeader className="space-y-2 px-6 pt-4 pb-2">
          <SheetTitle className="text-left">{title}</SheetTitle>
          {description && (
            <SheetDescription className="text-left">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>

        {/* Form Content */}
        <form 
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col"
        >
          <div className="flex-1 space-y-6 overflow-y-auto px-6">
            {children}
          </div>


          {/* Footer */}
          <SheetFooter className="flex-shrink-0 pt-6 pb-6 px-6">
            <Button
              type="submit"
              disabled={loading || disabled}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {submitLabel}
                </>
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

// Hook for managing form sheet state
export function useFormSheet() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  
  const handleSubmit = React.useCallback(async (submitFn: () => Promise<void> | void) => {
    try {
      setLoading(true)
      await submitFn()
      setIsOpen(false)
    } catch (error) {
      console.error("Submit error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    isOpen,
    loading,
    open,
    close,
    handleSubmit,
    setLoading,
  }
}