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
  getPaginationRowModel,
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
} from "lucide-react"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MailIcon, BuildingIcon, FileTextIcon, UsersIcon, ClockIcon, MessageSquareIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

// Import the AddCompanyDialog at the top of the file
import { AddCompanyDialog } from "./add-company-dialog"
import { MasterDrawer } from "./master-drawer"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { MasterDetailsPanel } from "@/components/shared/master-details-panel"

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
    name: "Craft Ventures",
    categories: ["B2B", "Enterprise", "Information Technology"],
    industry: "Venture Capital",
    stage: "Growth",
    employees: "50-100",
    revenue: "$10M-$50M",
    funding: "Series C",
    lastInteraction: "2 days ago",
    connectionStrength: "Very strong",
    website: "craft.co",
    linkedin: "craft-ventures",
    twitter: "@craftventures",
    twitterFollowers: 24289,
    location: "San Francisco, CA",
    description: "Craft is a tech startup focused on building tools for modern teams...",
    estimatedArr: "$10M-$50M",
    fundingRaised: "$20,200,000.00",
    investmentScore: "A+",
    status: "Active",
    workflows: [
      {
        id: "deal-1",
        name: "Deal Pipeline",
        stage: "Work in Progress",
        stageColor: "bg-yellow-100",
        targetRaise: "$5M",
        fundingRound: "Series C",
        nextMeeting: "2024-06-15",
      },
      {
        id: "tax-1",
        name: "Tax Document Collection",
        stage: "Documents Requested",
        stageColor: "bg-blue-100",
        dueDate: "2024-07-30",
        assignee: "Sarah Chen",
      },
    ],
  },
  {
    id: 2,
    name: "FalconX",
    categories: ["B2B", "Enterprise", "Financial Services"],
    industry: "Cryptocurrency",
    stage: "Late Stage",
    employees: "200-500",
    revenue: "$50M-$100M",
    funding: "Series D",
    lastInteraction: "1 week ago",
    connectionStrength: "Strong",
    website: "falconx.io",
    linkedin: "falconx",
    twitter: "@falconx_io",
    twitterFollowers: 4667,
    location: "San Mateo, CA",
    description: "FalconX is a leading institutional digital asset platform...",
    estimatedArr: "$50M-$100M",
    fundingRaised: "$477,000,000.00",
    investmentScore: "A",
    status: "Active",
    workflows: [
      {
        id: "deal-2",
        name: "Deal Pipeline",
        stage: "Term Sheet",
        stageColor: "bg-purple-100",
        targetRaise: "$15M",
        fundingRound: "Series D",
        nextMeeting: "2024-06-10",
      },
    ],
  },
  {
    id: 3,
    name: "Google",
    categories: ["B2C", "Enterprise", "Information Technology"],
    industry: "Technology",
    stage: "Public",
    employees: "100,000+",
    revenue: "$100B+",
    funding: "Public",
    lastInteraction: "3 days ago",
    connectionStrength: "Very strong",
    website: "google.com",
    linkedin: "google",
    twitter: "@google",
    twitterFollowers: 28946065,
    location: "Mountain View, CA",
    description: "Google specializes in Internet-related services and products...",
    estimatedArr: "$100B+",
    fundingRaised: "N/A",
    investmentScore: "A+",
    status: "Partner",
    workflows: [],
  },
  {
    id: 4,
    name: "Amplitude",
    categories: ["B2B", "SaaS", "Analytics"],
    industry: "Software",
    stage: "Public",
    employees: "500-1000",
    revenue: "$100M-$500M",
    funding: "Public",
    lastInteraction: "1 month ago",
    connectionStrength: "Medium",
    website: "amplitude.com",
    linkedin: "amplitude-analytics",
    twitter: "@amplitude_hq",
    twitterFollowers: 20787,
    location: "San Francisco, CA",
    description: "Amplitude is a digital analytics platform...",
    estimatedArr: "$100M-$250M",
    fundingRaised: "N/A",
    investmentScore: "B+",
    status: "Prospect",
    workflows: [],
  },
  {
    id: 5,
    name: "Stripe",
    categories: ["B2B", "FinTech", "Payments"],
    industry: "Financial Services",
    stage: "Late Stage",
    employees: "1000-5000",
    revenue: "$1B+",
    funding: "Series H",
    lastInteraction: "2 weeks ago",
    connectionStrength: "Strong",
    website: "stripe.com",
    linkedin: "stripe",
    twitter: "@stripe",
    twitterFollowers: 156789,
    location: "San Francisco, CA",
    description: "Stripe is a technology company that builds economic infrastructure...",
    estimatedArr: "$1B+",
    fundingRaised: "$2,200,000,000.00",
    investmentScore: "A+",
    status: "Active",
    workflows: [],
  },
  {
    id: 6,
    name: "Notion",
    categories: ["B2B", "Productivity", "SaaS"],
    industry: "Software",
    stage: "Growth",
    employees: "200-500",
    revenue: "$50M-$100M",
    funding: "Series C",
    lastInteraction: "5 days ago",
    connectionStrength: "Very strong",
    website: "notion.so",
    linkedin: "notion-hq",
    twitter: "@notionhq",
    twitterFollowers: 89234,
    location: "San Francisco, CA",
    description: "Notion is an all-in-one workspace for notes, tasks, wikis, and databases...",
    estimatedArr: "$50M-$100M",
    fundingRaised: "$343,000,000.00",
    investmentScore: "A",
    status: "Active",
    workflows: [],
  },
  {
    id: 7,
    name: "Figma",
    categories: ["B2B", "Design", "SaaS"],
    industry: "Software",
    stage: "Acquired",
    employees: "500-1000",
    revenue: "$100M-$500M",
    funding: "Acquired",
    lastInteraction: "3 weeks ago",
    connectionStrength: "Medium",
    website: "figma.com",
    linkedin: "figma",
    twitter: "@figma",
    twitterFollowers: 234567,
    location: "San Francisco, CA",
    description: "Figma is a collaborative interface design tool...",
    estimatedArr: "$200M-$400M",
    fundingRaised: "$333,000,000.00",
    investmentScore: "A+",
    status: "Inactive",
    workflows: [],
  },
  {
    id: 8,
    name: "Airtable",
    categories: ["B2B", "Database", "No-Code"],
    industry: "Software",
    stage: "Growth",
    employees: "500-1000",
    revenue: "$100M-$200M",
    funding: "Series F",
    lastInteraction: "1 week ago",
    connectionStrength: "Strong",
    website: "airtable.com",
    linkedin: "airtable",
    twitter: "@airtable",
    twitterFollowers: 45678,
    location: "San Francisco, CA",
    description: "Airtable is a cloud collaboration service...",
    estimatedArr: "$100M-$200M",
    fundingRaised: "$735,000,000.00",
    investmentScore: "A-",
    status: "Active",
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
    { id: "tasks", label: "Tasks", count: 3, icon: ClockIcon },
    { id: "notes", label: "Notes", count: 1, icon: MessageSquareIcon },
    { id: "meetings", label: "Meetings", count: 1, icon: UsersIcon },
    { id: "emails", label: "Emails", count: 2, icon: MailIcon },
    { id: "files", label: "Files", count: 1, icon: FileTextIcon },
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
          content: `Strong performance in ${company.industry} sector. Key growth drivers remain intact.`,
          tags: ["Investment", "Review"],
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
          uploadedBy: "Legal Team",
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
          role: "Portfolio Manager",
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
                <Badge variant="outline">{company.stage}</Badge>
                {company.status && (
                  <Badge variant="outline" className={getStatusColor(company.status)}>
                    {company.status}
                  </Badge>
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
  const [expandedActivity, setExpandedActivity] = React.useState<number | null>(null)

  const activities = [
    {
      id: 1,
      type: "funding",
      actor: company.name,
      action: "completed",
      target: "Series C funding round",
      timestamp: "1 week ago",
      date: "2025-01-23",
      details: {
        amount: "$25M",
        round: "Series C",
        leadInvestor: "Venture Capital Partners",
        valuation: "$150M",
        useOfFunds: "Product development and market expansion",
      },
    },
    {
      id: 2,
      type: "partnership",
      actor: company.name,
      action: "announced partnership with",
      target: "Microsoft",
      timestamp: "2 weeks ago",
      date: "2025-01-16",
      details: {
        type: "Strategic Partnership",
        duration: "3 years",
        value: "$5M",
        scope: "Cloud infrastructure and AI integration",
      },
    },
    {
      id: 3,
      type: "meeting",
      actor: "Investment Team",
      action: "conducted quarterly review with",
      target: company.name,
      timestamp: "1 month ago",
      date: "2024-12-28",
      details: {
        attendees: ["CEO", "CFO", "Investment Team"],
        topics: ["Q4 Performance", "2025 Strategy", "Market Expansion"],
        outcome: "Positive outlook, continued support",
        nextSteps: "Monthly check-ins, board seat discussion",
      },
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "funding":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>
      case "partnership":
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>
      case "meeting":
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>
    }
  }

  const formatActivityText = (activity: any) => {
    return (
      <span>
        <span className="font-medium">{activity.actor}</span>{" "}
        <span className="text-muted-foreground">{activity.action}</span>{" "}
        <span className="font-medium">{activity.target}</span>
      </span>
    )
  }

  const renderExpandedDetails = (activity: any) => {
    switch (activity.type) {
      case "funding":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Funding Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Amount:</span> <span>{activity.details.amount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Round:</span> <span>{activity.details.round}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Lead Investor:</span>{" "}
                  <span>{activity.details.leadInvestor}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Valuation:</span> <span>{activity.details.valuation}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Use of Funds</h5>
              <p className="text-sm text-muted-foreground">{activity.details.useOfFunds}</p>
            </div>
          </div>
        )
      case "partnership":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Partnership Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span> <span>{activity.details.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span> <span>{activity.details.duration}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Value:</span> <span>{activity.details.value}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Scope</h5>
              <p className="text-sm text-muted-foreground">{activity.details.scope}</p>
            </div>
          </div>
        )
      case "meeting":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Meeting Details</h5>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Attendees:</span>{" "}
                  <span>{activity.details.attendees.join(", ")}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Topics:</span>{" "}
                  <span>{activity.details.topics.join(", ")}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Outcome</h5>
              <p className="text-sm text-muted-foreground">{activity.details.outcome}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Next Steps</h5>
              <p className="text-sm text-muted-foreground">{activity.details.nextSteps}</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id}>
          <button
            onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
            className="flex items-start gap-3 w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="mt-1">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm">{formatActivityText(activity)}</div>
              <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
            </div>
            <ChevronDownIcon
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                expandedActivity === activity.id ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedActivity === activity.id && (
            <div className="ml-6 pl-3 border-l-2 border-muted">{renderExpandedDetails(activity)}</div>
          )}
        </div>
      ))}
    </div>
  )
}

function CompanyDetailsPanel({ company, isFullScreen = false }: { company: Company; isFullScreen?: boolean }) {
  const fieldGroups = [
    {
      id: "company-info",
      label: "Company Information",
      icon: BuildingIcon,
      fields: [
        { label: "Company Name", value: company.name },
        { label: "Industry", value: company.industry },
        { label: "Revenue", value: company.revenue },
        { label: "Employees", value: company.employees },
        { label: "Website", value: company.website, isLink: true },
        { label: "Location", value: company.location },
        { label: "Description", value: company.description },
      ],
    },
  ]

  // Define additional content with Activity section
  const additionalContent = (
    <>
      {/* Show all values button */}
      <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
        Show all values
      </Button>

      {/* Activity Section - Only in Drawer View */}
      {!isFullScreen && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-medium">Activity</h4>
            <Button variant="outline" size="sm">
              <PlusIcon className="h-4 w-4" />
              Add meeting
            </Button>
          </div>
          <CompanyActivityContent company={company} />
        </div>
      )}
    </>
  )

  return (
    <MasterDetailsPanel fieldGroups={fieldGroups} isFullScreen={isFullScreen} additionalContent={additionalContent} />
  )
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
    accessorKey: "categories",
    header: "Categories",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 max-w-[200px]">
        {row.original.categories.slice(0, 3).map((category) => (
          <Badge key={category} variant="outline" className="text-xs px-1 py-0">
            {category}
          </Badge>
        ))}
        {row.original.categories.length > 3 && (
          <Badge variant="outline" className="text-xs px-1 py-0">
            +{row.original.categories.length - 3}
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => <span className="text-sm">{row.original.industry}</span>,
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original.stage}
      </Badge>
    ),
  },
  {
    accessorKey: "employees",
    header: "Employees",
    cell: ({ row }) => <span className="text-sm">{row.original.employees}</span>,
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.revenue}</span>,
  },
  {
    accessorKey: "lastInteraction",
    header: "Last Interaction",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.lastInteraction}</span>,
  },
  {
    accessorKey: "connectionStrength",
    header: "Connection",
    cell: ({ row }) => (
      <Badge className={`text-xs ${getConnectionStrengthColor(row.original.connectionStrength)}`}>
        {row.original.connectionStrength}
      </Badge>
    ),
  },
  {
    accessorKey: "twitterFollowers",
    header: "Twitter",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <span className="text-sm">{formatNumber(row.original.twitterFollowers)}</span>
        <a
          href={`https://twitter.com/${row.original.twitter.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLinkIcon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
        </a>
      </div>
    ),
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
    accessorKey: "estimatedArr",
    header: "Est. ARR",
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.estimatedArr}</span>,
  },
  {
    accessorKey: "fundingRaised",
    header: "Funding Raised",
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {row.original.fundingRaised === "N/A"
          ? "N/A"
          : `$${Number.parseFloat(row.original.fundingRaised.replace(/[$,]/g, "")).toLocaleString()}`}
      </span>
    ),
  },
  {
    accessorKey: "investmentScore",
    header: "Score",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs font-medium">
        {row.original.investmentScore}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={`text-xs ${getStatusColor(row.original.status)}`}>{row.original.status}</Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
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

  const table = useReactTable({
    data: companiesData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
    },
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  })

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
              <DropdownMenuItem>Prospects</DropdownMenuItem>
              <DropdownMenuItem>Partners</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>High investment score</DropdownMenuItem>
              <DropdownMenuItem>Recent interactions</DropdownMenuItem>
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
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
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
                <TableRow key={row.id} className="h-12">
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

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} total row(s).
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
