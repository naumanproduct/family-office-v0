"use client"
import { MasterCreationDialog } from "./master-creation-dialog"

interface AddEntityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const entityTypes = [
  {
    id: "llc",
    name: "LLC",
    description: "Limited Liability Company - Flexible structure with liability protection",
    category: "Operating Entity",
  },
  {
    id: "lp",
    name: "LP",
    description: "Limited Partnership - Investment vehicle with general and limited partners",
    category: "Investment Entity",
  },
  {
    id: "trust",
    name: "Trust",
    description: "Trust structure for asset protection and estate planning",
    category: "Estate Planning",
  },
  {
    id: "corp",
    name: "Corporation",
    description: "Traditional corporate structure with shareholders",
    category: "Operating Entity",
  },
  {
    id: "foundation",
    name: "Foundation",
    description: "Charitable or private foundation structure",
    category: "Non-Profit",
  },
]

const formFields = [
  {
    id: "entityName",
    label: "Entity Name",
    type: "text" as const,
    placeholder: "Enter entity name",
    required: true,
    gridCols: 2,
  },
  {
    id: "rolePurpose",
    label: "Role / Purpose",
    type: "select" as const,
    placeholder: "Select role",
    options: ["Holding Co", "GP", "LP", "Operating Co", "Trust"],
  },
  {
    id: "jurisdiction",
    label: "Jurisdiction",
    type: "select" as const,
    placeholder: "Select jurisdiction",
    options: ["Delaware", "BVI", "Cayman", "Nevada", "Wyoming", "Luxembourg"],
  },
  {
    id: "status",
    label: "Status",
    type: "select" as const,
    placeholder: "Select status",
    options: ["Active", "Inactive", "Dissolved"],
  },
  {
    id: "ownershipPercent",
    label: "Ownership %",
    type: "number" as const,
    placeholder: "0-100",
    min: 0,
    max: 100,
  },
  {
    id: "parentEntity",
    label: "Parent Entity",
    type: "text" as const,
    placeholder: "Parent entity name",
  },
  {
    id: "managerController",
    label: "Manager / Controller",
    type: "text" as const,
    placeholder: "Manager or controller name",
  },
  {
    id: "dateFormed",
    label: "Date Formed",
    type: "date" as const,
  },
  {
    id: "tags",
    label: "Tags",
    type: "text" as const,
    placeholder: "Taxable, Onshore, Offshore (comma separated)",
    gridCols: 2,
  },
  {
    id: "notes",
    label: "Notes",
    type: "textarea" as const,
    placeholder: "Summary or reminders",
    rows: 3,
    gridCols: 2,
  },
]

export function AddEntityDialog({ open, onOpenChange }: AddEntityDialogProps) {
  const handleSave = (data: any) => {
    console.log("Saving entity:", data)
    // Handle entity creation
  }

  const handleTypeSelect = (type: any) => {
    return {
      entityType: type.name,
      category: type.category,
    }
  }

  return (
    <MasterCreationDialog
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onSave={handleSave}
      title="Add Entity"
      description="Create a new entity to track in your portfolio"
      recordType="Entity"
      avatarLetter="E"
      avatarColor="bg-blue-500"
      types={entityTypes}
      typeSelectionTitle="Choose the type of entity you want to create"
      formFields={formFields}
      requiredFields={["entityName"]}
      onTypeSelect={handleTypeSelect}
    />
  )
}
