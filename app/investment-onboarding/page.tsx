"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { EntityComplianceKanban } from "@/components/entity-compliance-kanban"

// Sample data for Investment Onboarding
const initialItems = [
  {
    id: "1",
    entityName: "Growth Fund III",
    itemType: "Private Equity",
    dueDate: "2024-07-15",
    responsiblePerson: "Sarah Chen",
    priority: "High",
    stage: "initial-setup",
    description: "New private equity fund investment requiring setup across systems",
    entityType: "Investment",
    jurisdiction: "Delaware",
    filingFrequency: "One-time",
    lastFiled: "N/A",
    requirements: "Subscription agreement, banking details, legal documentation",
    estimatedCost: "$20M commitment",
    notes: "First-time investment with this manager, requires extra due diligence",
    documents: [
      { name: "Subscription Agreement", url: "#" },
      { name: "PPM", url: "#" }
    ],
    relatedEntities: ["Johnson Family Trust"],
    investmentName: "Growth Fund III",
    investmentType: "Private Equity",
    amount: "$20,000,000",
    closingDate: "2024-07-15",
    assignedTo: "Sarah Chen",
  },
  {
    id: "2",
    entityName: "Tech Ventures II",
    itemType: "Venture Capital",
    dueDate: "2024-06-30",
    responsiblePerson: "Michael Rodriguez",
    priority: "Medium",
    stage: "legal-review",
    description: "Venture capital fund investment in legal review phase",
    entityType: "Investment",
    jurisdiction: "Delaware",
    filingFrequency: "One-time",
    lastFiled: "N/A",
    requirements: "Operating agreement, capital call schedule, banking instructions",
    estimatedCost: "$5M commitment",
    notes: "Legal team reviewing special terms in side letter",
    documents: [
      { name: "Operating Agreement", url: "#" },
      { name: "Side Letter", url: "#" }
    ],
    relatedEntities: ["Smith Investments LLC"],
    investmentName: "Tech Ventures II",
    investmentType: "Venture Capital",
    amount: "$5,000,000",
    closingDate: "2024-06-30",
    assignedTo: "Michael Rodriguez",
  },
  {
    id: "3",
    entityName: "Real Estate Fund IV",
    itemType: "Real Estate",
    dueDate: "2024-07-05",
    responsiblePerson: "Lisa Wang",
    priority: "High",
    stage: "banking-setup",
    description: "Real estate fund requiring banking setup for capital calls",
    entityType: "Investment",
    jurisdiction: "Delaware",
    filingFrequency: "One-time",
    lastFiled: "N/A",
    requirements: "Wire instructions, account setup, signatory approvals",
    estimatedCost: "$15M commitment",
    notes: "Setting up dedicated account for this investment",
    documents: [
      { name: "Banking Instructions", url: "#" },
      { name: "Signatory Forms", url: "#" }
    ],
    relatedEntities: ["Coastal Properties LLC"],
    investmentName: "Real Estate Fund IV",
    investmentType: "Real Estate",
    amount: "$15,000,000",
    closingDate: "2024-07-05",
    assignedTo: "Lisa Wang",
  },
  {
    id: "4",
    entityName: "Infrastructure Fund I",
    itemType: "Infrastructure",
    dueDate: "2024-06-25",
    responsiblePerson: "James Wilson",
    priority: "Medium",
    stage: "document-collection",
    description: "Infrastructure fund in document collection phase",
    entityType: "Investment",
    jurisdiction: "Cayman Islands",
    filingFrequency: "One-time",
    lastFiled: "N/A",
    requirements: "KYC documentation, tax forms, beneficial ownership declaration",
    estimatedCost: "$10M commitment",
    notes: "International fund requiring additional compliance documentation",
    documents: [
      { name: "KYC Forms", url: "#" },
      { name: "W-8BEN-E", url: "#" }
    ],
    relatedEntities: ["Johnson Holdings LLC"],
    investmentName: "Infrastructure Fund I",
    investmentType: "Infrastructure",
    amount: "$10,000,000",
    closingDate: "2024-06-25",
    assignedTo: "James Wilson",
  },
  {
    id: "5",
    entityName: "Credit Opportunities Fund II",
    itemType: "Private Credit",
    dueDate: "2024-06-20",
    responsiblePerson: "Sarah Chen",
    priority: "Low",
    stage: "metadata-setup",
    description: "Private credit fund in metadata setup phase",
    entityType: "Investment",
    jurisdiction: "Delaware",
    filingFrequency: "One-time",
    lastFiled: "N/A",
    requirements: "Portfolio tracking setup, reporting templates, contact information",
    estimatedCost: "$7.5M commitment",
    notes: "Setting up reporting templates and data feeds",
    documents: [
      { name: "Reporting Requirements", url: "#" },
      { name: "Data Feed Specs", url: "#" }
    ],
    relatedEntities: ["Johnson Family Trust"],
    investmentName: "Credit Opportunities Fund II",
    investmentType: "Private Credit",
    amount: "$7,500,000",
    closingDate: "2024-06-20",
    assignedTo: "Sarah Chen",
  },
  {
    id: "6",
    entityName: "Sustainable Energy Fund",
    itemType: "Impact Investing",
    dueDate: "2024-06-15",
    responsiblePerson: "Michael Rodriguez",
    priority: "Medium",
    stage: "completed",
    description: "Impact investing fund focused on sustainable energy",
    entityType: "Investment",
    jurisdiction: "Delaware",
    filingFrequency: "One-time",
    lastFiled: "2024-06-10",
    requirements: "All documentation and setup completed",
    estimatedCost: "$8M commitment",
    notes: "Fully onboarded and ready for first capital call",
    documents: [
      { name: "Final Subscription", url: "#" },
      { name: "Welcome Package", url: "#" }
    ],
    relatedEntities: ["Smith Investments LLC"],
    investmentName: "Sustainable Energy Fund",
    investmentType: "Impact Investing",
    amount: "$8,000,000",
    closingDate: "2024-06-10",
    assignedTo: "Michael Rodriguez",
  },
]

export default function InvestmentOnboardingPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Investment Onboarding",
    description: "Repeatable process with setup steps across legal, banking, docs, and metadata",
    objectType: "investment",
    attributes: [
      { id: "investmentName", name: "Investment", type: "text" },
      { id: "investmentType", name: "Type", type: "text" },
      { id: "amount", name: "Amount", type: "currency" },
      { id: "closingDate", name: "Closing Date", type: "date" },
      { id: "entityName", name: "Entity", type: "text" },
      { id: "assignedTo", name: "Assigned To", type: "user" },
    ],
    stages: [
      { id: "initial-setup", name: "Initial Setup", color: "bg-gray-100" },
      { id: "legal-review", name: "Legal Review", color: "bg-blue-100" },
      { id: "banking-setup", name: "Banking Setup", color: "bg-yellow-100" },
      { id: "document-collection", name: "Document Collection", color: "bg-purple-100" },
      { id: "metadata-setup", name: "Metadata Setup", color: "bg-orange-100" },
      { id: "completed", name: "Completed", color: "bg-green-100" },
    ],
  })

  const handleSaveWorkflow = (config: any) => {
    setWorkflowConfig(config)
    console.log("Workflow updated:", config)
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center border-b">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Investment Onboarding</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-semibold">Investment Onboarding</h1>
                    <p className="text-muted-foreground">Repeatable process with setup steps across legal, banking, docs, and metadata</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Investment Onboarding"
                    workflowConfig={workflowConfig}
                    onSave={handleSaveWorkflow}
                  />
                </div>
                <EntityComplianceKanban 
                  workflowConfig={workflowConfig} 
                  initialItems={initialItems}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
