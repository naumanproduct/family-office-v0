"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeftIcon, MoreVerticalIcon, PlusIcon } from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isDirty, setIsDirty] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<"close" | "back" | null>(null)
  
  // Editable types state
  const [typesState, setTypesState] = useState(types)
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  
  // Delete confirmation
  const [typeToDelete, setTypeToDelete] = useState<CreationType | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Reset local types when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTypesState(types)
      setEditingTypeId(null)
      setTypeToDelete(null)
    }
  }, [isOpen, types])

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

  const startEditType = (type: CreationType) => {
    setEditingTypeId(type.id)
    setEditName(type.name)
    setEditDescription(type.description)
  }

  const saveEditType = () => {
    setTypesState((prev) =>
      prev.map((t) => (t.id === editingTypeId ? { ...t, name: editName, description: editDescription } : t)),
    )
    setEditingTypeId(null)
  }
  
  const cancelEditType = () => {
    setEditingTypeId(null)
  }
  
  const confirmDeleteType = (type: CreationType) => {
    setTypeToDelete(type)
    setShowDeleteConfirm(true)
  }
  
  const executeDeleteType = () => {
    if (typeToDelete) {
      setTypesState((prev) => prev.filter((t) => t.id !== typeToDelete.id))
      setShowDeleteConfirm(false)
      setTypeToDelete(null)
    }
  }

  const renderTypeCard = (type: CreationType) => {
    return (
      <div
        key={type.id}
        className="group relative rounded-lg border border-border bg-card transition-all duration-200 hover:shadow-sm"
      >
        {/* More menu button */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => startEditType(type)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => confirmDeleteType(type)} className="text-red-600 focus:text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {editingTypeId === type.id ? (
          <div className="p-4 space-y-3">
            <div className="text-sm font-medium text-card-foreground">Edit {recordType} Type</div>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-8 text-sm"
              placeholder="Name"
            />
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              placeholder="Description"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveEditType} disabled={!editName.trim()}>
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={cancelEditType}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="group flex items-center space-x-3 p-4 cursor-pointer"
            onClick={() => handleTypeSelect(type)}
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                type.isCustom ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
              }`}
            >
              <PlusIcon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-card-foreground">{type.name}</div>
              <div className="text-xs text-muted-foreground">{type.description}</div>
            </div>
          </div>
        )}
              </div>
    )
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent side="right" className="flex w-full max-w-[30vw] flex-col p-0 sm:max-w-[30vw] [&>button]:hidden overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={selectedType ? handleBackToSelection : handleClose}>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="bg-background">{selectedType ? `${recordType} Details` : `${recordType} Type`}</Badge>
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
                {/* Search field */}
                <Input
                  placeholder={`Search ${recordType.toLowerCase()} types...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />

                <div className="space-y-3">
                  {/* Custom Workflow first */}
                  {typesState
                    .filter((t) =>
                      `${t.name} ${t.description}`.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .filter((t) => t.isCustom)
                    .map((type) => renderTypeCard(type))}

                  {/* Show heading only if there are non-custom types */}
                  {typesState.filter((t) => !t.isCustom && `${t.name} ${t.description}`.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 && (
                    <h3 className="text-sm font-medium text-muted-foreground mt-4 mb-3">
                      {recordType === "File" ? "Import from" : "Templates"}
                    </h3>
                  )}

                  {/* Other templates */}
                  {typesState
                    .filter((t) =>
                      `${t.name} ${t.description}`.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .filter((t) => !t.isCustom)
                    .map((type) => renderTypeCard(type))}
                </div>
              </div>
            ) : (
              // Form
              <div className="space-y-6">
                {formHeaderContent && formHeaderContent}
                {/*
                  Use a single-column layout to reduce cognitive load and make
                  each field/value pair clearer. We keep vertical spacing
                  between fields instead of a two-column grid.
                */}
                <div className="space-y-6">{formFields.map(renderFormField)}</div>
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

      {/* Unsaved changes confirmation dialog */}
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
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {recordType} Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{typeToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeDeleteType} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
