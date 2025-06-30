"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  ExternalLinkIcon,
  FilterIcon,
  MoreVerticalIcon,
  PlusIcon,
  SearchIcon,
  SortAscIcon,
  SortDescIcon,
  BarChartIcon,
  DollarSignIcon,
  LayoutIcon,
  TrendingUpIcon,
} from "lucide-react"
import { z } from "zod"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"


import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuDraggableItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MailIcon, BuildingIcon, FileTextIcon,
  FileIcon, UsersIcon, ClockIcon, MessageSquareIcon, FolderIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

// Import the AddCompanyDialog at the top of the file
import { AddCompanyDialog } from "./add-company-dialog"
import { MasterDrawer } from "./master-drawer"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { MasterDetailsPanel } from "@/components/shared/master-details-panel"
import { UnifiedDetailsPanel, type DetailSection } from "@/components/shared/unified-details-panel"
import { UnifiedActivitySection, ActivityItem } from "@/components/shared/unified-activity-section"
import { generateCompanyActivities } from "@/components/shared/activity-generators"

export const companySchema = z.object({
  id: z.number(),
  name: z.string(),
  categories: z.array(z.string()),
  industry: z.string(),
  stage: z.string(),
  employees: z.string(),
  revenue: z.string(),
  funding: z.string(),
  lastInteraction: z.string(),
  connectionStrength: z.string(),
  website: z.string(),
  linkedin: z.string(),
  twitter: z.string(),
  twitterFollowers: z.number(),
  location: z.string(),
  description: z.string(),
  estimatedArr: z.string(),
  fundingRaised: z.string(),
  investmentScore: z.string(),
  status: z.string(),
  type: z.string().optional(),
  internalOwner: z.string().optional(),
  associatedPeople: z.array(z.string()).optional(),
  associatedEntities: z.array(z.string()).optional(),
  introducedBy: z.string().optional(),
  associatedInvestments: z.array(z.string()).optional(),
  currentOpportunities: z.array(z.string()).optional(),
  workflows: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      stage: z.string(),
      stageColor: z.string(),
      targetRaise: z.string().optional(),
      fundingRound: z.string().optional(),
      nextMeeting: z.string().optional(),
      dueDate: z.string().optional(),
      assignee: z.string().optional(),
    }),
  ),
})

type Company = z.infer<typeof companySchema>

export const companiesData: Company[] = [
  {
    id: 1,
    name: "Blackstone",
    categories: ["Private Equity", "Alternative Assets"],
    industry: "Private Equity",
    stage: "Established",
    employees: "1000-5000",
    revenue: "$1B+",
    funding: "Public",
    lastInteraction: "2 days ago",
    connectionStrength: "Very strong",
    website: "blackstone.com",
    linkedin: "blackstone",
    twitter: "@blackstone",
    twitterFollowers: 124289,
    location: "New York, NY",
    description: "Global leader in alternative investments with $1 trillion in AUM...",
    estimatedArr: "$1B+",
    fundingRaised: "N/A",
    investmentScore: "A+",
    status: "Active",
    type: "GP",
    internalOwner: "John Smith",
    associatedPeople: ["Stephen Schwarzman", "Jonathan Gray", "Joseph Baratta"],
    associatedEntities: ["Blackstone Real Estate Fund IX", "Blackstone Growth", "Blackstone Credit"],
    introducedBy: "Direct Relationship",
    associatedInvestments: ["BX Real Estate Fund IX", "BX Growth Equity Fund II", "BX Tactical Opportunities"],
    currentOpportunities: ["Co-investment in European Logistics", "Secondary Transaction"],
    workflows: [
      {
        id: "capital-1",
        name: "Capital Call Processing",
        stage: "Documents Received",
        stageColor: "bg-blue-100",
        dueDate: "2024-07-15",
        assignee: "Sarah Chen",
      },
    ],
  },
  {
    id: 2,
    name: "Citadel",
    categories: ["Hedge Fund", "Market Making"],
    industry: "Hedge Fund",
    stage: "Established",
    employees: "1000-5000",
    revenue: "$10B+",
    funding: "Private",
    lastInteraction: "1 week ago",
    connectionStrength: "Strong",
    website: "citadel.com",
    linkedin: "citadel-llc",
    twitter: "@citadel",
    twitterFollowers: 54667,
    location: "Chicago, IL",
    description: "Leading global hedge fund and market maker with $50B+ AUM...",
    estimatedArr: "$10B+",
    fundingRaised: "N/A",
    investmentScore: "A+",
    status: "Active",
    type: "Co-Investor",
    internalOwner: "Emily Johnson",
    associatedPeople: ["Ken Griffin", "Peng Zhao", "Gerald Beeson"],
    associatedEntities: ["Citadel Securities", "Citadel Wellington", "Citadel Kensington"],
    introducedBy: "Industry Network",
    associatedInvestments: ["Tech Growth Co-investment", "Healthcare Opportunities Fund"],
    currentOpportunities: ["Joint Venture in Asia", "Co-investment in FinTech"],
    workflows: [],
  },
  {
    id: 3,
    name: "JPMorgan Chase",
    categories: ["Investment Banking", "Private Banking"],
    industry: "Financial Services",
    stage: "Public",
    employees: "100,000+",
    revenue: "$100B+",
    funding: "Public",
    lastInteraction: "3 days ago",
    connectionStrength: "Very strong",
    website: "jpmorganchase.com",
    linkedin: "jpmorgan-chase",
    twitter: "@jpmorgan",
    twitterFollowers: 946065,
    location: "New York, NY",
    description: "Leading global financial services firm...",
    estimatedArr: "$100B+",
    fundingRaised: "N/A",
    investmentScore: "A+",
    status: "Active",
    type: "Vendor",
    internalOwner: "Robert Chen",
    associatedPeople: ["Jamie Dimon", "Mary Erdoes", "Marc Badrichani"],
    associatedEntities: ["JP Morgan Private Bank", "JP Morgan Securities"],
    introducedBy: "Direct Relationship",
    associatedInvestments: [],
    currentOpportunities: ["Private Credit Facility", "M&A Advisory"],
    workflows: [],
  },
  {
    id: 4,
    name: "DataRobot",
    categories: ["AI/ML", "Enterprise Software"],
    industry: "Software",
    stage: "Late Stage",
    employees: "500-1000",
    revenue: "$100M-$500M",
    funding: "Series G",
    lastInteraction: "5 days ago",
    connectionStrength: "Strong",
    website: "datarobot.com",
    linkedin: "datarobot",
    twitter: "@datarobot",
    twitterFollowers: 20787,
    location: "Boston, MA",
    description: "AI platform for enterprise machine learning...",
    estimatedArr: "$100M-$250M",
    fundingRaised: "$750,000,000",
    investmentScore: "A-",
    status: "Active",
    type: "Portfolio Company",
    internalOwner: "Sarah Wilson",
    associatedPeople: ["Debanjan Saha", "Jeremy Achin"],
    associatedEntities: ["DataRobot Holdings"],
    introducedBy: "Tiger Global",
    associatedInvestments: ["Series F - Lead", "Series G - Follow-on"],
    currentOpportunities: ["Bridge Round", "Strategic Exit"],
    workflows: [
      {
        id: "monitoring-1",
        name: "Quarterly Monitoring",
        stage: "In Progress",
        stageColor: "bg-yellow-100",
        dueDate: "2024-07-30",
        assignee: "Mike Chen",
      },
    ],
  },
  {
    id: 5,
    name: "KKR",
    categories: ["Private Equity", "Credit", "Infrastructure"],
    industry: "Private Equity",
    stage: "Public",
    employees: "1000-5000",
    revenue: "$1B+",
    funding: "Public",
    lastInteraction: "2 weeks ago",
    connectionStrength: "Strong",
    website: "kkr.com",
    linkedin: "kkr",
    twitter: "@kkr",
    twitterFollowers: 156789,
    location: "New York, NY",
    description: "Global investment firm managing multiple alternative asset classes...",
    estimatedArr: "$1B+",
    fundingRaised: "N/A",
    investmentScore: "A+",
    status: "Active",
    type: "GP",
    internalOwner: "John Smith",
    associatedPeople: ["Henry Kravis", "Scott Nuttall", "Joseph Bae"],
    associatedEntities: ["KKR Americas Fund XII", "KKR Infrastructure Fund"],
    introducedBy: "Industry Network",
    associatedInvestments: ["Americas Fund XII", "Asia Fund IV", "Infrastructure Fund III"],
    currentOpportunities: ["European Buyout Co-investment", "Credit Opportunities"],
    workflows: [],
  },
  {
    id: 6,
    name: "Cooley LLP",
    categories: ["Legal Services", "Professional Services"],
    industry: "Legal",
    stage: "Established",
    employees: "1000-5000",
    revenue: "$1B+",
    funding: "Private",
    lastInteraction: "5 days ago",
    connectionStrength: "Very strong",
    website: "cooley.com",
    linkedin: "cooley-llp",
    twitter: "@cooleyLLP",
    twitterFollowers: 89234,
    location: "Palo Alto, CA",
    description: "Leading law firm for technology companies and venture capital...",
    estimatedArr: "$1B+",
    fundingRaised: "N/A",
    investmentScore: "N/A",
    status: "Active",
    type: "Vendor",
    internalOwner: "Emily Johnson",
    associatedPeople: ["Joe Conroy", "Craig Jacoby", "Eric Jensen"],
    associatedEntities: ["Cooley LLP"],
    introducedBy: "Direct Referral",
    associatedInvestments: [],
    currentOpportunities: ["Fund Formation", "M&A Advisory"],
    workflows: [],
  },
  {
    id: 7,
    name: "Airbnb",
    categories: ["Travel", "Marketplace", "Consumer"],
    industry: "Technology",
    stage: "Public",
    employees: "5000-10000",
    revenue: "$5B+",
    funding: "Public",
    lastInteraction: "3 weeks ago",
    connectionStrength: "Medium",
    website: "airbnb.com",
    linkedin: "airbnb",
    twitter: "@airbnb",
    twitterFollowers: 5234567,
    location: "San Francisco, CA",
    description: "Global travel marketplace and hospitality service...",
    estimatedArr: "$5B+",
    fundingRaised: "N/A",
    investmentScore: "A",
    status: "Active",
    type: "Portfolio Company",
    internalOwner: "Robert Chen",
    associatedPeople: ["Brian Chesky", "Nathan Blecharczyk", "Joe Gebbia"],
    associatedEntities: ["Airbnb Inc."],
    introducedBy: "Sequoia Capital",
    associatedInvestments: ["Series B - Early Investment", "IPO Allocation"],
    currentOpportunities: [],
    workflows: [],
  },
  {
    id: 8,
    name: "PwC",
    categories: ["Accounting", "Tax", "Professional Services"],
    industry: "Professional Services",
    stage: "Established",
    employees: "100,000+",
    revenue: "$50B+",
    funding: "Private",
    lastInteraction: "1 week ago",
    connectionStrength: "Strong",
    website: "pwc.com",
    linkedin: "pwc",
    twitter: "@pwc",
    twitterFollowers: 445678,
    location: "New York, NY",
    description: "Global professional services network - audit, tax, and advisory...",
    estimatedArr: "$50B+",
    fundingRaised: "N/A",
    investmentScore: "N/A",
    status: "Active",
    type: "Vendor",
    internalOwner: "Sarah Wilson",
    associatedPeople: ["Tim Ryan", "Carol Sawdye", "Mohamed Kande"],
    associatedEntities: ["PwC US", "PwC Private Company Services"],
    introducedBy: "Direct Relationship",
    associatedInvestments: [],
    currentOpportunities: ["Tax Planning", "Fund Audit Services"],
    workflows: [
      {
        id: "audit-1",
        name: "Annual Audit",
        stage: "Planning",
        stageColor: "bg-blue-100",
        dueDate: "2024-12-31",
        assignee: "Finance Team",
      },
    ],
  },
  {
    id: 9,
    name: "Apollo Global Management",
    categories: ["Private Equity", "Credit"],
    industry: "Private Equity",
    stage: "Public",
    employees: "1000-5000",
    revenue: "$500M-$1B",
    funding: "Public",
    lastInteraction: "1 month ago",
    connectionStrength: "Medium",
    website: "apollo.com",
    linkedin: "apollo-global-management",
    twitter: "@apolloglobal",
    twitterFollowers: 23456,
    location: "New York, NY",
    description: "Leading global alternative investment manager...",
    estimatedArr: "$500M-$1B",
    fundingRaised: "N/A",
    investmentScore: "A",
    status: "Active",
    type: "GP",
    internalOwner: "John Smith",
    associatedPeople: ["Marc Rowan", "Scott Kleinman"],
    associatedEntities: ["Apollo Fund IX", "Apollo Credit Fund"],
    introducedBy: "LP Annual Meeting",
    associatedInvestments: ["Apollo Fund IX", "Strategic Credit Opportunities"],
    currentOpportunities: ["New Credit Fund", "Real Estate Co-investment"],
    workflows: [],
  },
  {
    id: 10,
    name: "Goldman Sachs",
    categories: ["Investment Banking", "Asset Management"],
    industry: "Financial Services",
    stage: "Public",
    employees: "10000+",
    revenue: "$50B+",
    funding: "Public",
    lastInteraction: "2 weeks ago",
    connectionStrength: "Strong",
    website: "goldmansachs.com",
    linkedin: "goldman-sachs",
    twitter: "@goldmansachs",
    twitterFollowers: 876543,
    location: "New York, NY",
    description: "Leading global investment banking and financial services company...",
    estimatedArr: "$50B+",
    fundingRaised: "N/A",
    investmentScore: "A+",
    status: "Active",
    type: "Vendor",
    internalOwner: "Robert Chen",
    associatedPeople: ["David Solomon", "John Waldron"],
    associatedEntities: ["Goldman Sachs Private Wealth", "GS Asset Management"],
    introducedBy: "Direct Relationship",
    associatedInvestments: [],
    currentOpportunities: ["Structured Products", "Private Banking Services"],
    workflows: [],
  },
  {
    id: 11,
    name: "SpaceX",
    categories: ["Aerospace", "Technology"],
    industry: "Aerospace",
    stage: "Late Stage",
    employees: "10000+",
    revenue: "$2B+",
    funding: "Series N",
    lastInteraction: "3 weeks ago",
    connectionStrength: "Medium",
    website: "spacex.com",
    linkedin: "spacex",
    twitter: "@spacex",
    twitterFollowers: 32100000,
    location: "Hawthorne, CA",
    description: "Revolutionary space exploration and satellite technology company...",
    estimatedArr: "$2B+",
    fundingRaised: "$10,000,000,000",
    investmentScore: "A+",
    status: "Active",
    type: "Portfolio Company",
    internalOwner: "Emily Johnson",
    associatedPeople: ["Elon Musk", "Gwynne Shotwell"],
    associatedEntities: ["SpaceX Holdings"],
    introducedBy: "Founders Fund",
    associatedInvestments: ["Series J - Secondary", "Series N - Primary"],
    currentOpportunities: ["Starlink Spin-off", "Next Funding Round"],
    workflows: [],
  },
]

const getConnectionStrengthColor = (strength: string) => {
  switch (strength) {
    case "Very strong":
      return "bg-green-100 text-green-800"
    case "Strong":
      return "bg-blue-100 text-blue-800"
    case "Medium":
      return "bg-yellow-100 text-yellow-800"
    case "Weak":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "Prospect":
      return "bg-blue-100 text-blue-800"
    case "Partner":
      return "bg-purple-100 text-purple-800"
    case "Inactive":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

function CompanyNameCell({ company }: { company: Company }) {
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "notes", label: "Notes", count: 1, icon: FileIcon },
    { id: "files", label: "Files", count: 1, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 3, icon: ClockIcon },
    { id: "emails", label: "Emails", count: 2, icon: MailIcon },
    { id: "meetings", label: "Meetings", count: 1, icon: UsersIcon },
    { id: "team", label: "Team", count: 1, icon: UsersIcon },
    { id: "company", label: "Company", count: null, icon: BuildingIcon },
  ]

  const renderTabContent = (
    activeTab: string,
    viewMode: "card" | "list" | "table",
    setSelectedTask?: (task: any) => void,
    setSelectedNote?: (note: any) => void,
    setSelectedMeeting?: (meeting: any) => void,
    setSelectedEmail?: (email: any) => void,
  ) => {
    // For other tabs, use TabContentRenderer instead of custom implementations
    const data = getCompanyTabData(activeTab, company)

    // Create custom tab renderers for special tabs
    const customTabRenderers = {
      details: (isFullScreen = false) => <CompanyDetailsPanel company={company} isFullScreen={isFullScreen} />,
      company: (isFullScreen = false) => <CompanyTabContent company={company} />,
    }

    // Create a handler for "add" actions for empty states
    const handleAdd = () => {
      console.log(`Add new ${activeTab.slice(0, -1)} for ${company.name}`)
      // In a real implementation, this would open the appropriate modal or form
    }

    return (
      <TabContentRenderer
        activeTab={activeTab}
        viewMode={viewMode}
        data={data}
        customTabRenderers={customTabRenderers}
        onTaskClick={setSelectedTask}
        onNoteClick={setSelectedNote}
        onMeetingClick={setSelectedMeeting}
        onEmailClick={setSelectedEmail}
        onAdd={handleAdd}
      />
    )
  }

  const renderDetailsPanel = (isFullScreen = false) => {
    return <CompanyDetailsPanel company={company} isFullScreen={isFullScreen} />
  }

  const customActions: React.ReactNode[] = []

  return (
    <MasterDrawer
      trigger={
        <Button variant="link" className="w-fit px-0 text-left text-foreground h-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-medium">
              {company.name.charAt(0)}
            </div>
            <span className="font-medium">{company.name}</span>
          </div>
        </Button>
      }
      title={company.name}
      recordType="Company"
      subtitle={`${company.industry} • ${company.stage}`}
      tabs={tabs}
      detailsPanel={renderDetailsPanel}
      customActions={customActions}
    >
      {renderTabContent}
    </MasterDrawer>
  )
}

function getCompanyTabData(activeTab: string, company: Company) {
  switch (activeTab) {
    case "emails":
      return [
        {
          id: 1,
          subject: "Partnership Opportunity",
          from: "partnerships@company.com",
          date: "2 hours ago",
          status: "Unread",
          preview: "Exploring potential partnership opportunities with " + company.name,
          type: "received",
        },
        {
          id: 2,
          subject: "Meeting Follow-up",
          from: "me@company.com",
          date: "1 day ago",
          status: "Sent",
          preview: "Thanks for the productive meeting about our collaboration with " + company.name,
          type: "sent",
        },
      ]
    case "tasks":
      return [
        {
          id: 1,
          title: "Review quarterly performance",
          priority: "High",
          status: "pending",
          assignee: "You",
          dueDate: "Tomorrow",
          description: "Review Q3 performance metrics and prepare summary report.",
        },
        {
          id: 2,
          title: "Update valuation model",
          priority: "Medium",
          status: "completed",
          assignee: "You",
          dueDate: "2 days ago",
          description: "Updated valuation model with latest market data.",
        },
        {
          id: 3,
          title: "Capital Call",
          priority: "High",
          status: "In Progress",
          assignee: "You",
          dueDate: "2024-01-15",
          description: "Process capital call for TechFlow Ventures Series C investment",
          subtasks: [
            {
              id: "CC-1",
              title: "Review Capital Call Notice PDF",
              description: "Open and understand key terms (amount, due date)",
              status: "Completed",
              priority: "High",
              assignee: "You",
              dueDate: "2024-01-10",
              subtasks: [],
            },
            {
              id: "CC-2",
              title: "Validate with Principal",
              description: "Confirm LP or internal commitment matches",
              status: "Completed",
              priority: "High",
              assignee: "You",
              dueDate: "2024-01-11",
              subtasks: [],
            },
            {
              id: "CC-3",
              title: "Record in System",
              description: "Log in accounting system or ledger",
              status: "In Progress",
              priority: "Medium",
              assignee: "You",
              dueDate: "2024-01-12",
              subtasks: [],
            },
            {
              id: "CC-4",
              title: "Notify Accountant",
              description: "Forward or tag accountant for payment setup",
              status: "To Do",
              priority: "Medium",
              assignee: "Sarah Johnson",
              dueDate: "2024-01-13",
              subtasks: [],
            },
            {
              id: "CC-5",
              title: "Confirm Wire Date",
              description: "Align on when funds will be sent",
              status: "To Do",
              priority: "High",
              assignee: "You",
              dueDate: "2024-01-14",
              subtasks: [],
            },
            {
              id: "CC-6",
              title: "Follow-Up if Not Funded",
              description: "If deadline passes, notify appropriate party",
              status: "To Do",
              priority: "Medium",
              assignee: "You",
              dueDate: "2024-01-16",
              subtasks: [],
            },
            {
              id: "CC-7",
              title: "Mark as Complete",
              description: "Close the call internally",
              status: "To Do",
              priority: "Low",
              assignee: "You",
              dueDate: "2024-01-17",
              subtasks: [],
            },
          ],
        },
      ]
    case "notes":
      return [
        {
          id: 1,
          title: "Investment thesis review",
          date: "3 days ago",
          author: "Sarah Johnson",
          topic: `Strong performance in ${company.industry} sector. Key growth drivers remain intact.`,
        },
      ]
    case "meetings":
      return [
        {
          id: 1,
          title: "Portfolio Review Meeting",
          date: "Tomorrow",
          time: "2:00 PM - 3:00 PM",
          status: "Confirmed",
          location: "Conference Room A",
          attendees: 5,
          description: `Quarterly review of ${company.name} performance.`,
        },
      ]
    case "files":
      return [
        {
          id: 1,
          name: "Investment_Agreement.pdf",
          size: "2.4 MB",
          uploadedBy: "Jessica Martinez",
          uploadedDate: "2 days ago",
          type: "pdf",
          description: "Original investment agreement and terms.",
        },
      ]
    case "team":
      return [
        {
          id: 1,
          name: "Sarah Johnson",
          role: "Investment Director",
          email: "sarah.johnson@company.com",
          phone: "+1 (555) 123-4567",
          department: "Investments",
          joinDate: "2023-01-15",
          status: "Active",
        },
      ]
    default:
      return []
  }
}

function CompanyTabContent({ company }: { company: Company }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground text-2xl font-bold">
              {company.name.charAt(0)}
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">{company.name}</CardTitle>
              <CardDescription className="mt-1">
                {company.industry} • {company.location}
              </CardDescription>
              <div className="mt-3 flex items-center gap-4">
                <span className="text-sm">{company.stage}</span>
                {company.status && (
                  <span className="text-sm">
                    {company.status}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">Est. {company.employees} employees</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Company Overview</h4>
            <p className="text-sm text-muted-foreground">{company.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Key Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Industry:</span>
                  <span>{company.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employees:</span>
                  <span>{company.employees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue:</span>
                  <span>{company.revenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Website:</span>
                  <span className="text-blue-600">{company.website}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Contact Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{company.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Twitter:</span>
                  <span className="text-blue-600">{company.twitter || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Connection:</span>
                  <span>{company.connectionStrength}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent activity section */}
          <div>
            <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>Last interaction:</span>
                <span className="text-muted-foreground">{company.lastInteraction}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Categories updated</span>
                <span className="text-muted-foreground">• 3 weeks ago</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CompanyActivityContent({ company }: { company: Company }) {
  const activities = generateCompanyActivities()

  return <UnifiedActivitySection activities={activities} />
}

function CompanyDetailsPanel({ company, isFullScreen = false }: { company: Company; isFullScreen?: boolean }) {
  // Mock data for related items
  const relatedData = {
    investments: [
      { id: 1, name: "Series C Investment", type: "Lead Investor" },
      { id: 2, name: "Strategic Partnership", type: "Co-investor" },
    ],
    people: [
      { id: 1, name: "Sarah Johnson", role: "CEO" },
      { id: 2, name: "Michael Chen", role: "CFO" },
      { id: 3, name: "David Williams", role: "Board Member" },
    ],
    entities: [
      { id: 1, name: "Meridian Capital Fund III", type: "Investment Fund" },
      { id: 2, name: "Tech Partners LLC", type: "Holding Company" },
    ],
    opportunities: [
      { id: 1, name: "Expansion Funding", status: "In Discussion" },
      { id: 2, name: "Strategic Partnership", status: "Initial Review" },
    ],
  };

  // Basic fields for main section
  const basicFields = [
    {
      label: "Company Name",
      value: company.name,
    },
    {
      label: "Industry",
      value: company.industry,
    },
    {
      label: "Stage",
      value: company.stage,
    },
    {
      label: "Website",
      value: company.website,
      isLink: true,
    },
    {
      label: "Location",
      value: company.location,
    },
    {
      label: "Revenue",
      value: company.revenue,
    },
    {
      label: "Employees",
      value: company.employees,
    },
  ];
  
  // Extended fields for comprehensive view
  const extendedFields = [
    ...basicFields,
    {
      label: "Description",
      value: company.description,
    },
    {
      label: "LinkedIn",
      value: company.linkedin,
      isLink: true,
    },
    {
      label: "Twitter",
      value: company.twitter,
      isLink: true,
    },
    {
      label: "Twitter Followers",
      value: formatNumber(company.twitterFollowers),
    },
    {
      label: "Estimated ARR",
      value: company.estimatedArr,
    },
    {
      label: "Funding Raised",
      value: company.fundingRaised,
    },
    {
      label: "Investment Score",
      value: company.investmentScore,
    },
    {
      label: "Last Interaction",
      value: company.lastInteraction,
    },
    {
      label: "Connection Strength",
      value: company.connectionStrength,
    },
    {
      label: "Status",
      value: company.status,
    },
  ];
  
  // Navigation handler for related records
  const navigateToRecord = (recordType: string, id: number) => {
    console.log(`Navigate to ${recordType} record with ID: ${id}`);
    // This would be implemented to navigate to the record
  };
  
  // Add record handler
  const handleAddRecord = (sectionId: string) => {
    console.log(`Add new ${sectionId} record for ${company.name}`);
    // This would open the appropriate creation dialog
  };
  
  // Unlink record handler
  const handleUnlinkRecord = (sectionId: string, id: number) => {
    console.log(`Unlink ${sectionId} record with ID ${id} from ${company.name}`);
    // This would handle removal of the relationship
  };

  // Define all sections for the details panel
  const sections: DetailSection[] = [
    {
      id: "Details",
      title: "Company Information",
      icon: <BuildingIcon className="h-4 w-4 text-muted-foreground" />,
      fields: isFullScreen || basicFields.length <= 7 ? extendedFields : basicFields,
    },
    {
      id: "Performance",
      title: "Performance Metrics",
      icon: <BarChartIcon className="h-4 w-4 text-muted-foreground" />,
      fields: [
        { label: "Revenue", value: company.revenue },
        { label: "Funding Raised", value: company.fundingRaised },
        { label: "Estimated ARR", value: company.estimatedArr },
        { label: "Investment Score", value: company.investmentScore },
      ],
      hideWhenEmpty: true,
    },
    {
      id: "People",
      title: "Key People",
      icon: <UsersIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.people
      },
    },
    {
      id: "Investments",
      title: "Investments",
      icon: <DollarSignIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.investments
      },
    },
    {
      id: "Entities",
      title: "Related Entities",
      icon: <LayoutIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.entities
      },
    },
    {
      id: "Opportunities",
      title: "Opportunities",
      icon: <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.opportunities
      },
    },
  ];

  return (
    <UnifiedDetailsPanel
      sections={sections}
      isFullScreen={isFullScreen}
      onNavigateToRecord={navigateToRecord}
      onAddRecord={handleAddRecord}
      onUnlinkRecord={handleUnlinkRecord}
      activityContent={<CompanyActivityContent company={company} />}
    />
  );
}

const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2">
        Company
        {column.getIsSorted() === "asc" ? (
          <SortAscIcon className="ml-2 h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <SortDescIcon className="ml-2 h-3 w-3" />
        ) : null}
      </Button>
    ),
    cell: ({ row }) => <CompanyNameCell company={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <span className="text-sm">{row.original.type || "-"}</span>,
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => <span className="text-sm">{row.original.industry}</span>,
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => <span className="text-sm">{row.original.stage}</span>,
  },
  {
    accessorKey: "associatedPeople",
    header: "Associated People",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.associatedPeople && row.original.associatedPeople.length > 0
          ? row.original.associatedPeople.slice(0, 2).join(", ")
          : "-"}
        {row.original.associatedPeople && row.original.associatedPeople.length > 2 && (
          <span className="text-muted-foreground"> +{row.original.associatedPeople.length - 2}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "associatedEntities",
    header: "Associated Entities",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.associatedEntities && row.original.associatedEntities.length > 0
          ? row.original.associatedEntities.slice(0, 2).join(", ")
          : "-"}
        {row.original.associatedEntities && row.original.associatedEntities.length > 2 && (
          <span className="text-muted-foreground"> +{row.original.associatedEntities.length - 2}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "associatedInvestments",
    header: "Associated Investments",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.associatedInvestments && row.original.associatedInvestments.length > 0
          ? row.original.associatedInvestments.slice(0, 2).join(", ")
          : "-"}
        {row.original.associatedInvestments && row.original.associatedInvestments.length > 2 && (
          <span className="text-muted-foreground"> +{row.original.associatedInvestments.length - 2}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "currentOpportunities",
    header: "Current Opportunities",
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.currentOpportunities && row.original.currentOpportunities.length > 0
          ? row.original.currentOpportunities.slice(0, 2).join(", ")
          : "-"}
        {row.original.currentOpportunities && row.original.currentOpportunities.length > 2 && (
          <span className="text-muted-foreground"> +{row.original.currentOpportunities.length - 2}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.revenue}</span>,
  },
  {
    accessorKey: "employees",
    header: "Employees",
    cell: ({ row }) => <span className="text-sm">{row.original.employees}</span>,
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => (
      <a
        href={`https://${row.original.website}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline"
      >
        {row.original.website}
      </a>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-sm">{row.original.location}</span>,
  },
  {
    accessorKey: "internalOwner",
    header: "Internal Owner",
    cell: ({ row }) => <span className="text-sm">{row.original.internalOwner || "-"}</span>,
  },
  {
    accessorKey: "introducedBy",
    header: "Introduced By",
    cell: ({ row }) => <span className="text-sm">{row.original.introducedBy || "-"}</span>,
  },
  {
    accessorKey: "lastInteraction",
    header: "Last Interaction",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.lastInteraction}</span>,
  },
  {
    accessorKey: "connectionStrength",
    header: "Connection",
    cell: ({ row }) => <span className="text-sm">{row.original.connectionStrength}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span className="text-sm">{row.original.status}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVerticalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem>Edit company</DropdownMenuItem>
          <DropdownMenuItem>Add to list</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function CompaniesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [addCompanyOpen, setAddCompanyOpen] = React.useState(false)
  const [columnOrder, setColumnOrder] = React.useState<string[]>([])
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))

  const table = useReactTable({
    data: companiesData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
  })

  // Initialize column order from table columns
  React.useEffect(() => {
    const allColumns = table.getAllColumns().map((column) => column.id)
    
    if (columnOrder.length === 0 && allColumns.length > 0) {
      setColumnOrder(allColumns)
    }
  }, [])

  // Handle drag end for column reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (active && over && active.id !== over.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over.id as string)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Add Company Dialog */}
      <AddCompanyDialog open={addCompanyOpen} onOpenChange={setAddCompanyOpen} />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filter
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuItem>Active companies</DropdownMenuItem>
              <DropdownMenuItem>Inactive companies</DropdownMenuItem>
              <DropdownMenuItem>Portfolio companies</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Upcoming meetings</DropdownMenuItem>
              <DropdownMenuItem>Missing documents</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon className="mr-2 h-4 w-4" />
                Columns
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={columnOrder} strategy={verticalListSortingStrategy}>
                  {columnOrder.map((columnId) => {
                    const column = table.getColumn(columnId);
                    if (!column) return null;
                    
                    return (
                      <DropdownMenuDraggableItem
                        key={columnId}
                        id={columnId}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(checked) => column.toggleVisibility(checked)}
                      >
                        {columnId}
                      </DropdownMenuDraggableItem>
                    );
                  })}
                </SortableContext>
              </DndContext>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" onClick={() => setAddCompanyOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-10">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group h-12 cursor-pointer hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredRowModel().rows.length} company(ies) total.
      </div>
    </div>
  )
}
