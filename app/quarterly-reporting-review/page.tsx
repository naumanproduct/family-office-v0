"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { TaxDocumentKanban } from "@/components/tax-document-kanban"

// Sample document data for Quarterly Reporting Review
const initialDocuments = [
  {
    id: "1",
    documentName: "Growth Fund III - Q2 2024 Report",
    entityName: "Growth Fund III",
    documentType: "Quarterly Report",
    dueDate: "2024-07-31",
    assignedTo: "Sarah Chen",
    stage: "received",
    description: "Q2 2024 quarterly report from Growth Fund III",
    taxYear: "2024",
    fileType: "PDF",
    fileSize: "3.2 MB",
    lastUpdated: "2024-07-05",
    uploadedBy: "System Import",
    relatedEntities: ["Johnson Family Trust"],
    notes: "Just received, needs initial review",
    documentURL: "#",
    reportingPeriod: "Q2 2024",
    fundManager: "Sequoia Capital",
    reviewPriority: "High",
  },
  {
    id: "2",
    documentName: "Real Estate Fund IV - Q2 2024 Report",
    entityName: "Real Estate Fund IV",
    documentType: "Quarterly Report",
    dueDate: "2024-07-31",
    assignedTo: "Michael Rodriguez",
    stage: "initial-review",
    description: "Q2 2024 quarterly report from Real Estate Fund IV",
    taxYear: "2024",
    fileType: "PDF",
    fileSize: "4.5 MB",
    lastUpdated: "2024-07-03",
    uploadedBy: "System Import",
    relatedEntities: ["Coastal Properties LLC"],
    notes: "Initial review in progress, checking property valuations",
    documentURL: "#",
    reportingPeriod: "Q2 2024",
    fundManager: "Blackstone",
    reviewPriority: "Medium",
  },
  {
    id: "3",
    documentName: "Tech Ventures II - Q2 2024 Report",
    entityName: "Tech Ventures II",
    documentType: "Quarterly Report",
    dueDate: "2024-07-31",
    assignedTo: "Lisa Wang",
    stage: "detailed-analysis",
    description: "Q2 2024 quarterly report from Tech Ventures II",
    taxYear: "2024",
    fileType: "PDF",
    fileSize: "2.8 MB",
    lastUpdated: "2024-07-01",
    uploadedBy: "System Import",
    relatedEntities: ["Smith Investments LLC"],
    notes: "Analyzing portfolio company valuations and performance metrics",
    documentURL: "#",
    reportingPeriod: "Q2 2024",
    fundManager: "Andreessen Horowitz",
    reviewPriority: "High",
  },
  {
    id: "4",
    documentName: "Infrastructure Fund I - Q2 2024 Report",
    entityName: "Infrastructure Fund I",
    documentType: "Quarterly Report",
    dueDate: "2024-07-31",
    assignedTo: "James Wilson",
    stage: "questions-sent",
    description: "Q2 2024 quarterly report from Infrastructure Fund I",
    taxYear: "2024",
    fileType: "PDF",
    fileSize: "5.1 MB",
    lastUpdated: "2024-06-28",
    uploadedBy: "System Import",
    relatedEntities: ["Johnson Holdings LLC"],
    notes: "Questions sent to fund manager about operating expense increases",
    documentURL: "#",
    reportingPeriod: "Q2 2024",
    fundManager: "KKR",
    reviewPriority: "Medium",
  },
  {
    id: "5",
    documentName: "Credit Opportunities Fund II - Q2 2024 Report",
    entityName: "Credit Opportunities Fund II",
    documentType: "Quarterly Report",
    dueDate: "2024-07-31",
    assignedTo: "Sarah Chen",
    stage: "data-entry",
    description: "Q2 2024 quarterly report from Credit Opportunities Fund II",
    taxYear: "2024",
    fileType: "PDF",
    fileSize: "3.7 MB",
    lastUpdated: "2024-06-30",
    uploadedBy: "System Import",
    relatedEntities: ["Johnson Family Trust"],
    notes: "Review complete, entering data into portfolio tracking system",
    documentURL: "#",
    reportingPeriod: "Q2 2024",
    fundManager: "Apollo",
    reviewPriority: "Low",
  },
  {
    id: "6",
    documentName: "Sustainable Energy Fund - Q2 2024 Report",
    entityName: "Sustainable Energy Fund",
    documentType: "Quarterly Report",
    dueDate: "2024-07-31",
    assignedTo: "Michael Rodriguez",
    stage: "completed",
    description: "Q2 2024 quarterly report from Sustainable Energy Fund",
    taxYear: "2024",
    fileType: "PDF",
    fileSize: "2.9 MB",
    lastUpdated: "2024-06-25",
    uploadedBy: "System Import",
    relatedEntities: ["Smith Investments LLC"],
    notes: "Review completed and data entered into system",
    documentURL: "#",
    reportingPeriod: "Q2 2024",
    fundManager: "Generation Investment Management",
    reviewPriority: "Medium",
  },
]

export default function QuarterlyReportingReviewPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Quarterly Reporting Review",
    description: "Process for reviewing quarterly investment reports and updating data",
    objectType: "document",
    attributes: [
      { id: "entityName", name: "Fund", type: "text" },
      { id: "reportingPeriod", name: "Period", type: "text" },
      { id: "documentType", name: "Document Type", type: "text" },
      { id: "fundManager", name: "Manager", type: "text" },
      { id: "assignedTo", name: "Assigned To", type: "user" },
      { id: "reviewPriority", name: "Priority", type: "text" },
    ],
    stages: [
      { id: "received", name: "Received", color: "bg-gray-100" },
      { id: "initial-review", name: "Initial Review", color: "bg-blue-100" },
      { id: "detailed-analysis", name: "Detailed Analysis", color: "bg-yellow-100" },
      { id: "questions-sent", name: "Questions Sent", color: "bg-purple-100" },
      { id: "data-entry", name: "Data Entry", color: "bg-orange-100" },
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
                  <BreadcrumbPage>Quarterly Reporting Review</BreadcrumbPage>
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
                    <h1 className="text-2xl font-semibold">Quarterly Reporting Review</h1>
                    <p className="text-muted-foreground">Process for reviewing quarterly investment reports and updating data</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Quarterly Reporting Review"
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
