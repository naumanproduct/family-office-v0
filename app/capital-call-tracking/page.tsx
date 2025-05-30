import { WorkflowHeader } from "@/components/workflows/workflow-header"

const workflowConfig = {
  name: "Capital Call Tracking",
  description: "Track capital call processes with automated notifications and document generation",
  objectType: "capital-call",
  attributes: [
    { id: "fund", name: "Fund", type: "relation" },
    { id: "amount", name: "Amount", type: "currency" },
    { id: "dueDate", name: "Due Date", type: "date" },
    { id: "status", name: "Status", type: "select" },
    { id: "investor", name: "Investor", type: "relation" },
    { id: "percentOfCommitment", name: "% of Commitment", type: "number" },
    { id: "callNumber", name: "Call Number", type: "number" },
  ],
  stages: [
    { id: "new", name: "New", color: "bg-gray-100" },
    { id: "in-progress", name: "In Progress", color: "bg-blue-100" },
    { id: "done", name: "Done", color: "bg-green-100" },
  ],
}

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <WorkflowHeader
        workflowName="Capital Call Tracking"
        workflowConfig={workflowConfig}
        onSave={(workflow) => {
          console.log("Workflow updated:", workflow)
          // Handle workflow updates here
        }}
      />
    </main>
  )
}
