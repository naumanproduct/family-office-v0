"use client"

import { MasterCreationDialog } from "./master-creation-dialog"

// Person types (roles)
const personTypes = [
  {
    id: "accountant-tax-advisor",
    name: "Accountant / Tax Advisor",
    description: "Professional providing accounting or tax advisory services.",
    category: "Service Provider",
  },
  {
    id: "compliance-regulatory",
    name: "Compliance / Regulatory",
    description: "Specialist overseeing compliance and regulatory matters.",
    category: "Service Provider",
  },
  {
    id: "co-investor",
    name: "Co-Investor",
    description: "Investor participating alongside the primary investor/family office.",
    category: "Investor",
  },
  {
    id: "custodian-bank-rep",
    name: "Custodian / Bank Rep",
    description: "Representative from a custodian bank safeguarding assets.",
    category: "Financial Institution",
  },
  {
    id: "executive-coach-advisor",
    name: "Executive Coach / Advisor",
    description: "Advisor or coach supporting executive leadership development.",
    category: "Advisor",
  },
  {
    id: "family-member",
    name: "Family Member",
    description: "Member of the principal family or beneficiaries.",
    category: "Internal",
  },
  {
    id: "founder-operator",
    name: "Founder / Operator",
    description: "Founder or operator of a portfolio or prospective company.",
    category: "Management",
  },
  {
    id: "fund-administrator",
    name: "Fund Administrator",
    description: "Individual responsible for fund administration activities.",
    category: "Service Provider",
  },
  {
    id: "gp-fund-manager",
    name: "GP / Fund Manager",
    description: "General partner or fund manager overseeing investments.",
    category: "Investment Manager",
  },
  {
    id: "investment-banker-advisor",
    name: "Investment Banker / Advisor",
    description: "Professional providing investment banking or advisory services.",
    category: "Advisor",
  },
  {
    id: "investment-team",
    name: "Investment Team",
    description: "Internal member of the family office investment team.",
    category: "Internal",
  },
  {
    id: "legal-counsel",
    name: "Legal Counsel",
    description: "Attorney or legal counsel providing legal services.",
    category: "Service Provider",
  },
  {
    id: "referral-source",
    name: "Referral Source",
    description: "Contact who refers deals, relationships, or opportunities.",
    category: "Relationship",
  },
  {
    id: "research-analyst",
    name: "Research Analyst",
    description: "Individual conducting investment or market research.",
    category: "Analyst",
  },
  {
    id: "staff-admin",
    name: "Staff / Admin",
    description: "Administrative or support staff member.",
    category: "Internal",
  },
  {
    id: "venture-partner-scout",
    name: "Venture Partner / Scout",
    description: "External partner or scout sourcing venture deals.",
    category: "Partner",
  },
  {
    id: "other",
    name: "Other",
    description: "Other role not covered above.",
    category: "Other",
  },
]

// Form fields configuration
const personFormFields = [
  {
    id: "firstName",
    label: "First Name",
    type: "text" as const,
    placeholder: "Enter first name",
    required: true,
    gridCols: 1,
  },
  {
    id: "lastName",
    label: "Last Name",
    type: "text" as const,
    placeholder: "Enter last name",
    required: true,
    gridCols: 1,
  },
  {
    id: "email",
    label: "Email Address",
    type: "text" as const,
    placeholder: "email@example.com",
    required: true,
  },
  {
    id: "phone",
    label: "Phone Number",
    type: "text" as const,
    placeholder: "+1 (555) 123-4567",
  },
  {
    id: "jobTitle",
    label: "Job Title",
    type: "text" as const,
    placeholder: "Enter job title",
  },
  {
    id: "company",
    label: "Company",
    type: "text" as const,
    placeholder: "Enter company name",
  },
  {
    id: "location",
    label: "Location",
    type: "text" as const,
    placeholder: "City, State/Province, Country",
  },
  {
    id: "bio",
    label: "Bio",
    type: "textarea" as const,
    placeholder: "Brief biography or notes",
    rows: 4,
  },
  {
    id: "status",
    label: "Status",
    type: "select" as const,
    placeholder: "Select status",
    options: ["Active", "Inactive", "Prospective"],
  },
  {
    id: "lastInteraction",
    label: "Last Interaction",
    type: "date" as const,
  },
  {
    id: "connectionStrength",
    label: "Connection Strength",
    type: "select" as const,
    placeholder: "Select connection strength",
    options: ["Strong", "Medium", "Weak"],
  },
  {
    id: "associatedEntities",
    label: "Associated Entities",
    type: "text" as const,
    placeholder: "Enter entities separated by commas",
  },
  {
    id: "relatedInvestments",
    label: "Related Investments",
    type: "text" as const,
    placeholder: "Enter investments separated by commas",
  },
  {
    id: "internalOwner",
    label: "Internal Owner",
    type: "text" as const,
    placeholder: "Enter internal owner name",
  },
  {
    id: "introducedBy",
    label: "Introduced By",
    type: "text" as const,
    placeholder: "Enter introducer name",
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
