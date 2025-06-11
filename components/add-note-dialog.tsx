"use client"

import { MasterCreationDialog } from "./master-creation-dialog"

// Note types
const noteTypes = [
  {
    id: "general",
    name: "General Note",
    description: "Basic note for general purposes.",
    category: "Notes",
  },
  {
    id: "meeting",
    name: "Meeting Note",
    description: "Notes from meetings and discussions.",
    category: "Notes",
  },
  {
    id: "investment",
    name: "Investment Note",
    description: "Notes related to investment analysis and decisions.",
    category: "Notes",
  },
  {
    id: "legal",
    name: "Legal Note",
    description: "Notes regarding legal matters and documentation.",
    category: "Notes",
  },
  {
    id: "research",
    name: "Research Note",
    description: "Notes from research and due diligence efforts.",
    category: "Notes",
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
const noteFormFields: FormField[] = [
  {
    id: "title",
    label: "Title",
    type: "text",
    placeholder: "Enter note title",
    required: true,
  },
  {
    id: "content",
    label: "Content",
    type: "textarea",
    placeholder: "Enter note content",
    required: true,
    rows: 6,
  },
  {
    id: "priority",
    label: "Priority",
    type: "select",
    placeholder: "Select priority",
    options: ["High", "Medium", "Low"],
    defaultValue: "Medium",
  },
  {
    id: "tags",
    label: "Tags",
    type: "text",
    placeholder: "Enter tags separated by commas",
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
      { value: "john-smith", label: "John Smith (Person)" },
      { value: "opportunity-123", label: "Tech Acquisition (Opportunity)" },
    ],
  },
]

interface AddNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddNoteDialog({ open, onOpenChange }: AddNoteDialogProps) {
  const handleSave = (data: any) => {
    console.log("Note data saved:", data)
    // Here you would typically save the data to your backend
  }

  const handleTypeSelect = (type: any) => {
    // Return any type-specific default values
    return {
      noteType: type.id,
    }
  }

  return (
    <MasterCreationDialog
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onSave={handleSave}
      title="Add New Note"
      description="Create a new note in the system"
      recordType="Note"
      avatarLetter="N"
      avatarColor="bg-yellow-600"
      types={noteTypes}
      typeSelectionTitle="Select Note Type"
      formFields={noteFormFields}
      requiredFields={["title", "content"]}
      onTypeSelect={handleTypeSelect}
    />
  )
} 