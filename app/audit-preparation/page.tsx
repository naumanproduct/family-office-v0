"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { EntityComplianceKanban } from "@/components/entity-compliance-kanban"

// Sample data for Audit Preparation
const initialItems = [
  {
    id: "1",
    entityName: "Johnson Family Trust",
    itemType: "Financial Audit",
    dueDate: "2024-08-15",
    responsiblePerson: "Sarah Chen",
    priority: "High",
    stage: "planning",
    description: "Annual financial audit for the trust",
    entityType: "Trust",
    jurisdiction: "Delaware",
    filingFrequency: "Annual",
    lastFiled: "2023-08-10",
    requirements: "Financial statements, investment records, bank statements, transaction logs",
    estimatedCost: "$25,000",
    notes: "Planning meeting scheduled with auditors next week",
    documents: [
      { name: "Prior Year Audit", url: "#" },
      { name: "Audit Planning Memo", url: "#" }
    ],
    relatedEntities: ["Johnson Holdings LLC"],
    auditYear: "2023",
    auditType: "Financial",
    auditFirm: "PwC",
    startDate: "2024-07-01",
  },
  {
    id: "2",
    entityName: "Smith Investments LLC",
    itemType: "Compliance Audit",
    dueDate: "2024-09-30",
    responsiblePerson: "Michael Rodriguez",
    priority: "Medium",
    stage: "document-collection",
    description: "Regulatory compliance audit for investment activities",
    entityType: "LLC",
    jurisdiction: "New York",
    filingFrequency: "Annual",
    lastFiled: "2023-09-15",
    requirements: "Investment policies, compliance records, transaction history, KYC documentation",
    estimatedCost: "$18,000",
    notes: "Gathering documentation from multiple departments",
    documents: [
      { name: "Document Request List", url: "#" },
      { name: "Compliance Policies", url: "#" }
    ],
    relatedEntities: ["Smith Family Trust"],
    auditYear: "2023",
    auditType: "Compliance",
    auditFirm: "Deloitte",
    startDate: "2024-07-15",
  },
  {
    id: "3",
    entityName: "Johnson Family Foundation",
    itemType: "Grant Compliance Audit",
    dueDate: "2024-10-15",
    responsiblePerson: "Lisa Wang",
    priority: "High",
    stage: "internal-review",
    description: "Audit of grant compliance and distribution practices",
    entityType: "Private Foundation",
    jurisdiction: "Federal",
    filingFrequency: "Annual",
    lastFiled: "2023-10-10",
    requirements: "Grant agreements, disbursement records, grantee reports, board minutes",
    estimatedCost: "$15,000",
    notes: "Internal team reviewing grant documentation before auditor visit",
    documents: [
      { name: "Grant Schedule", url: "#" },
      { name: "Grantee Reports", url: "#" }
    ],
    relatedEntities: ["Johnson Family Trust"],
    auditYear: "2023",
    auditType: "Grant Compliance",
    auditFirm: "Ernst & Young",
    startDate: "2024-06-15",
  },
  {
    id: "4",
    entityName: "Coastal Properties LLC",
    itemType: "Financial Audit",
    dueDate: "2024-09-15",
    responsiblePerson: "James Wilson",
    priority: "Medium",
    stage: "auditor-review",
    description: "Financial audit of real estate holdings and operations",
    entityType: "LLC",
    jurisdiction: "Florida",
    filingFrequency: "Annual",
    lastFiled: "2023-09-12",
    requirements: "Property records, rental income, expense documentation, asset valuations",
    estimatedCost: "$22,000",
    notes: "Auditors currently reviewing provided documentation",
    documents: [
      { name: "Property Schedule", url: "#" },
      { name: "Financial Statements", url: "#" }
    ],
    relatedEntities: ["Johnson Family Trust"],
    auditYear: "2023",
    auditType: "Financial",
    auditFirm: "KPMG",
    startDate: "2024-06-01",
  },
  {
    id: "5",
    entityName: "Tech Ventures Fund",
    itemType: "Valuation Audit",
    dueDate: "2024-08-30",
    responsiblePerson: "Sarah Chen",
    priority: "High",
    stage: "addressing-findings",
    description: "Audit of investment valuations and methodology",
    entityType: "LP",
    jurisdiction: "Delaware",
    filingFrequency: "Annual",
    lastFiled: "2023-08-25",
    requirements: "Valuation policies, portfolio company financials, market comparables",
    estimatedCost: "$30,000",
    notes: "Addressing preliminary findings on valuation methodology",
    documents: [
      { name: "Preliminary Findings", url: "#" },
      { name: "Valuation Policy", url: "#" }
    ],
    relatedEntities: ["Johnson Family Trust", "Smith Investments LLC"],
    auditYear: "2023",
    auditType: "Valuation",
    auditFirm: "PwC",
    startDate: "2024-05-15",
  },
  {
    id: "6",
    entityName: "Johnson Holdings LLC",
    itemType: "Tax Audit",
    dueDate: "2024-07-30",
    responsiblePerson: "Michael Rodriguez",
    priority: "Medium",
    stage: "completed",
    description: "IRS audit of tax filings and supporting documentation",
    entityType: "LLC",
    jurisdiction: "Federal & Nevada",
    filingFrequency: "As needed",
    lastFiled: "2024-07-25",
    requirements: "Tax returns, supporting schedules, transaction records, expense documentation",
    estimatedCost: "$20,000",
    notes: "Audit completed with no material findings",
    documents: [
      { name: "Audit Closure Letter", url: "#" },
      { name: "Final Report", url: "#" }
    ],
    relatedEntities: ["Johnson Family Trust"],
    auditYear: "2022",
    auditType: "Tax",
    auditFirm: "IRS",
    startDate: "2024-04-01",
  },
]

export default function AuditPreparationPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Audit Preparation",
    description: "Enables proactive prep and clear paper trail; important for compliance workflows",
    objectType: "entity",
    attributes: [
      { id: "entityName", name: "Entity", type: "text" },
      { id: "auditYear", name: "Audit Year", type: "text" },
      { id: "auditType", name: "Audit Type", type: "text" },
      { id: "auditFirm", name: "Audit Firm", type: "text" },
      { id: "startDate", name: "Start Date", type: "date" },
      { id: "dueDate", name: "Due Date", type: "date" },
    ],
    stages: [
      { id: "planning", name: "Planning", color: "bg-gray-100" },
      { id: "document-collection", name: "Document Collection", color: "bg-blue-100" },
      { id: "internal-review", name: "Internal Review", color: "bg-yellow-100" },
      { id: "auditor-review", name: "Auditor Review", color: "bg-purple-100" },
      { id: "addressing-findings", name: "Addressing Findings", color: "bg-orange-100" },
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
                  <BreadcrumbPage>Audit Preparation</BreadcrumbPage>
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
                    <h1 className="text-2xl font-semibold">Audit Preparation</h1>
                    <p className="text-muted-foreground">Enables proactive prep and clear paper trail; important for compliance workflows</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Audit Preparation"
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
