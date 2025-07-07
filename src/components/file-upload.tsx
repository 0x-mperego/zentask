"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  File,
  Image,
  FileText,
  X,
  Download,
  Eye,
  AlertCircle,
} from "lucide-react"

export interface FileItem {
  id: string
  file?: File
  name: string
  size: number
  type: string
  url?: string
  uploadProgress?: number
  error?: string
}

interface FileUploadProps {
  value?: FileItem[]
  onChange?: (files: FileItem[]) => void
  onUpload?: (files: File[]) => Promise<void>
  onRemove?: (fileId: string) => void
  onDownload?: (file: FileItem) => void
  onPreview?: (file: FileItem) => void
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in bytes
  disabled?: boolean
  loading?: boolean
  className?: string
  dragActiveClassName?: string
  placeholder?: {
    title?: string
    description?: string
  }
}

const ALLOWED_TYPES = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  document: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  text: ["text/plain", "text/csv"],
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024 // 10MB

export function FileUpload({
  value = [],
  onChange,
  onUpload,
  onRemove,
  onDownload,
  onPreview,
  accept,
  multiple = true,
  maxFiles = 10,
  maxSize = DEFAULT_MAX_SIZE,
  disabled = false,
  loading = false,
  className,
  dragActiveClassName = "border-primary bg-primary/5",
  placeholder = {
    title: "Trascina i file qui o clicca per selezionare",
    description: "Supporta file fino a 10MB"
  },
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = React.useState(false)
  const [dragCounter, setDragCounter] = React.useState(0)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const getFileIcon = React.useCallback((fileType: string) => {
    if (ALLOWED_TYPES.image.includes(fileType)) {
      return <Image className="h-4 w-4" />
    }
    if (ALLOWED_TYPES.document.includes(fileType) || fileType === "application/pdf") {
      return <FileText className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }, [])

  const formatFileSize = React.useCallback((bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }, [])

  const validateFile = React.useCallback((file: File) => {
    const errors: string[] = []

    if (file.size > maxSize) {
      errors.push(`File troppo grande (max ${formatFileSize(maxSize)})`)
    }

    if (accept) {
      const acceptedTypes = accept.split(",").map(type => type.trim())
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        return file.type.match(type)
      })
      
      if (!isAccepted) {
        errors.push("Tipo di file non supportato")
      }
    }

    return errors
  }, [accept, maxSize, formatFileSize])

  const processFiles = React.useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const currentCount = value.length
    const availableSlots = maxFiles - currentCount

    if (fileArray.length > availableSlots) {
      console.warn(`Massimo ${maxFiles} file consentiti. Solo i primi ${availableSlots} file saranno aggiunti.`)
    }

    const filesToProcess = multiple 
      ? fileArray.slice(0, availableSlots)
      : fileArray.slice(0, 1)

    const newFiles: FileItem[] = []

    filesToProcess.forEach((file) => {
      const errors = validateFile(file)
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      newFiles.push({
        id: fileId,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadProgress: 0,
        error: errors.length > 0 ? errors.join(", ") : undefined,
      })
    })

    const updatedFiles = multiple ? [...value, ...newFiles] : newFiles
    onChange?.(updatedFiles)

    // Auto-upload if handler provided
    if (onUpload && newFiles.filter(f => !f.error).length > 0) {
      const validFiles = newFiles.filter(f => !f.error && f.file).map(f => f.file!)
      onUpload(validFiles).catch(console.error)
    }
  }, [value, onChange, onUpload, maxFiles, multiple, validateFile])

  const handleFileSelect = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [processFiles])

  const handleDragEnter = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev + 1)
    setIsDragActive(true)
  }, [])

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => {
      const newCounter = prev - 1
      if (newCounter === 0) {
        setIsDragActive(false)
      }
      return newCounter
    })
  }, [])

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    setDragCounter(0)

    if (disabled || loading) return

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processFiles(files)
    }
  }, [disabled, loading, processFiles])

  const handleRemove = React.useCallback((fileId: string) => {
    if (onRemove) {
      onRemove(fileId)
    } else {
      const updatedFiles = value.filter(file => file.id !== fileId)
      onChange?.(updatedFiles)
    }
  }, [value, onChange, onRemove])

  const openFileDialog = React.useCallback(() => {
    if (!disabled && !loading) {
      fileInputRef.current?.click()
    }
  }, [disabled, loading])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors",
          isDragActive && dragActiveClassName,
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "cursor-pointer hover:border-primary/50"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Upload className={cn("h-10 w-10 mb-4", isDragActive ? "text-primary" : "text-muted-foreground")} />
          <h3 className="text-lg font-medium mb-2">
            {placeholder.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {placeholder.description}
          </p>
          <Button variant="outline" disabled={disabled || loading}>
            Seleziona File
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            disabled={disabled || loading}
          />
        </CardContent>
      </Card>

      {/* File List */}
      {value.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">File allegati ({value.length})</h4>
            {value.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange?.([])}
                disabled={disabled || loading}
              >
                Rimuovi tutti
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {value.map((file) => (
              <Card key={file.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        {file.error && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Errore
                          </Badge>
                        )}
                      </div>
                      {file.error && (
                        <p className="text-xs text-destructive mt-1">{file.error}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {file.url && onPreview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPreview(file)}
                        disabled={disabled}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {file.url && onDownload && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownload(file)}
                        disabled={disabled}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(file.id)}
                      disabled={disabled || loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Upload Progress */}
                {typeof file.uploadProgress === "number" && file.uploadProgress < 100 && (
                  <div className="mt-2">
                    <Progress value={file.uploadProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Caricamento... {file.uploadProgress}%
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}