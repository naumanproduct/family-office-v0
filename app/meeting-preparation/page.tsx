"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { MeetingPreparationKanban } from "@/components/meeting-preparation-kanban"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"

export default function MeetingPreparationPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Meeting Preparation",
    description: "Prepare for meetings with external contacts and potential partners",
    objectType: "contact",
    attributes: [
      { id: "contactName", name: "Contact Name", type: "text" },
      { id: "company", name: "Company", type: "text" },
      { id: "meetingDate", name: "Meeting Date", type: "date" },
      { id: "meetingType", name: "Meeting Type", type: "text" },
      { id: "owner", name: "Owner", type: "user" },
      { id: "priority", name: "Priority", type: "text" },
    ],
    stages: [
      { id: "scheduled", name: "Scheduled", color: "bg-gray-100" },
      { id: "research", name: "Research", color: "bg-blue-100" },
      { id: "agenda-prep", name: "Agenda Prep", color: "bg-yellow-100" },
      { id: "materials-ready", name: "Materials Ready", color: "bg-purple-100" },
      { id: "briefing-complete", name: "Briefing Complete", color: "bg-orange-100" },
      { id: "meeting-held", name: "Meeting Held", color: "bg-green-100" },
      { id: "follow-up", name: "Follow-up", color: "bg-pink-100" },
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
                  <BreadcrumbPage>Meeting Preparation</BreadcrumbPage>
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
                    <h1 className="text-2xl font-semibold">Meeting Preparation</h1>
                    <p className="text-muted-foreground">Prepare for meetings with external contacts and potential partners</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Meeting Preparation"
                    workflowConfig={workflowConfig}
                    onSave={handleSaveWorkflow}
                  />
                </div>
                <MeetingPreparationKanban workflowConfig={workflowConfig} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 