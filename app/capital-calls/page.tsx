"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CapitalCallKanban } from "@/components/capital-call-kanban"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"

// Sample data for Capital Calls
const initialCalls = [
  {
    id: "1",
    fundName: "Growth Fund III",
    callNumber: "Call #4",
    callAmount: "$2,500,000",
    commitmentAmount: "$20,000,000",
    dueDate: "2024-07-15",
    noticeDate: "2024-06-15",
    investor: "Johnson Family Trust",
    stage: "notice-received",
    description: "Fourth capital call for Growth Fund III",
    fundManager: "Sequoia Capital",
    email: "capitalcalls@sequoia.com",
    phone: "+1 (555) 123-4567",
    website: "sequoiacap.com",
    fundType: "Private Equity",
    vintage: "2022",
    totalFundSize: "$500M",
    remainingCommitment: "$12,500,000",
    previousCalls: "$5,000,000",
    purpose: "New portfolio company investment",
  },
  {
    id: "2",
    fundName: "Real Estate Fund IV",
    callNumber: "Call #2",
    callAmount: "$1,800,000",
    commitmentAmount: "$15,000,000",
    dueDate: "2024-07-10",
    noticeDate: "2024-06-10",
    investor: "Coastal Properties LLC",
    stage: "processing",
    description: "Second capital call for Real Estate Fund IV",
    fundManager: "Blackstone",
    email: "notices@blackstone.com",
    phone: "+1 (555) 234-5678",
    website: "blackstone.com",
    fundType: "Real Estate",
    vintage: "2023",
    totalFundSize: "$750M",
    remainingCommitment: "$10,200,000",
    previousCalls: "$3,000,000",
    purpose: "Acquisition of commercial properties in Atlanta",
  },
  {
    id: "3",
    fundName: "Tech Ventures II",
    callNumber: "Call #1",
    callAmount: "$1,250,000",
    commitmentAmount: "$5,000,000",
    dueDate: "2024-07-05",
    noticeDate: "2024-06-05",
    investor: "Smith Investments LLC",
    stage: "approval-pending",
    description: "Initial capital call for Tech Ventures II",
    fundManager: "Andreessen Horowitz",
    email: "operations@a16z.com",
    phone: "+1 (555) 345-6789",
    website: "a16z.com",
    fundType: "Venture Capital",
    vintage: "2024",
    totalFundSize: "$300M",
    remainingCommitment: "$3,750,000",
    previousCalls: "$0",
    purpose: "Initial investments in seed-stage startups",
  },
  {
    id: "4",
    fundName: "Infrastructure Fund I",
    callNumber: "Call #3",
    callAmount: "$2,000,000",
    commitmentAmount: "$10,000,000",
    dueDate: "2024-06-30",
    noticeDate: "2024-06-01",
    investor: "Johnson Holdings LLC",
    stage: "payment-scheduled",
    description: "Third capital call for Infrastructure Fund I",
    fundManager: "KKR",
    email: "investorrelations@kkr.com",
    phone: "+1 (555) 456-7890",
    website: "kkr.com",
    fundType: "Infrastructure",
    vintage: "2022",
    totalFundSize: "$1.2B",
    remainingCommitment: "$4,000,000",
    previousCalls: "$4,000,000",
    purpose: "Investment in renewable energy projects",
  },
  {
    id: "5",
    fundName: "Credit Opportunities Fund II",
    callNumber: "Call #2",
    callAmount: "$1,500,000",
    commitmentAmount: "$7,500,000",
    dueDate: "2024-06-25",
    noticeDate: "2024-05-25",
    investor: "Johnson Family Trust",
    stage: "payment-confirmed",
    description: "Second capital call for Credit Opportunities Fund II",
    fundManager: "Apollo",
    email: "creditops@apollo.com",
    phone: "+1 (555) 567-8901",
    website: "apollo.com",
    fundType: "Private Credit",
    vintage: "2023",
    totalFundSize: "$800M",
    remainingCommitment: "$4,500,000",
    previousCalls: "$1,500,000",
    purpose: "Distressed debt opportunities",
  },
  {
    id: "6",
    fundName: "Sustainable Energy Fund",
    callNumber: "Call #1",
    callAmount: "$2,000,000",
    commitmentAmount: "$8,000,000",
    dueDate: "2024-06-20",
    noticeDate: "2024-05-20",
    investor: "Smith Investments LLC",
    stage: "completed",
    description: "Initial capital call for Sustainable Energy Fund",
    fundManager: "Generation Investment Management",
    email: "operations@generationim.com",
    phone: "+1 (555) 678-9012",
    website: "generationim.com",
    fundType: "Impact Investing",
    vintage: "2024",
    totalFundSize: "$400M",
    remainingCommitment: "$6,000,000",
    previousCalls: "$0",
    purpose: "Investments in clean energy technologies",
  },
]

export default function CapitalCallsPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Capital Calls",
    description: "Manage the flow of capital calls from notice to payment confirmation",
    objectType: "investment",
    attributes: [
      { id: "fundName", name: "Fund", type: "text" },
      { id: "callNumber", name: "Call #", type: "text" },
      { id: "callAmount", name: "Call Amount", type: "currency" },
      { id: "dueDate", name: "Due Date", type: "date" },
      { id: "investor", name: "Investor", type: "text" },
      { id: "purpose", name: "Purpose", type: "text" },
    ],
    stages: [
      { id: "notice-received", name: "Notice Received", color: "bg-gray-100" },
      { id: "processing", name: "Processing", color: "bg-blue-100" },
      { id: "approval-pending", name: "Approval Pending", color: "bg-yellow-100" },
      { id: "payment-scheduled", name: "Payment Scheduled", color: "bg-purple-100" },
      { id: "payment-confirmed", name: "Payment Confirmed", color: "bg-orange-100" },
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
                  <BreadcrumbPage>Capital Calls</BreadcrumbPage>
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
                    <h1 className="text-2xl font-semibold">Capital Calls</h1>
                    <p className="text-muted-foreground">Manage the flow of capital calls from notice to payment confirmation</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Capital Calls"
                    workflowConfig={workflowConfig}
                    onSave={handleSaveWorkflow}
                  />
                </div>
                <CapitalCallKanban 
                  workflowConfig={workflowConfig} 
                  initialCalls={initialCalls}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 