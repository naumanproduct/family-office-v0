"use client"

import { MasterCreationDialog } from "./master-creation-dialog"

// Person types
const personTypes = [
  {
    id: "employee",
    name: "Employee",
    description: "A person who works for your organization under an employment contract.",
    category: "Internal",
  },
  {
    id: "client",
    name: "Client",
    description: "A person who uses your organization's products or services.",
    category: "External",
  },
  {
    id: "investor",
    name: "Investor",
    description: "A person who has invested capital in your organization.",
    category: "External",
  },
  {
    id: "advisor",
    name: "Advisor",
    description: "A person who provides expert advice to your organization.",
    category: "External",
  },
  {
    id: "partner",
    name: "Partner",
    description: "A person who has a business relationship with your organization.",
    category: "External",
  },
]

// Form fields configuration
const personFormFields = [
  {
    id: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "Enter first name",
    required: true,
    gridCols: 1,
  },
  {
    id: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "Enter last name",
    required: true,
    gridCols: 1,
  },
  {
    id: "email",
    label: "Email Address",
    type: "text",
    placeholder: "email@example.com",
    required: true,
  },
  {
    id: "phone",
    label: "Phone Number",
    type: "text",
    placeholder: "+1 (555) 123-4567",
  },
  {
    id: "jobTitle",
    label: "Job Title",
    type: "text",
    placeholder: "Enter job title",
  },
  {
    id: "company",
    label: "Company",
    type: "text",
    placeholder: "Enter company name",
  },
  {
    id: "location",
    label: "Location",
    type: "text",
    placeholder: "City, State/Province, Country",
  },
  {
    id: "bio",
    label: "Bio",
    type: "textarea",
    placeholder: "Brief biography or notes",
    rows: 4,
  },
]

interface AddPersonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPersonDialog({ open, onOpenChange }: AddPersonDialogProps) {
  const handleSave = (data: any) => {
    console.log("Person data saved:", data)
    // Here you would typically save the data to your backend
  }

  const handleTypeSelect = (type: any) => {
    // Return any type-specific default values
    return {
      personType: type.id,
    }
  }

  return (
    <MasterCreationDialog
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onSave={handleSave}
      title="Add New Person"
      description="Create a new person record in the system"
      recordType="Person"
      avatarLetter="P"
      avatarColor="bg-green-600"
      types={personTypes}
      typeSelectionTitle="Select Person Type"
      formFields={personFormFields}
      requiredFields={["firstName", "lastName", "email"]}
      onTypeSelect={handleTypeSelect}
    />
  )
}
