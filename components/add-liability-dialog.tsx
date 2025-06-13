"use client"

import { MasterCreationDialog } from "./master-creation-dialog"

const liabilityTypes = [
  { id: "accounts-payable", name: "Accounts Payable", description: "Outstanding supplier invoices", category: "Current Liability" },
  { id: "accrued-expenses", name: "Accrued Expenses", description: "Expenses incurred but not yet paid", category: "Current Liability" },
  { id: "short-term-loans", name: "Short-Term Loans", description: "Loans due within 12 months", category: "Debt" },
  { id: "lines-of-credit", name: "Lines of Credit", description: "Revolving credit facilities", category: "Debt" },
  { id: "margin-loans", name: "Margin Loans", description: "Brokerage margin balances", category: "Debt" },
  { id: "tax-liabilities", name: "Tax Liabilities", description: "Income, property, or other taxes owed", category: "Tax" },
  { id: "mortgages-long-term-debt", name: "Mortgages & Long-Term Debt", description: "Obligations beyond one year", category: "Debt" },
  { id: "unsecured-loans", name: "Unsecured Loans", description: "Loans without collateral", category: "Debt" },
  { id: "pension-post-retirement", name: "Pension & Post-Retirement Obligations", description: "Employee benefit commitments", category: "Benefit Obligation" },
  { id: "deferred-compensation", name: "Deferred Compensation", description: "Compensation payable in the future", category: "Benefit Obligation" },
  { id: "contingent-liabilities", name: "Contingent Liabilities", description: "Guarantees, lawsuits, other contingencies", category: "Contingent" },
  { id: "other", name: "Other", description: "Miscellaneous liabilities", category: "Other" },
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
