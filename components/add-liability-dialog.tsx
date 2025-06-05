"use client"

import { MasterCreationDialog } from "./master-creation-dialog"

const liabilityTypes = [
  {
    id: "bridge-financing",
    name: "Bridge Financing",
    description: "Short-term bridge loans, interim financing",
    category: "Development Debt",
  },
  {
    id: "credit-line",
    name: "Credit Line",
    description: "Revolving credit facilities, operating lines",
    category: "Operating Debt",
  },
  {
    id: "equipment-financing",
    name: "Equipment Financing",
    description: "Asset-based loans, equipment purchases",
    category: "Asset-Based Debt",
  },
  {
    id: "guarantees",
    name: "Guarantees & Contingent",
    description: "Performance bonds, guarantees, contingent liabilities",
    category: "Contingent Liabilities",
  },
  {
    id: "mezzanine-debt",
    name: "Mezzanine Debt",
    description: "Subordinated debt, convertible instruments",
    category: "Hybrid Debt",
  },
  {
    id: "other",
    name: "Other",
    description: "Miscellaneous debt instruments",
    category: "Other Debt",
  },
  {
    id: "real-estate-debt",
    name: "Real Estate Debt",
    description: "Property mortgages, construction loans",
    category: "Real Estate Debt",
  },
  {
    id: "subscription-credit",
    name: "Subscription Credit Line",
    description: "Capital call facilities, LP commitment-backed",
    category: "Capital Call Facility",
  },
  {
    id: "term-loan",
    name: "Term Loan",
    description: "Fixed-term loans, acquisition financing",
    category: "Investment Debt",
  },
  {
    id: "trade-finance",
    name: "Trade Finance",
    description: "Letters of credit, trade facilities",
    category: "Trade Debt",
  },
]

const formFields = [
  {
    id: "name",
    label: "Liability Name",
    type: "text" as const,
    placeholder: "e.g., Credit Facility - Fund Operations",
    required: true,
  },
  {
    id: "type",
    label: "Liability Type",
    type: "readonly" as const,
  },
  {
    id: "category",
    label: "Category",
    type: "select" as const,
    options: [
      "Asset-Based Debt",
      "Capital Call Facility",
      "Contingent Liabilities",
      "Development Debt",
      "Hybrid Debt",
      "Investment Debt",
      "Operating Debt",
      "Other Debt",
      "Real Estate Debt",
      "Trade Debt",
    ],
    required: true,
  },
  {
    id: "originalAmount",
    label: "Original Amount",
    type: "number" as const,
    placeholder: "0.00",
    step: 0.01,
    required: true,
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
    id: "currentBalance",
    label: "Current Balance",
    type: "number" as const,
    placeholder: "0.00",
    step: 0.01,
  },
  {
    id: "interestRate",
    label: "Interest Rate (%)",
    type: "number" as const,
    placeholder: "0.00",
    step: 0.01,
    gridCols: 1,
  },
  {
    id: "interestRateType",
    label: "Rate Type",
    type: "select" as const,
    options: [
      "Fixed",
      "Variable - Fed Funds",
      "Variable - LIBOR",
      "Variable - Other",
      "Variable - Prime",
      "Variable - SOFR",
    ].sort(),
    defaultValue: "Fixed",
    gridCols: 1,
  },
  {
    id: "maturityDate",
    label: "Maturity Date",
    type: "date" as const,
  },
  {
    id: "nextPaymentDate",
    label: "Next Payment Date",
    type: "date" as const,
    gridCols: 1,
  },
  {
    id: "paymentAmount",
    label: "Payment Amount",
    type: "number" as const,
    placeholder: "0.00",
    step: 0.01,
    gridCols: 1,
  },
  {
    id: "paymentFrequency",
    label: "Payment Frequency",
    type: "select" as const,
    options: [
      "Annually",
      "Bullet Payment",
      "Interest Only",
      "Monthly",
      "On Demand",
      "Quarterly",
      "Semi-annually",
    ].sort(),
    defaultValue: "Monthly",
  },
  {
    id: "entity",
    label: "Owning Entity",
    type: "text" as const,
    placeholder: "e.g., Meridian Capital Fund III",
  },
  {
    id: "lender",
    label: "Lender / Creditor",
    type: "text" as const,
    placeholder: "e.g., First National Bank",
    required: true,
  },
  {
    id: "collateralType",
    label: "Collateral Type",
    type: "select" as const,
    options: [
      "Cash Collateral",
      "Corporate Guarantee",
      "Equipment",
      "Fund Assets",
      "LP Commitments",
      "Other",
      "Personal Guarantee",
      "Real Estate",
      "Securities Portfolio",
      "Unsecured",
    ].sort(),
    defaultValue: "Unsecured",
  },
  {
    id: "status",
    label: "Status",
    type: "select" as const,
    options: ["Current", "In Default", "Matured", "Past Due", "Restructured", "Undrawn"].sort(),
    defaultValue: "Current",
  },
  {
    id: "covenants",
    label: "Covenants & Restrictions",
    type: "textarea" as const,
    placeholder: "Describe any financial covenants, restrictions, or special terms",
    rows: 3,
  },
  {
    id: "notes",
    label: "Additional Notes",
    type: "textarea" as const,
    placeholder: "Any additional information about this liability",
    rows: 3,
  },
]

interface AddLiabilityDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AddLiabilityDialog({ isOpen, onClose }: AddLiabilityDialogProps) {
  const handleSave = (data: any) => {
    console.log("Saving liability:", data)
  }

  const handleTypeSelect = (type: any) => {
    return {
      type: type.name,
      category: type.category,
    }
  }

  return (
    <MasterCreationDialog
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      title="Add New Liability"
      description="Fill in the liability details below"
      recordType="Liability"
      avatarLetter="L"
      avatarColor="bg-red-500"
      types={liabilityTypes}
      typeSelectionTitle="Liability Types"
      formFields={formFields}
      requiredFields={["name", "lender", "originalAmount"]}
      onTypeSelect={handleTypeSelect}
    />
  )
}
