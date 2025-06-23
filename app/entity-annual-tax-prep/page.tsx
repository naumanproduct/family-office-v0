"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { EntityComplianceKanban } from "@/components/entity-compliance-kanban"

// Sample data for Entity Annual Tax Prep
const initialItems = [
  {
    id: "1",
    entityName: "Johnson Family Trust",
    itemType: "Trust Tax Return",
    dueDate: "2024-04-15",
    responsiblePerson: "Sarah Chen",
    priority: "High",
    stage: "document-collection",
    description: "Annual tax preparation for Johnson Family Trust",
    entityType: "Trust",
    jurisdiction: "Federal & Delaware",
    filingFrequency: "Annual",
    lastFiled: "2023-04-10",
    requirements: "1099s, K-1s, charitable donation receipts, expense documentation",
    estimatedCost: "$7,500",
    notes: "Still waiting on K-1s from three investments",
    documents: [
      { name: "Prior Year Return", url: "#" },
      { name: "Document Checklist", url: "#" }
    ],
    relatedEntities: ["Johnson Holdings LLC"],
    taxYear: "2023",
    extensionFiled: "Yes",
    cpaFirm: "Anderson Tax Partners",
  },
  {
    id: "2",
    entityName: "Smith Investments LLC",
    itemType: "Partnership Return",
    dueDate: "2024-03-15",
    responsiblePerson: "Michael Rodriguez",
    priority: "Medium",
    stage: "cpa-review",
    description: "Partnership tax return for Smith Investments LLC",
    entityType: "LLC (Partnership)",
    jurisdiction: "Federal & New York",
    filingFrequency: "Annual",
    lastFiled: "2023-03-10",
    requirements: "Financial statements, partner information, investment activity",
    estimatedCost: "$5,000",
    notes: "All documents provided to CPA, awaiting initial review",
    documents: [
      { name: "Financial Statements", url: "#" },
      { name: "Partner Schedule", url: "#" }
    ],
    relatedEntities: ["Smith Family Trust"],
    taxYear: "2023",
    extensionFiled: "No",
    cpaFirm: "PwC",
  },
  {
    id: "3",
    entityName: "Coastal Properties LLC",
    itemType: "Partnership Return",
    dueDate: "2024-03-15",
    responsiblePerson: "Lisa Wang",
    priority: "High",
    stage: "draft-preparation",
    description: "Partnership tax return for real estate holdings",
    entityType: "LLC (Partnership)",
    jurisdiction: "Federal & Florida",
    filingFrequency: "Annual",
    lastFiled: "2023-03-12",
    requirements: "Property schedules, depreciation records, expense allocations",
    estimatedCost: "$6,000",
    notes: "CPA preparing initial draft, complex depreciation calculations",
    documents: [
      { name: "Property Schedule", url: "#" },
      { name: "Expense Allocation", url: "#" }
    ],
    relatedEntities: ["Johnson Family Trust"],
    taxYear: "2023",
    extensionFiled: "No",
    cpaFirm: "Deloitte",
  },
  {
    id: "4",
    entityName: "Johnson Holdings LLC",
    itemType: "Partnership Return",
    dueDate: "2024-03-15",
    responsiblePerson: "James Wilson",
    priority: "Medium",
    stage: "review",
    description: "Partnership tax return for holding company",
    entityType: "LLC (Partnership)",
    jurisdiction: "Federal & Nevada",
    filingFrequency: "Annual",
    lastFiled: "2023-03-14",
    requirements: "Investment schedules, income allocations, member information",
    estimatedCost: "$4,500",
    notes: "Draft received from CPA, under internal review",
    documents: [
      { name: "Draft Return", url: "#" },
      { name: "Review Notes", url: "#" }
    ],
    relatedEntities: ["Johnson Family Trust"],
    taxYear: "2023",
    extensionFiled: "No",
    cpaFirm: "Ernst & Young",
  },
  {
    id: "5",
    entityName: "Johnson Family Foundation",
    itemType: "Form 990-PF",
    dueDate: "2024-05-15",
    responsiblePerson: "Sarah Chen",
    priority: "High",
    stage: "finalization",
    description: "Private foundation annual tax return",
    entityType: "Private Foundation",
    jurisdiction: "Federal",
    filingFrequency: "Annual",
    lastFiled: "2023-05-10",
    requirements: "Grant records, investment activity, board minutes, financial statements",
    estimatedCost: "$8,000",
    notes: "Final review before submission, checking grant documentation",
    documents: [
      { name: "Draft 990-PF", url: "#" },
      { name: "Grant Schedule", url: "#" }
    ],
    relatedEntities: ["Johnson Family Trust"],
    taxYear: "2023",
    extensionFiled: "No",
    cpaFirm: "Anderson Tax Partners",
  },
  {
    id: "6",
    entityName: "Tech Ventures Fund",
    itemType: "Partnership Return",
    dueDate: "2024-03-15",
    responsiblePerson: "Michael Rodriguez",
    priority: "Low",
    stage: "filed",
    description: "Partnership tax return for venture investments",
    entityType: "LP",
    jurisdiction: "Federal & Delaware",
    filingFrequency: "Annual",
    lastFiled: "2024-03-10",
    requirements: "Investment schedules, carried interest calculations, partner allocations",
    estimatedCost: "$5,500",
    notes: "Filed on time, all K-1s distributed to partners",
    documents: [
      { name: "Filed Return", url: "#" },
      { name: "Filing Receipt", url: "#" }
    ],
    relatedEntities: ["Johnson Family Trust", "Smith Investments LLC"],
    taxYear: "2023",
    extensionFiled: "No",
    cpaFirm: "PwC",
  },
]

export default function EntityAnnualTaxPrepPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Entity Annual Tax Prep",
    description: "Encompasses multiple doc deadlines and CPA coordination across entities",
    objectType: "entity",
    attributes: [
      { id: "entityName", name: "Entity", type: "text" },
      { id: "entityType", name: "Entity Type", type: "text" },
      { id: "taxYear", name: "Tax Year", type: "text" },
      { id: "filingDeadline", name: "Filing Deadline", type: "date" },
      { id: "extensionFiled", name: "Extension Filed", type: "text" },
      { id: "cpaFirm", name: "CPA Firm", type: "text" },
    ],
    stages: [
      { id: "document-collection", name: "Document Collection", color: "bg-gray-100" },
      { id: "cpa-review", name: "CPA Review", color: "bg-blue-100" },
      { id: "draft-preparation", name: "Draft Preparation", color: "bg-yellow-100" },
      { id: "review", name: "Review", color: "bg-purple-100" },
      { id: "finalization", name: "Finalization", color: "bg-orange-100" },
      { id: "filed", name: "Filed", color: "bg-green-100" },
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
                  <BreadcrumbPage>Entity Annual Tax Prep</BreadcrumbPage>
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
                    <h1 className="text-2xl font-semibold">Entity Annual Tax Prep</h1>
                    <p className="text-muted-foreground">Encompasses multiple doc deadlines and CPA coordination across entities</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Entity Annual Tax Prep"
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