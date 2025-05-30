import { WorkflowHeader } from "@/components/workflows/workflow-header"

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
    { id: "initial-contact", name: "Initial Contact", color: "bg-gray-100" },
    { id: "proposal", name: "Proposal", color: "bg-blue-100" },
    { id: "due-diligence", name: "Due Diligence", color: "bg-yellow-100" },
    { id: "term-sheet", name: "Term Sheet", color: "bg-purple-100" },
    { id: "closed-won", name: "Closed Won", color: "bg-green-100" },
    { id: "closed-lost", name: "Closed Lost", color: "bg-red-100" },
  ],
}

export default function DealPipelinePage() {
  return (
    <div>
      <WorkflowHeader
        workflowName="Deal Pipeline"
        workflowConfig={workflowConfig}
        onSave={(workflow) => {
          console.log("Workflow updated:", workflow)
          // Handle workflow updates here
        }}
      />
    </div>
  )
}
