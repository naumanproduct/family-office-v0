"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { WorkflowHeader } from "@/components/workflows/workflow-header"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { DealPipelineKanban } from "@/components/deal-pipeline-kanban"

// Sample data for Diligence Process
const initialDeals = [
  {
    id: "1",
    companyName: "TechFlow Solutions",
    sector: "SaaS",
    fundingRound: "Series A",
    targetRaise: "$5M",
    owner: "Sarah Chen",
    stage: "initial-screening",
    description: "AI-powered workflow automation platform for enterprise clients",
    location: "San Francisco, CA",
    website: "techflow.com",
    phone: "+1 (555) 123-4567",
    email: "contact@techflow.com",
    lastContact: "2024-06-15",
    nextMeeting: "2024-06-22",
    valuation: "$20M",
    revenue: "$2M ARR",
    employees: "45",
    opportunityName: "TechFlow Series A",
    investmentSize: "$5,000,000",
    dueDate: "2024-07-15",
    assignedTo: "Sarah Chen",
  },
  {
    id: "2",
    companyName: "GreenEnergy Corp",
    sector: "CleanTech",
    fundingRound: "Seed",
    targetRaise: "$2M",
    owner: "Michael Rodriguez",
    stage: "financial-review",
    description: "Solar panel efficiency optimization using machine learning",
    location: "Austin, TX",
    website: "greenenergy.com",
    phone: "+1 (555) 234-5678",
    email: "info@greenenergy.com",
    lastContact: "2024-06-18",
    nextMeeting: "2024-06-25",
    valuation: "$8M",
    revenue: "$500K ARR",
    employees: "12",
    opportunityName: "GreenEnergy Seed Round",
    investmentSize: "$2,000,000",
    dueDate: "2024-07-10",
    assignedTo: "Michael Rodriguez",
  },
  {
    id: "3",
    companyName: "HealthTech Innovations",
    sector: "HealthTech",
    fundingRound: "Series B",
    targetRaise: "$15M",
    owner: "Lisa Wang",
    stage: "legal-review",
    description: "Telemedicine platform with AI-powered diagnostics",
    location: "Boston, MA",
    website: "healthtech.com",
    phone: "+1 (555) 345-6789",
    email: "hello@healthtech.com",
    lastContact: "2024-06-20",
    nextMeeting: "2024-06-28",
    valuation: "$60M",
    revenue: "$8M ARR",
    employees: "120",
    opportunityName: "HealthTech Series B",
    investmentSize: "$15,000,000",
    dueDate: "2024-07-20",
    assignedTo: "Lisa Wang",
  },
  {
    id: "4",
    companyName: "FinanceAI",
    sector: "FinTech",
    fundingRound: "Series A",
    targetRaise: "$8M",
    owner: "James Wilson",
    stage: "market-analysis",
    description: "AI-powered personal finance management and investment advice",
    location: "New York, NY",
    website: "financeai.com",
    phone: "+1 (555) 456-7890",
    email: "team@financeai.com",
    lastContact: "2024-06-22",
    nextMeeting: "2024-06-30",
    valuation: "$35M",
    revenue: "$3.5M ARR",
    employees: "65",
    opportunityName: "FinanceAI Series A",
    investmentSize: "$8,000,000",
    dueDate: "2024-07-25",
    assignedTo: "James Wilson",
  },
  {
    id: "5",
    companyName: "LogisticsPlus",
    sector: "Supply Chain",
    fundingRound: "Series B",
    targetRaise: "$12M",
    owner: "Sarah Chen",
    stage: "management-review",
    description: "AI-powered logistics optimization platform for global supply chains",
    location: "Chicago, IL",
    website: "logisticsplus.com",
    phone: "+1 (555) 567-8901",
    email: "info@logisticsplus.com",
    lastContact: "2024-06-24",
    nextMeeting: "2024-07-02",
    valuation: "$45M",
    revenue: "$6M ARR",
    employees: "85",
    opportunityName: "LogisticsPlus Series B",
    investmentSize: "$12,000,000",
    dueDate: "2024-07-30",
    assignedTo: "Sarah Chen",
  },
  {
    id: "6",
    companyName: "EdTech Pioneers",
    sector: "Education",
    fundingRound: "Series A",
    targetRaise: "$7M",
    owner: "Michael Rodriguez",
    stage: "investment-committee",
    description: "Personalized learning platform with adaptive curriculum",
    location: "Seattle, WA",
    website: "edtechpioneers.com",
    phone: "+1 (555) 678-9012",
    email: "hello@edtechpioneers.com",
    lastContact: "2024-06-25",
    nextMeeting: "2024-07-05",
    valuation: "$25M",
    revenue: "$2.2M ARR",
    employees: "40",
    opportunityName: "EdTech Pioneers Series A",
    investmentSize: "$7,000,000",
    dueDate: "2024-07-05",
    assignedTo: "Michael Rodriguez",
  },
]

export default function DiligenceProcessPage() {
  const [workflowConfig, setWorkflowConfig] = React.useState({
    name: "Diligence Process",
    description: "Repeatable checklist to track what's been reviewed for each potential investment",
    objectType: "opportunity",
    attributes: [
      { id: "opportunityName", name: "Opportunity", type: "text" },
      { id: "companyName", name: "Company", type: "text" },
      { id: "investmentSize", name: "Investment Size", type: "currency" },
      { id: "sector", name: "Sector", type: "text" },
      { id: "dueDate", name: "Due Date", type: "date" },
      { id: "assignedTo", name: "Lead Analyst", type: "user" },
    ],
    stages: [
      { id: "initial-screening", name: "Initial Screening", color: "bg-gray-100" },
      { id: "financial-review", name: "Financial Review", color: "bg-blue-100" },
      { id: "legal-review", name: "Legal Review", color: "bg-yellow-100" },
      { id: "market-analysis", name: "Market Analysis", color: "bg-purple-100" },
      { id: "management-review", name: "Management Review", color: "bg-orange-100" },
      { id: "investment-committee", name: "Investment Committee", color: "bg-green-100" },
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
                  <BreadcrumbPage>Diligence Process</BreadcrumbPage>
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
                    <h1 className="text-2xl font-semibold">Diligence Process</h1>
                    <p className="text-muted-foreground">Repeatable checklist to track what's been reviewed for each potential investment</p>
                  </div>
                  <WorkflowHeader
                    workflowName="Diligence Process"
                    workflowConfig={workflowConfig}
                    onSave={handleSaveWorkflow}
                  />
                </div>
                <DealPipelineKanban 
                  workflowConfig={workflowConfig} 
                  initialDeals={initialDeals}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
