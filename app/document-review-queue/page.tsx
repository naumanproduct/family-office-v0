"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { TaxDocumentKanban } from "@/components/tax-document-kanban"

// Sample document data for Document Review Queue
const initialDocuments = [
  {
    id: "1",
    documentName: "Q1 Investment Report",
    documentType: "Financial Report",
    source: "Email Attachment",
    receivedDate: "2024-06-15",
    priority: "High",
    assignedTo: "Sarah Chen",
    stage: "new",
    description: "Quarterly investment performance report from BlackRock",
    fileType: "PDF",
    fileSize: "2.8 MB",
    lastUpdated: "2024-06-15",
    uploadedBy: "System Import",
    relatedEntities: ["Johnson Family Trust", "BlackRock Investments"],
    notes: "Needs immediate review for quarterly meeting",
    documentURL: "#",
  },
  {
    id: "2",
    documentName: "Venture Fund Term Sheet",
    documentType: "Legal",
    source: "Secure Upload",
    receivedDate: "2024-06-14",
    priority: "Medium",
    assignedTo: "Michael Rodriguez",
    stage: "categorized",
    description: "Term sheet for potential new venture fund investment",
    fileType: "PDF",
    fileSize: "1.5 MB",
    lastUpdated: "2024-06-14",
    uploadedBy: "David Kim",
    relatedEntities: ["Johnson Family Trust", "Sequoia Ventures"],
    notes: "Categorized and ready for legal team review",
    documentURL: "#",
  },
  {
    id: "3",
    documentName: "Property Tax Assessment",
    documentType: "Tax",
    source: "Mail Scan",
    receivedDate: "2024-06-12",
    priority: "Medium",
    assignedTo: "Lisa Wang",
    stage: "assigned",
    description: "Annual property tax assessment for Miami commercial property",
    fileType: "PDF",
    fileSize: "3.2 MB",
    lastUpdated: "2024-06-13",
    uploadedBy: "Admin Assistant",
    relatedEntities: ["Coastal Properties LLC"],
    notes: "Assigned to Lisa for review and payment processing",
    documentURL: "#",
  },
  {
    id: "4",
    documentName: "Partnership Agreement Amendment",
    documentType: "Legal",
    source: "Email Attachment",
    receivedDate: "2024-06-10",
    priority: "High",
    assignedTo: "James Wilson",
    stage: "in-review",
    description: "Amendment to existing partnership agreement with Tech Ventures",
    fileType: "DOCX",
    fileSize: "550 KB",
    lastUpdated: "2024-06-11",
    uploadedBy: "Legal Department",
    relatedEntities: ["Johnson Family Trust", "Tech Ventures Fund"],
    notes: "Currently under review by legal team",
    documentURL: "#",
  },
  {
    id: "5",
    documentName: "Insurance Policy Renewal",
    documentType: "Insurance",
    source: "Secure Upload",
    receivedDate: "2024-06-08",
    priority: "Low",
    assignedTo: "Sarah Chen",
    stage: "action-needed",
    description: "Annual renewal documents for property insurance",
    fileType: "PDF",
    fileSize: "4.7 MB",
    lastUpdated: "2024-06-09",
    uploadedBy: "Insurance Broker",
    relatedEntities: ["Coastal Properties LLC", "Johnson Family Trust"],
    notes: "Requires signature and payment by June 30",
    documentURL: "#",
  },
  {
    id: "6",
    documentName: "Charitable Foundation Report",
    documentType: "Financial Report",
    source: "Email Attachment",
    receivedDate: "2024-06-05",
    priority: "Medium",
    assignedTo: "Michael Rodriguez",
    stage: "completed",
    description: "Annual activity report for Johnson Family Foundation",
    fileType: "PDF",
    fileSize: "3.8 MB",
    lastUpdated: "2024-06-07",
    uploadedBy: "Foundation Director",
    relatedEntities: ["Johnson Family Foundation"],
    notes: "Reviewed and filed with appropriate documentation",
    documentURL: "#",
  },
]

export default function DocumentReviewQueuePage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Document Review Queue",
    description: "Central triage board for incoming documents (uploaded or integrated)",
    objectType: "task",
    attributes: [
      { id: "documentName", name: "Document Name", type: "text" },
      { id: "documentType", name: "Document Type", type: "text" },
      { id: "source", name: "Source", type: "text" },
      { id: "receivedDate", name: "Received Date", type: "date" },
      { id: "priority", name: "Priority", type: "text" },
      { id: "assignedTo", name: "Assigned To", type: "user" },
    ],
    stages: [
      { id: "new", name: "New", color: "bg-gray-100" },
      { id: "categorized", name: "Categorized", color: "bg-blue-100" },
      { id: "assigned", name: "Assigned", color: "bg-yellow-100" },
      { id: "in-review", name: "In Review", color: "bg-purple-100" },
      { id: "action-needed", name: "Action Needed", color: "bg-orange-100" },
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
                  <BreadcrumbPage>Document Review Queue</BreadcrumbPage>
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
                    <h1 className="text-2xl font-semibold">Document Review Queue</h1>
                    <p className="text-muted-foreground">Central triage board for incoming documents (uploaded or integrated)</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Document Review Queue"
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