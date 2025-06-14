"use client"
import { MasterCreationDialog } from "./master-creation-dialog"

interface AddOpportunityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const opportunityTypes = [
  {
    id: "cash-equivalents",
    name: "Cash & Cash Equivalents",
    description: "Checking, savings, money-market, T-bills",
    category: "Cash",
  },
  {
    id: "public-equities",
    name: "Public Equities",
    description: "Listed stocks, ETFs, mutual funds",
    category: "Equity",
  },
  {
    id: "fixed-income",
    name: "Fixed Income",
    description: "Bonds, treasuries, structured notes",
    category: "Debt",
  },
  {
    id: "private-equity",
    name: "Private Equity",
    description: "Buyout, growth, secondaries, PE funds",
    category: "Equity",
  },
  {
    id: "venture-capital",
    name: "Venture Capital",
    description: "Seed, early-stage startups, VC funds",
    category: "Equity",
  },
  {
    id: "private-credit",
    name: "Private Credit",
    description: "Direct lending, mezzanine, special situations",
    category: "Debt",
  },
  {
    id: "hedge-funds",
    name: "Hedge Funds",
    description: "Single-strategy or fund-of-funds",
    category: "Alternatives",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description: "Properties, REITs, real estate funds",
    category: "Real Estate",
  },
  {
    id: "real-assets",
    name: "Real Assets",
    description: "Infrastructure, commodities, timber, etc.",
    category: "Alternatives",
  },
  {
    id: "direct-investments",
    name: "Direct Investments",
    description: "Single-company stakes held directly",
    category: "Equity",
  },
  {
    id: "alternative-investments",
    name: "Alternative Investments",
    description: "Art, collectibles, crypto, other alts",
    category: "Alternatives",
  },
  {
    id: "other",
    name: "Other",
    description: "Uncategorized or miscellaneous opportunities",
    category: "Other",
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
