"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeftIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CreationType {
  id: string
  name: string
  description: string
  category?: string
  [key: string]: any // Allow additional properties
}

interface FormField {
  id: string
  label: string
  type: "text" | "textarea" | "select" | "number" | "date" | "readonly"
  placeholder?: string
  required?: boolean
  options?: string[] | { value: string; label: string }[]
  defaultValue?: string
  rows?: number
  min?: number
  max?: number
  step?: number
  gridCols?: number // For responsive grid layout
}

interface MasterCreationDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void

  // Configuration
  title: string
  description: string
  recordType: string
  avatarLetter: string
  avatarColor?: string

  // Type selection
  types: CreationType[]
  typeSelectionTitle: string

  // Form configuration
  formFields: FormField[]
  formHeaderContent?: React.ReactNode // Custom content to show at the top of the form

  // Validation
  requiredFields?: string[]

  // Custom handlers
  onTypeSelect?: (type: CreationType) => Partial<Record<string, any>>
}

export function MasterCreationDialog({
  isOpen,
  onClose,
  onSave,
  title,
  description,
  recordType,
  avatarLetter,
  avatarColor = "bg-primary",
  types,
  typeSelectionTitle,
  formFields,
  formHeaderContent,
  requiredFields = [],
  onTypeSelect,
}: MasterCreationDialogProps) {
  const [selectedType, setSelectedType] = useState<CreationType | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isDirty, setIsDirty] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<"close" | "back" | null>(null)

  // Initialize form data with default values
  useEffect(() => {
    const initialData: Record<string, any> = {}
    formFields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        initialData[field.id] = field.defaultValue
      }
    })
    setFormData(initialData)
  }, [formFields])

  const handleTypeSelect = (type: CreationType) => {
    setSelectedType(type)

    // Apply type-specific data
    const typeData = onTypeSelect ? onTypeSelect(type) : {}
    setFormData((prev) => ({
      ...prev,
      type: type.name,
      category: type.category,
      ...typeData,
    }))
    setIsDirty(true)
  }

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    setIsDirty(true)
  }

  const handleBackToSelection = () => {
    if (isDirty) {
      setPendingAction("back")
      setShowConfirmDialog(true)
    } else {
      executeBackToSelection()
    }
  }

  const executeBackToSelection = () => {
    setSelectedType(null)
    setFormData({})
    setIsDirty(false)
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
    executeBackToSelection()
    setIsDirty(false)
  }

  const handleClose = () => {
    if (isDirty) {
      setPendingAction("close")
      setShowConfirmDialog(true)
    } else {
      onClose()
    }
  }

  const handleConfirmAction = () => {
    if (pendingAction === "close") {
      onClose()
      executeBackToSelection()
    } else if (pendingAction === "back") {
      executeBackToSelection()
    }
    setIsDirty(false)
    setShowConfirmDialog(false)
  }

  const handleCancelAction = () => {
    setPendingAction(null)
    setShowConfirmDialog(false)
  }

  const isFormValid = () => {
    return requiredFields.every((fieldId) => {
      const value = formData[fieldId]
      return value !== undefined && value !== null && value !== ""
    })
  }

  const renderFormField = (field: FormField) => {
    const value = formData[field.id] || ""
    const gridClass = field.gridCols ? `col-span-${field.gridCols}` : ""

    switch (field.type) {
      case "readonly":
        return (
          <div key={field.id} className={`space-y-2 ${gridClass}`}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input id={field.id} value={value} readOnly className="bg-muted" />
          </div>
        )

      case "textarea":
        return (
          <div key={field.id} className={`space-y-2 ${gridClass}`}>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && " *"}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              rows={field.rows || 3}
            />
          </div>
        )

      case "select":
        return (
          <div key={field.id} className={`space-y-2 ${gridClass}`}>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && " *"}
            </Label>
            <Select value={value} onValueChange={(val) => handleInputChange(field.id, val)}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => {
                  const optionValue = typeof option === "string" ? option : option.value
                  const optionLabel = typeof option === "string" ? option : option.label
                  return (
                    <SelectItem key={optionValue} value={optionValue}>
                      {optionLabel}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        )

      case "number":
        return (
          <div key={field.id} className={`space-y-2 ${gridClass}`}>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && " *"}
            </Label>
            <Input
              id={field.id}
              type="number"
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              min={field.min}
              max={field.max}
              step={field.step}
            />
          </div>
        )

      case "date":
        return (
          <div key={field.id} className={`space-y-2 ${gridClass}`}>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && " *"}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          </div>
        )

      default: // text
        return (
          <div key={field.id} className={`space-y-2 ${gridClass}`}>
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && " *"}
            </Label>
            <Input
              id={field.id}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          </div>
        )
    }
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent side="right" className="flex w-full max-w-2xl flex-col p-0 sm:max-w-2xl [&>button]:hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={selectedType ? handleBackToSelection : handleClose}>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Badge variant="secondary">{selectedType ? `${recordType} Details` : `${recordType} Type`}</Badge>
            </div>
          </div>

          {/* Record Header */}
          <div className="border-b bg-background px-6 py-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${avatarColor} text-white text-sm font-medium`}
              >
                {avatarLetter}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{selectedType ? `Add ${selectedType.name}` : title}</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedType ? description : `Select the type of ${recordType.toLowerCase()} you want to add`}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {!selectedType ? (
              // Type Selection
              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">{typeSelectionTitle}</h3>
                  {/* Custom Workflow first */}
                  {types
                    .filter((t) => t.isCustom)
                    .map((type) => (
                      <Card
                        key={type.id}
                        className="cursor-pointer transition-all duration-200 hover:shadow-md"
                        onClick={() => handleTypeSelect(type)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base font-medium">{type.name}</CardTitle>
                              <CardDescription className="text-sm mt-1">{type.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}

                  {/* Separator heading */}
                  {types.some((t) => !t.isCustom) && (
                    <div className="text-xs font-semibold text-muted-foreground uppercase mt-6 mb-2">Templates</div>
                  )}

                  {/* Other templates */}
                  {types
                    .filter((t) => !t.isCustom)
                    .map((type) => (
                      <Card
                        key={type.id}
                        className="cursor-pointer transition-all duration-200 hover:shadow-md"
                        onClick={() => handleTypeSelect(type)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base font-medium">{type.name}</CardTitle>
                              <CardDescription className="text-sm mt-1">{type.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        {type.category && (
                          <CardContent className="pt-0">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Category: {type.category}</span>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                </div>
              </div>
            ) : (
              // Form
              <div className="space-y-6">
                {formHeaderContent && formHeaderContent}
                <div className="grid grid-cols-2 gap-4">{formFields.map(renderFormField)}</div>
              </div>
            )}
          </div>

          {/* Footer */}
          {selectedType && (
            <div className="border-t bg-background px-6 py-4">
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleBackToSelection}>
                  Back
                </Button>
                <Button onClick={handleSave} disabled={!isFormValid()}>
                  Create {recordType}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelAction}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
