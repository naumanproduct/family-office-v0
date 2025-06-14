"use client"

import { MasterCreationDialog } from "./master-creation-dialog"

// Company types
const companyTypes = [
  {
    id: "accounting-tax-firm",
    name: "Accounting / Tax Firm",
    description: "Professional firm providing accounting and tax services.",
    category: "Service Provider",
  },
  {
    id: "co-investor-lp",
    name: "Co-Investor / LP",
    description: "Limited partner or co-investor contributing capital alongside primary investor.",
    category: "Investor",
  },
  {
    id: "custodian-bank",
    name: "Custodian / Bank",
    description: "Financial institution safeguarding assets and providing banking services.",
    category: "Financial Institution",
  },
  {
    id: "family-operating-business",
    name: "Family Operating Business",
    description: "Business owned and operated by the family office principals.",
    category: "Internal",
  },
  {
    id: "fund-investment-vehicle",
    name: "Fund / Investment Vehicle",
    description: "Legal entity or structure used to pool capital for investments.",
    category: "Investment Vehicle",
  },
  {
    id: "gp-fund-manager",
    name: "GP / Fund Manager",
    description: "General partner or manager responsible for investment decisions.",
    category: "Investment Manager",
  },
  {
    id: "internal-family-entity",
    name: "Internal Entity / Family Entity",
    description: "Entity within the family office structure.",
    category: "Internal",
  },
  {
    id: "investment-bank-broker",
    name: "Investment Bank / Broker",
    description: "Institution providing investment banking or brokerage services.",
    category: "Financial Institution",
  },
  {
    id: "law-firm",
    name: "Law Firm",
    description: "Legal services provider.",
    category: "Service Provider",
  },
  {
    id: "portfolio-company",
    name: "Portfolio Company",
    description: "Company in which the family office has invested.",
    category: "Portfolio",
  },
  {
    id: "prospective-investment",
    name: "Prospective Investment",
    description: "Company or opportunity under consideration for investment.",
    category: "Prospect",
  },
  {
    id: "referral-source",
    name: "Referral Source",
    description: "Person or entity that refers investment opportunities.",
    category: "Relationship",
  },
  {
    id: "research-provider",
    name: "Research Provider",
    description: "Firm supplying market or investment research.",
    category: "Service Provider",
  },
  {
    id: "service-provider",
    name: "Service Provider",
    description: "Vendor offering specialized services to the family office.",
    category: "Service Provider",
  },
  {
    id: "strategic-partner",
    name: "Strategic Partner",
    description: "Entity collaborating on strategic initiatives and investments.",
    category: "Partner",
  },
  {
    id: "other",
    name: "Other",
    description: "Other type of company not covered by these categories.",
    category: "Other",
  },
]

// Form fields configuration
const companyFormFields = [
  {
    id: "companyName",
    label: "Company Name",
    type: "text" as const,
    placeholder: "Enter company name",
    required: true,
  },
  {
    id: "industry",
    label: "Industry",
    type: "select" as const,
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
    type: "select" as const,
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
    type: "select" as const,
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
    type: "text" as const,
    placeholder: "https://",
  },
  {
    id: "location",
    label: "Headquarters Location",
    type: "text" as const,
    placeholder: "City, State/Province, Country",
  },
  {
    id: "description",
    label: "Description",
    type: "textarea" as const,
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
