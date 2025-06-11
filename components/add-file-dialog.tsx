"use client"

import { MasterCreationDialog } from "./master-creation-dialog"

// File types
const fileTypes = [
  {
    id: "document",
    name: "Document",
    description: "Text-based documents like contracts, memos, or reports.",
    category: "Files",
  },
  {
    id: "spreadsheet",
    name: "Spreadsheet",
    description: "Financial models, calculations, or data tables.",
    category: "Files",
  },
  {
    id: "presentation",
    name: "Presentation",
    description: "Slides, pitch decks, or visual presentations.",
    category: "Files",
  },
  {
    id: "image",
    name: "Image",
    description: "Photos, diagrams, or visual assets.",
    category: "Files",
  },
  {
    id: "other",
    name: "Other",
    description: "Any other type of file.",
    category: "Files",
  },
]

// Define FormField type to match what MasterCreationDialog expects
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
  gridCols?: number
}

// Form fields configuration
const fileFormFields: FormField[] = [
  {
    id: "title",
    label: "Title",
    type: "text",
    placeholder: "Enter file title",
    required: true,
  },
  {
    id: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter file description",
    rows: 3,
  },
  {
    id: "file",
    label: "File",
    type: "text", // This would be a file upload field in a real implementation
    placeholder: "Upload a file (not implemented in this demo)",
    required: true,
  },
  {
    id: "category",
    label: "Category",
    type: "select",
    placeholder: "Select category",
    options: ["Legal", "Financial", "Due Diligence", "Marketing", "Research", "Other"],
  },
  {
    id: "tags",
    label: "Tags",
    type: "text",
    placeholder: "Enter tags separated by commas",
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    placeholder: "Select status",
    options: ["Draft", "Under Review", "Final"],
    defaultValue: "Draft",
  },
  {
    id: "relatedTo",
    label: "Related To",
    type: "select",
    placeholder: "Select related record",
    options: [
      { value: "", label: "None" },
      { value: "acme-corp", label: "Acme Corp (Company)" },
      { value: "xyz-holdings", label: "XYZ Holdings (Entity)" },
      { value: "opportunity-123", label: "Tech Acquisition (Opportunity)" },
    ],
  },
]

interface AddFileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddFileDialog({ open, onOpenChange }: AddFileDialogProps) {
  const handleSave = (data: any) => {
    console.log("File data saved:", data)
    // Here you would typically save the data to your backend
  }

  const handleTypeSelect = (type: any) => {
    // Return any type-specific default values
    return {
      fileType: type.id,
    }
  }

  return (
    <MasterCreationDialog
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onSave={handleSave}
      title="Add New File"
      description="Upload a new file to the system"
      recordType="File"
      avatarLetter="F"
      avatarColor="bg-blue-600"
      types={fileTypes}
      typeSelectionTitle="Select File Type"
      formFields={fileFormFields}
      requiredFields={["title", "file"]}
      onTypeSelect={handleTypeSelect}
    />
  )
} 