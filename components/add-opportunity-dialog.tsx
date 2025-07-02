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
    id: "stage",
    label: "Stage",
    type: "select" as const,
    placeholder: "Select stage",
    options: ["Prospecting", "Qualification", "Proposal", "Negotiation", "Closing"],
  },
  {
    id: "decisionStatus",
    label: "Decision Status",
    type: "select" as const,
    placeholder: "Select decision status",
    options: ["Evaluating", "Approved", "Rejected", "On Hold"],
  },
  {
    id: "ourInvestment",
    label: "Our Investment",
    type: "text" as const,
    placeholder: "e.g. $5,000,000",
  },
  {
    id: "targetRaise",
    label: "Target Raise",
    type: "text" as const,
    placeholder: "e.g. $25,000,000",
  },
  {
    id: "minimumCommitment",
    label: "Minimum Commitment",
    type: "text" as const,
    placeholder: "e.g. $1,000,000",
  },
  {
    id: "valuation",
    label: "Valuation",
    type: "text" as const,
    placeholder: "e.g. $100,000,000",
  },
  {
    id: "company",
    label: "Company",
    type: "text" as const,
    placeholder: "Company name",
    required: true,
  },
  {
    id: "sourcedBy",
    label: "Sourced By",
    type: "text" as const,
    placeholder: "Enter source name",
  },
  {
    id: "introducedBy",
    label: "Introduced By",
    type: "text" as const,
    placeholder: "Enter introducer name",
  },
  {
    id: "internalOwner",
    label: "Internal Owner",
    type: "text" as const,
    placeholder: "Enter internal owner name",
  },
  {
    id: "contactPerson",
    label: "Contact",
    type: "text" as const,
    placeholder: "Primary contact",
  },
  {
    id: "legalEntity",
    label: "Legal Entity",
    type: "text" as const,
    placeholder: "Legal entity name",
  },
  {
    id: "expectedCloseDate",
    label: "Expected Close Date",
    type: "date" as const,
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
    id: "fundingRound",
    label: "Funding Round",
    type: "select" as const,
    placeholder: "Select round",
    options: ["Seed", "Series A", "Series B", "Series C", "Growth", "Buyout"],
  },
  {
    id: "sector",
    label: "Sector",
    type: "select" as const,
    placeholder: "Select sector",
    options: ["Technology", "Healthcare", "Financial Services", "Consumer", "Industrial", "Energy", "Real Estate"],
  },
  {
    id: "geography",
    label: "Geography",
    type: "text" as const,
    placeholder: "e.g. North America, Europe, Asia",
  },
  {
    id: "status",
    label: "Status",
    type: "select" as const,
    placeholder: "Select status",
    options: ["Active", "Closed Won", "Closed Lost", "On Hold"],
  },
  {
    id: "lastActivity",
    label: "Last Activity",
    type: "date" as const,
  },
  {
    id: "description",
    label: "Description",
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
