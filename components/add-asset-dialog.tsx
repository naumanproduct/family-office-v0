"use client"

import { MasterCreationDialog } from "./master-creation-dialog"

const assetTypes = [
  {
    id: "cash-bank",
    name: "Cash / Bank Accounts",
    description: "Checking, savings, money market",
    category: "Cash",
  },
  {
    id: "digital-assets",
    name: "Digital Assets",
    description: "Crypto holdings, wallets",
    category: "Alternatives",
  },
  {
    id: "fixed-income",
    name: "Fixed Income",
    description: "Bonds, treasuries, structured notes",
    category: "Debt",
  },
  {
    id: "hedge-funds",
    name: "Hedge Funds",
    description: "Single-strategy or fund-of-funds",
    category: "Alternatives",
  },
  {
    id: "insurance-annuities",
    name: "Insurance / Annuities",
    description: "Investment-linked policies",
    category: "Alternatives",
  },
  {
    id: "other",
    name: "Other",
    description: "Art, collectibles, or uncategorized assets",
    category: "Alternatives",
  },
  {
    id: "private-equity",
    name: "Private Equity",
    description: "Direct investments, PE funds, co-invests",
    category: "Alternatives",
  },
  {
    id: "public-equity",
    name: "Public Equity",
    description: "Listed stocks, ETFs, mutual funds",
    category: "Equity",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description: "Properties, REITs, real estate funds",
    category: "Real Estate",
  },
  {
    id: "venture-capital",
    name: "Venture Capital",
    description: "Early-stage startups, VC funds",
    category: "Alternatives",
  },
]

const formFields = [
  {
    id: "assetName",
    label: "Asset Name",
    type: "text" as const,
    placeholder: "e.g., Apple Inc., Fund III",
    required: true,
  },
  {
    id: "assetType",
    label: "Asset Type",
    type: "readonly" as const,
  },
  {
    id: "assetClass",
    label: "Asset Class",
    type: "select" as const,
    options: ["Cash", "Debt", "Equity", "Real Estate", "Alternatives"].sort(),
    required: true,
  },
  {
    id: "owningEntity",
    label: "Owning Entity",
    type: "text" as const,
    placeholder: "e.g., Trust, LLC, Individual",
  },
  {
    id: "acquisitionDate",
    label: "Acquisition Date",
    type: "date" as const,
  },
  {
    id: "costBasis",
    label: "Cost Basis",
    type: "number" as const,
    placeholder: "0.00",
    step: 0.01,
    gridCols: 2,
  },
  {
    id: "currency",
    label: "Currency",
    type: "select" as const,
    options: ["AUD", "CAD", "CHF", "CNY", "EUR", "GBP", "JPY", "USD"].sort(),
    defaultValue: "USD",
    gridCols: 1,
  },
  {
    id: "currentValue",
    label: "Current Value",
    type: "number" as const,
    placeholder: "0.00",
    step: 0.01,
  },
  {
    id: "ownershipPercent",
    label: "Ownership %",
    type: "number" as const,
    placeholder: "100",
    min: 0,
    max: 100,
  },
  {
    id: "managerCustodian",
    label: "Manager / Custodian",
    type: "text" as const,
    placeholder: "e.g., JPMorgan, Fidelity, Sequoia",
  },
  {
    id: "jurisdiction",
    label: "Jurisdiction",
    type: "select" as const,
    options: [
      "Australia",
      "Canada",
      "Cayman Islands",
      "Hong Kong",
      "Ireland",
      "Luxembourg",
      "Netherlands",
      "Singapore",
      "Switzerland",
      "United Kingdom",
      "United States",
      "Other",
    ].sort(),
  },
  {
    id: "liquidityProfile",
    label: "Liquidity Profile",
    type: "select" as const,
    options: [
      "Liquid",
      "30-day notice",
      "90-day notice",
      "1-year lockup",
      "2-year lockup",
      "3+ year lockup",
      "Illiquid",
    ],
  },
  {
    id: "accountVehicleName",
    label: "Account / Vehicle Name",
    type: "text" as const,
    placeholder: "Optional - if nested under a fund or account",
  },
  {
    id: "tags",
    label: "Tags",
    type: "text" as const,
    placeholder: "e.g., AI, Emerging Markets, Growth (comma-separated)",
  },
]

interface AddAssetDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AddAssetDialog({ isOpen, onClose }: AddAssetDialogProps) {
  const handleSave = (data: any) => {
    console.log("Saving asset:", data)
  }

  const handleTypeSelect = (type: any) => {
    return {
      assetType: type.name,
      assetClass: type.category,
    }
  }

  return (
    <MasterCreationDialog
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      title="Add New Asset"
      description="Fill in the asset details below"
      recordType="Asset"
      avatarLetter="A"
      avatarColor="bg-primary"
      types={assetTypes}
      typeSelectionTitle="Asset Types"
      formFields={formFields}
      requiredFields={["assetName"]}
      onTypeSelect={handleTypeSelect}
    />
  )
}
