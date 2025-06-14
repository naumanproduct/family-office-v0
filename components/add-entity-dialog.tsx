"use client"
import { MasterCreationDialog } from "./master-creation-dialog"

interface AddEntityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const entityTypes = [
  {
    id: "trust",
    name: "Trust",
    description: "Trust structure for asset protection and estate planning.",
    category: "Estate Planning",
  },
  {
    id: "llc",
    name: "LLC",
    description: "Limited Liability Company offering flexibility and liability protection.",
    category: "Operating Entity",
  },
  {
    id: "lp",
    name: "LP (Limited Partnership)",
    description: "Investment vehicle with general and limited partners.",
    category: "Investment Entity",
  },
  {
    id: "holdco",
    name: "HoldCo / Holding Company",
    description: "Entity created to hold controlling stock or assets of subsidiary companies.",
    category: "Holding Company",
  },
  {
    id: "family-foundation",
    name: "Family Foundation",
    description: "Private foundation established by a family for philanthropic purposes.",
    category: "Non-Profit",
  },
  {
    id: "family-office-entity",
    name: "Family Office Entity",
    description: "Entity within the family office structure (e.g., management company).",
    category: "Internal",
  },
  {
    id: "spv",
    name: "SPV (Special Purpose Vehicle)",
    description: "Entity created for a specific investment or project.",
    category: "Investment Vehicle",
  },
  {
    id: "c-corp",
    name: "C-Corp",
    description: "Traditional corporation taxed separately from its owners.",
    category: "Operating Entity",
  },
  {
    id: "s-corp",
    name: "S-Corp",
    description: "Corporation with pass-through taxation (U.S. specific).",
    category: "Operating Entity",
  },
  {
    id: "sole-proprietorship",
    name: "Sole Proprietorship",
    description: "Unincorporated business owned by a single individual.",
    category: "Operating Entity",
  },
  {
    id: "estate",
    name: "Estate",
    description: "Assets and liabilities left by a deceased individual.",
    category: "Estate Planning",
  },
  {
    id: "non-profit-charity",
    name: "Non-Profit / Charitable Entity",
    description: "Organization operating for charitable purposes without profit distribution.",
    category: "Non-Profit",
  },
  {
    id: "personal-account",
    name: "Personal (Individual Account)",
    description: "Investment or brokerage account held by an individual.",
    category: "Individual",
  },
  {
    id: "other",
    name: "Other",
    description: "Entity type not covered above.",
    category: "Other",
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
    options: [
      "Holding Co",
      "Operating Co",
      "GP",
      "LP",
      "SPV",
      "Foundation",
      "Trust",
      "Estate",
      "Individual",
      "Non-Profit",
    ],
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
