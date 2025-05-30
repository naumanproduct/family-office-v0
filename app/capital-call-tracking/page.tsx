import { AppSidebar } from "../../components/app-sidebar"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CapitalCallKanban } from "../../components/capital-call-kanban"
import { WorkflowHeader } from "../../components/workflows/workflow-header"

const workflowConfig = {
  name: "Capital Call Tracking",
  description: "Track capital call requests through the process from initiation to completion",
  objectType: "capital-call",
  attributes: [
    { id: "name", name: "Name", type: "text" },
    { id: "fund", name: "Fund", type: "relation" },
    { id: "amount", name: "Amount", type: "currency" },
    { id: "dueDate", name: "Due Date", type: "date" },
    { id: "status", name: "Status", type: "select" },
    { id: "investor", name: "Investor", type: "relation" },
    { id: "commitment", name: "Commitment", type: "currency" },
  ],
  stages: [
    { id: "new", name: "New", color: "bg-blue-100" },
    { id: "in-progress", name: "In Progress", color: "bg-yellow-100" },
    { id: "done", name: "Done", color: "bg-green-100" },
  ],
}

export default function CapitalCallTrackingPage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-semibold">Capital Call Tracking</h1>
                    <p className="text-muted-foreground">Monitor and manage capital call requests and commitments</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Capital Call Tracking"
                    workflowConfig={workflowConfig}
                    onSave={(workflow) => {
                      console.log("Workflow updated:", workflow)
                      // Handle workflow updates here
                    }}
                  />
                </div>
                <CapitalCallKanban />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
