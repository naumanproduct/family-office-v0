"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { CapitalCallKanban } from "@/components/capital-call-kanban"

// Sample data for Distributions Tracking
const initialCalls = [
  {
    id: "1",
    fundName: "Growth Fund III",
    callNumber: "Distribution #5",
    callAmount: "$1,800,000",
    commitmentAmount: "$20,000,000",
    dueDate: "2024-07-05",
    noticeDate: "2024-06-20",
    investor: "Johnson Family Trust",
    stage: "notice-received",
    description: "Distribution from portfolio company exit",
    fundManager: "Sequoia Capital",
    email: "distributions@sequoia.com",
    phone: "+1 (555) 123-4567",
    website: "sequoiacap.com",
    fundType: "Private Equity",
    vintage: "2022",
    totalFundSize: "$500M",
    remainingCommitment: "$12,500,000",
    previousCalls: "$5,000,000",
    purpose: "Exit of TechCorp investment",
    distributionType: "Return of Capital",
    distributionAmount: "$1,800,000",
    expectedDate: "2024-07-05",
  },
  {
    id: "2",
    fundName: "Real Estate Fund IV",
    callNumber: "Distribution #3",
    callAmount: "$950,000",
    commitmentAmount: "$15,000,000",
    dueDate: "2024-07-10",
    noticeDate: "2024-06-15",
    investor: "Coastal Properties LLC",
    stage: "verification",
    description: "Quarterly income distribution from property portfolio",
    fundManager: "Blackstone",
    email: "distributions@blackstone.com",
    phone: "+1 (555) 234-5678",
    website: "blackstone.com",
    fundType: "Real Estate",
    vintage: "2023",
    totalFundSize: "$750M",
    remainingCommitment: "$10,200,000",
    previousCalls: "$3,000,000",
    purpose: "Quarterly rental income",
    distributionType: "Income",
    distributionAmount: "$950,000",
    expectedDate: "2024-07-10",
  },
  {
    id: "3",
    fundName: "Tech Ventures II",
    callNumber: "Distribution #1",
    callAmount: "$750,000",
    commitmentAmount: "$5,000,000",
    dueDate: "2024-07-15",
    noticeDate: "2024-06-10",
    investor: "Smith Investments LLC",
    stage: "tax-review",
    description: "First distribution from early portfolio company exit",
    fundManager: "Andreessen Horowitz",
    email: "distributions@a16z.com",
    phone: "+1 (555) 345-6789",
    website: "a16z.com",
    fundType: "Venture Capital",
    vintage: "2024",
    totalFundSize: "$300M",
    remainingCommitment: "$3,750,000",
    previousCalls: "$0",
    purpose: "Exit of AI startup investment",
    distributionType: "Return of Capital + Gain",
    distributionAmount: "$750,000",
    expectedDate: "2024-07-15",
  },
  {
    id: "4",
    fundName: "Infrastructure Fund I",
    callNumber: "Distribution #2",
    callAmount: "$1,200,000",
    commitmentAmount: "$10,000,000",
    dueDate: "2024-06-30",
    noticeDate: "2024-06-05",
    investor: "Johnson Holdings LLC",
    stage: "payment-pending",
    description: "Semi-annual income distribution from infrastructure assets",
    fundManager: "KKR",
    email: "distributions@kkr.com",
    phone: "+1 (555) 456-7890",
    website: "kkr.com",
    fundType: "Infrastructure",
    vintage: "2022",
    totalFundSize: "$1.2B",
    remainingCommitment: "$4,000,000",
    previousCalls: "$4,000,000",
    purpose: "Operating income from toll road assets",
    distributionType: "Income",
    distributionAmount: "$1,200,000",
    expectedDate: "2024-06-30",
  },
  {
    id: "5",
    fundName: "Credit Opportunities Fund II",
    callNumber: "Distribution #4",
    callAmount: "$850,000",
    commitmentAmount: "$7,500,000",
    dueDate: "2024-06-28",
    noticeDate: "2024-06-01",
    investor: "Johnson Family Trust",
    stage: "payment-received",
    description: "Quarterly interest distribution from debt portfolio",
    fundManager: "Apollo",
    email: "distributions@apollo.com",
    phone: "+1 (555) 567-8901",
    website: "apollo.com",
    fundType: "Private Credit",
    vintage: "2023",
    totalFundSize: "$800M",
    remainingCommitment: "$4,500,000",
    previousCalls: "$1,500,000",
    purpose: "Quarterly interest income",
    distributionType: "Income",
    distributionAmount: "$850,000",
    expectedDate: "2024-06-28",
  },
  {
    id: "6",
    fundName: "Sustainable Energy Fund",
    callNumber: "Distribution #1",
    callAmount: "$600,000",
    commitmentAmount: "$8,000,000",
    dueDate: "2024-06-20",
    noticeDate: "2024-05-20",
    investor: "Smith Investments LLC",
    stage: "booked",
    description: "First distribution from solar project operations",
    fundManager: "Generation Investment Management",
    email: "distributions@generationim.com",
    phone: "+1 (555) 678-9012",
    website: "generationim.com",
    fundType: "Impact Investing",
    vintage: "2024",
    totalFundSize: "$400M",
    remainingCommitment: "$6,000,000",
    previousCalls: "$0",
    purpose: "Operating income from solar projects",
    distributionType: "Income",
    distributionAmount: "$600,000",
    expectedDate: "2024-06-20",
  },
]

export default function DistributionsTrackingPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Distributions Tracking",
    description: "Track incoming distributions from investments through receipt and booking",
    objectType: "investment",
    attributes: [
      { id: "fundName", name: "Fund", type: "text" },
      { id: "distributionType", name: "Type", type: "text" },
      { id: "distributionAmount", name: "Amount", type: "currency" },
      { id: "expectedDate", name: "Expected Date", type: "date" },
      { id: "investor", name: "Investor", type: "text" },
      { id: "purpose", name: "Source", type: "text" },
    ],
    stages: [
      { id: "notice-received", name: "Notice Received", color: "bg-gray-100" },
      { id: "verification", name: "Verification", color: "bg-blue-100" },
      { id: "tax-review", name: "Tax Review", color: "bg-yellow-100" },
      { id: "payment-pending", name: "Payment Pending", color: "bg-purple-100" },
      { id: "payment-received", name: "Payment Received", color: "bg-orange-100" },
      { id: "booked", name: "Booked", color: "bg-green-100" },
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
                  <BreadcrumbPage>Distributions Tracking</BreadcrumbPage>
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
                    <h1 className="text-2xl font-semibold">Distributions Tracking</h1>
                    <p className="text-muted-foreground">Track incoming distributions from investments through receipt and booking</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Distributions Tracking"
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