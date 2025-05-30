import { AppSidebar } from "../../components/app-sidebar"
import { SiteHeader } from "../../components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DealPipelineKanban } from "../../components/deal-pipeline-kanban"
import { WorkflowHeader } from "../../components/workflows/workflow-header"

const workflowConfig = {
  name: "Deal Pipeline",
  description: "Track investment opportunities through the pipeline from initial contact to closing",
  objectType: "opportunity",
  attributes: [
    { id: "name", name: "Name", type: "text" },
    { id: "company", name: "Company", type: "relation" },
    { id: "amount", name: "Amount", type: "currency" },
    { id: "stage", name: "Stage", type: "select" },
    { id: "owner", name: "Owner", type: "user" },
    { id: "probability", name: "Probability", type: "number" },
    { id: "expectedClose", name: "Expected Close", type: "date" },
  ],
  stages: [
    { id: "awareness", name: "Awareness", color: "bg-gray-100" },
    { id: "initial-contact", name: "Initial Contact", color: "bg-blue-100" },
    { id: "work-in-progress", name: "Work in Progress", color: "bg-yellow-100" },
    { id: "term-sheet", name: "Term Sheet", color: "bg-purple-100" },
    { id: "due-diligence", name: "Due Diligence", color: "bg-orange-100" },
    { id: "invested", name: "Invested", color: "bg-green-100" },
    { id: "passed", name: "Passed", color: "bg-red-100" },
  ],
}

export default function DealPipelinePage() {
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
                    <h1 className="text-2xl font-semibold">Deal Pipeline</h1>
                    <p className="text-muted-foreground">Track and manage your investment opportunities</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Deal Pipeline"
                    workflowConfig={workflowConfig}
                    onSave={(workflow) => {
                      console.log("Workflow updated:", workflow)
                      // Handle workflow updates here
                    }}
                  />
                </div>
                <DealPipelineKanban />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
