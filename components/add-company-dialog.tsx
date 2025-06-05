"use client"

import { MasterCreationDialog } from "./master-creation-dialog"

// Company types
const companyTypes = [
  {
    id: "corporation",
    name: "Corporation",
    description: "A legal entity that is separate from its owners, with limited liability protection.",
    category: "For-profit",
  },
  {
    id: "llc",
    name: "Limited Liability Company",
    description: "Combines the pass-through taxation of a partnership with the limited liability of a corporation.",
    category: "For-profit",
  },
  {
    id: "partnership",
    name: "Partnership",
    description: "A business relationship between two or more individuals who share management and profits.",
    category: "For-profit",
  },
  {
    id: "sole-proprietorship",
    name: "Sole Proprietorship",
    description: "An unincorporated business with a single owner who pays personal income tax on profits.",
    category: "For-profit",
  },
  {
    id: "non-profit",
    name: "Non-profit Organization",
    description:
      "An organization that uses its profits for its stated purpose rather than distributing to shareholders.",
    category: "Non-profit",
  },
]

// Form fields configuration
const companyFormFields = [
  {
    id: "companyName",
    label: "Company Name",
    type: "text",
    placeholder: "Enter company name",
    required: true,
  },
  {
    id: "industry",
    label: "Industry",
    type: "select",
    placeholder: "Select industry",
    options: [
      "Accounting",
      "Advertising",
      "Agriculture",
      "Automotive",
      "Banking",
      "Biotechnology",
      "Construction",
      "Consulting",
      "Education",
      "Energy",
      "Entertainment",
      "Financial Services",
      "Food & Beverage",
      "Healthcare",
      "Hospitality",
      "Insurance",
      "Legal",
      "Manufacturing",
      "Media",
      "Real Estate",
      "Retail",
      "Technology",
      "Telecommunications",
      "Transportation",
      "Utilities",
    ].sort(),
    required: true,
  },
  {
    id: "revenue",
    label: "Annual Revenue",
    type: "select",
    placeholder: "Select revenue range",
    options: [
      { value: "<1M", label: "Less than $1M" },
      { value: "1M-10M", label: "$1M - $10M" },
      { value: "10M-50M", label: "$10M - $50M" },
      { value: "50M-100M", label: "$50M - $100M" },
      { value: "100M-500M", label: "$100M - $500M" },
      { value: "500M-1B", label: "$500M - $1B" },
      { value: ">1B", label: "More than $1B" },
    ],
  },
  {
    id: "employees",
    label: "Number of Employees",
    type: "select",
    placeholder: "Select employee range",
    options: [
      { value: "1-10", label: "1-10" },
      { value: "11-50", label: "11-50" },
      { value: "51-200", label: "51-200" },
      { value: "201-500", label: "201-500" },
      { value: "501-1000", label: "501-1000" },
      { value: "1001-5000", label: "1001-5000" },
      { value: "5001+", label: "5001+" },
    ],
  },
  {
    id: "website",
    label: "Website",
    type: "text",
    placeholder: "https://",
  },
  {
    id: "location",
    label: "Headquarters Location",
    type: "text",
    placeholder: "City, State/Province, Country",
  },
  {
    id: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Brief description of the company",
    rows: 4,
  },
]

interface AddCompanyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCompanyDialog({ open, onOpenChange }: AddCompanyDialogProps) {
  const handleSave = (data: any) => {
    console.log("Company data saved:", data)
    // Here you would typically save the data to your backend
  }

  const handleTypeSelect = (type: any) => {
    // Return any type-specific default values
    return {
      companyType: type.id,
    }
  }

  return (
    <MasterCreationDialog
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onSave={handleSave}
      title="Add New Company"
      description="Create a new company record in the system"
      recordType="Company"
      avatarLetter="C"
      avatarColor="bg-blue-600"
      types={companyTypes}
      typeSelectionTitle="Select Company Type"
      formFields={companyFormFields}
      requiredFields={["companyName", "industry"]}
      onTypeSelect={handleTypeSelect}
    />
  )
}
