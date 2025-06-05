"use client"
import { MasterCreationDialog } from "./master-creation-dialog"

interface AddOpportunityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const opportunityTypes = [
  {
    id: "direct-investment",
    name: "Direct Investment",
    description: "Direct equity investment in a company",
    category: "Equity",
  },
  {
    id: "fund-investment",
    name: "Fund Investment",
    description: "Investment in a private equity or venture capital fund",
    category: "Fund",
  },
  {
    id: "co-investment",
    name: "Co-Investment",
    description: "Co-investment alongside a fund in a specific deal",
    category: "Equity",
  },
  {
    id: "secondary",
    name: "Secondary",
    description: "Purchase of existing fund interests or company shares",
    category: "Secondary",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description: "Direct or fund investment in real estate",
    category: "Real Estate",
  },
]

const formFields = [
  {
    id: "opportunityName",
    label: "Opportunity Name",
    type: "text" as const,
    placeholder: "Enter opportunity name",
    required: true,
    gridCols: 2,
  },
  {
    id: "company",
    label: "Company",
    type: "text" as const,
    placeholder: "Company name",
    required: true,
  },
  {
    id: "contactPerson",
    label: "Contact Person",
    type: "text" as const,
    placeholder: "Primary contact",
  },
  {
    id: "dealSize",
    label: "Deal Size",
    type: "text" as const,
    placeholder: "e.g. $5,000,000",
  },
  {
    id: "expectedCloseDate",
    label: "Expected Close Date",
    type: "date" as const,
  },
  {
    id: "stage",
    label: "Stage",
    type: "select" as const,
    placeholder: "Select stage",
    options: ["Prospecting", "Qualification", "Proposal", "Negotiation", "Closing"],
  },
  {
    id: "probability",
    label: "Probability (%)",
    type: "number" as const,
    placeholder: "0-100",
    min: 0,
    max: 100,
  },
  {
    id: "sector",
    label: "Sector",
    type: "select" as const,
    placeholder: "Select sector",
    options: ["Technology", "Healthcare", "Financial Services", "Consumer", "Industrial", "Energy", "Real Estate"],
  },
  {
    id: "fundingRound",
    label: "Funding Round",
    type: "select" as const,
    placeholder: "Select round",
    options: ["Seed", "Series A", "Series B", "Series C", "Growth", "Buyout"],
  },
  {
    id: "tags",
    label: "Tags",
    type: "text" as const,
    placeholder: "SaaS, Fintech, Healthcare (comma separated)",
    gridCols: 2,
  },
  {
    id: "notes",
    label: "Notes",
    type: "textarea" as const,
    placeholder: "Additional details about this opportunity",
    rows: 3,
    gridCols: 2,
  },
]

export function AddOpportunityDialog({ open, onOpenChange }: AddOpportunityDialogProps) {
  const handleSave = (data: any) => {
    console.log("Saving opportunity:", data)
    // Handle opportunity creation
  }

  const handleTypeSelect = (type: any) => {
    return {
      opportunityType: type.name,
      category: type.category,
    }
  }

  return (
    <MasterCreationDialog
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onSave={handleSave}
      title="Add Opportunity"
      description="Create a new investment opportunity to track"
      recordType="Opportunity"
      avatarLetter="O"
      avatarColor="bg-green-500"
      types={opportunityTypes}
      typeSelectionTitle="Choose the type of opportunity you want to create"
      formFields={formFields}
      requiredFields={["opportunityName", "company"]}
      onTypeSelect={handleTypeSelect}
    />
  )
}
