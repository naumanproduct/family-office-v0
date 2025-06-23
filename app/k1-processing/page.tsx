"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { TaxDocumentKanban } from "@/components/tax-document-kanban"

// Sample document data for K-1 Processing
const initialDocuments = [
  {
    id: "1",
    documentName: "K-1 Form",
    entityName: "Johnson Family Trust",
    documentType: "Partnership K-1",
    dueDate: "2024-04-15",
    assignedTo: "Sarah Chen",
    status: "Pending Review",
    stage: "awaiting-document",
    description: "Awaiting K-1 from BlackRock Ventures Fund III",
    taxYear: "2023",
    fileType: "PDF",
    fileSize: "N/A",
    lastUpdated: "2024-01-15",
    uploadedBy: "N/A",
    relatedEntities: ["BlackRock Ventures Fund III"],
    notes: "Expected to arrive by end of March",
    documentURL: "#",
  },
  {
    id: "2",
    documentName: "K-1 Form",
    entityName: "Coastal Properties LLC",
    documentType: "Partnership K-1",
    dueDate: "2024-04-15",
    assignedTo: "Michael Rodriguez",
    status: "Under Review",
    stage: "received",
    description: "K-1 from Real Estate Partners Fund II",
    taxYear: "2023",
    fileType: "PDF",
    fileSize: "1.8 MB",
    lastUpdated: "2024-03-05",
    uploadedBy: "System Import",
    relatedEntities: ["Real Estate Partners Fund II"],
    notes: "Received early, needs verification of capital account reconciliation",
    documentURL: "#",
  },
  {
    id: "3",
    documentName: "K-1 Form",
    entityName: "Tech Ventures Fund",
    documentType: "Partnership K-1",
    dueDate: "2024-04-15",
    assignedTo: "Lisa Wang",
    status: "Reviewing",
    stage: "under-review",
    description: "K-1 from Sequoia Growth Fund",
    taxYear: "2023",
    fileType: "PDF",
    fileSize: "2.2 MB",
    lastUpdated: "2024-03-10",
    uploadedBy: "Lisa Wang",
    relatedEntities: ["Sequoia Growth Fund"],
    notes: "Currently under review by tax team",
    documentURL: "#",
  },
  {
    id: "4",
    documentName: "K-1 Form",
    entityName: "Johnson Family Trust",
    documentType: "Partnership K-1",
    dueDate: "2024-04-15",
    assignedTo: "James Wilson",
    status: "Queries Sent",
    stage: "queries-sent",
    description: "K-1 from Private Equity Partners IV",
    taxYear: "2023",
    fileType: "PDF",
    fileSize: "1.5 MB",
    lastUpdated: "2024-03-12",
    uploadedBy: "James Wilson",
    relatedEntities: ["Private Equity Partners IV"],
    notes: "Questions sent to fund administrator about unusual capital allocation",
    documentURL: "#",
  },
  {
    id: "5",
    documentName: "K-1 Form",
    entityName: "Smith Investments LLC",
    documentType: "Partnership K-1",
    dueDate: "2024-04-15",
    assignedTo: "Sarah Chen",
    status: "Approved",
    stage: "approved",
    description: "K-1 from Infrastructure Fund I",
    taxYear: "2023",
    fileType: "PDF",
    fileSize: "1.9 MB",
    lastUpdated: "2024-03-18",
    uploadedBy: "Sarah Chen",
    relatedEntities: ["Infrastructure Fund I"],
    notes: "Reviewed and approved, ready for tax preparation",
    documentURL: "#",
  },
  {
    id: "6",
    documentName: "K-1 Form",
    entityName: "Johnson Holdings LLC",
    documentType: "Partnership K-1",
    dueDate: "2024-04-15",
    assignedTo: "Michael Rodriguez",
    status: "Filed",
    stage: "filed",
    description: "K-1 from Credit Opportunities Fund II",
    taxYear: "2023",
    fileType: "PDF",
    fileSize: "2.1 MB",
    lastUpdated: "2024-03-25",
    uploadedBy: "Michael Rodriguez",
    relatedEntities: ["Credit Opportunities Fund II"],
    notes: "Processed and filed with tax return",
    documentURL: "#",
  },
]

export default function K1ProcessingPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "K-1 Processing",
    description: "Tax-critical workflow for every legal entity; spans months of document handling",
    objectType: "entity",
    attributes: [
      { id: "entityName", name: "Entity", type: "text" },
      { id: "taxYear", name: "Tax Year", type: "text" },
      { id: "documentType", name: "Document Type", type: "text" },
      { id: "dueDate", name: "Due Date", type: "date" },
      { id: "assignedTo", name: "Assigned To", type: "user" },
      { id: "status", name: "Status", type: "text" },
    ],
    stages: [
      { id: "awaiting-document", name: "Awaiting Document", color: "bg-gray-100" },
      { id: "received", name: "Received", color: "bg-blue-100" },
      { id: "under-review", name: "Under Review", color: "bg-yellow-100" },
      { id: "queries-sent", name: "Queries Sent", color: "bg-orange-100" },
      { id: "approved", name: "Approved", color: "bg-green-100" },
      { id: "filed", name: "Filed", color: "bg-purple-100" },
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
                  <BreadcrumbPage>K-1 Processing</BreadcrumbPage>
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
                    <h1 className="text-2xl font-semibold">K-1 Processing</h1>
                    <p className="text-muted-foreground">Tax-critical workflow for every legal entity; spans months of document handling</p>
                  </div>
                  <WorkflowHeader
                    workflowName="K-1 Processing"
                    workflowConfig={workflowConfig}
                    onSave={handleSaveWorkflow}
                  />
                </div>
                <TaxDocumentKanban 
                  workflowConfig={workflowConfig} 
                  initialDocuments={initialDocuments}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 