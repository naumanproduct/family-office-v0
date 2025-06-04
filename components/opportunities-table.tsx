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

import { createPortal } from "react-dom"
import {
  ExpandIcon,
  XIcon,
  MailIcon,
  BuildingIcon,
  FileTextIcon,
  CalendarIcon,
  FolderIcon,
  UsersIcon,
  CheckCircleIcon,
  PhoneIcon,
  DollarSignIcon,
  TrendingUpIcon,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MasterDrawer } from "./master-drawer"
import { EmailsTable } from "./emails-table"
import { TasksTable } from "./tasks-table"
import { NotesTable } from "./notes-table"

export const opportunitySchema = z.object({
  id: z.number(),
  name: z.string(),
  company: z.object({
    name: z.string(),
    type: z.string(), // "Issuer" or "GP"
  }),
  contact: z.object({
    name: z.string(),
    role: z.string(), // Deal sponsor
  }),
  legalEntity: z.object({
    name: z.string(),
    type: z.string(), // Investing party
  }),
  stage: z.string(),
  amount: z.string(),
  probability: z.number(),
  expectedClose: z.string(),
  lastActivity: z.string(),
  priority: z.string(),
  status: z.string(),
  description: z.string(),
  fundingRound: z.string(),
  valuation: z.string(),
  sector: z.string(),
  geography: z.string(),
})

export type Opportunity = z.infer<typeof opportunitySchema>

export const opportunitiesData: Opportunity[] = [
  {
    id: 1,
    name: "Series C Investment - TechFlow",
    company: {
      name: "TechFlow Ventures",
      type: "GP",
    },
    contact: {
      name: "Sarah Chen",
      role: "Managing Partner",
    },
    legalEntity: {
      name: "Meridian Capital Fund III",
      type: "Investment Fund",
    },
    stage: "Due Diligence",
    amount: "$15M",
    probability: 75,
    expectedClose: "2024-08-15",
    lastActivity: "2 days ago",
    priority: "High",
    status: "Active",
    description: "Growth stage investment in enterprise software company",
    fundingRound: "Series C",
    valuation: "$150M",
    sector: "Enterprise Software",
    geography: "North America",
  },
  {
    id: 2,
    name: "Seed Round - HealthTech Startup",
    company: {
      name: "MedInnovate Inc",
      type: "Issuer",
    },
    contact: {
      name: "Dr. Michael Rodriguez",
      role: "CEO & Founder",
    },
    legalEntity: {
      name: "Innovation Ventures LLC",
      type: "Investment Vehicle",
    },
    stage: "Term Sheet",
    amount: "$3M",
    probability: 60,
    expectedClose: "2024-07-30",
    lastActivity: "1 week ago",
    priority: "Medium",
    status: "Active",
    description: "Early stage investment in digital health platform",
    fundingRound: "Seed",
    valuation: "$20M",
    sector: "Healthcare Technology",
    geography: "North America",
  },
  {
    id: 3,
    name: "Growth Investment - FinTech Platform",
    company: {
      name: "PayFlow Solutions",
      type: "Issuer",
    },
    contact: {
      name: "Jennifer Kim",
      role: "VP Business Development",
    },
    legalEntity: {
      name: "Global Growth Partners",
      type: "Private Equity Fund",
    },
    stage: "Initial Contact",
    amount: "$25M",
    probability: 30,
    expectedClose: "2024-10-15",
    lastActivity: "3 days ago",
    priority: "High",
    status: "Active",
    description: "Growth capital for payment processing expansion",
    fundingRound: "Series B",
    valuation: "$200M",
    sector: "Financial Technology",
    geography: "Global",
  },
  {
    id: 4,
    name: "Acquisition Opportunity - AI Startup",
    company: {
      name: "Neural Networks Corp",
      type: "Issuer",
    },
    contact: {
      name: "Alex Thompson",
      role: "Chief Strategy Officer",
    },
    legalEntity: {
      name: "Strategic Acquisitions Fund",
      type: "Acquisition Vehicle",
    },
    stage: "Closed Won",
    amount: "$50M",
    probability: 100,
    expectedClose: "2024-06-01",
    lastActivity: "1 month ago",
    priority: "High",
    status: "Closed",
    description: "Strategic acquisition of AI/ML technology company",
    fundingRound: "Acquisition",
    valuation: "$50M",
    sector: "Artificial Intelligence",
    geography: "North America",
  },
  {
    id: 5,
    name: "Real Estate Fund Investment",
    company: {
      name: "Urban Development Partners",
      type: "GP",
    },
    contact: {
      name: "Robert Martinez",
      role: "Fund Manager",
    },
    legalEntity: {
      name: "Real Estate Investment Trust",
      type: "REIT",
    },
    stage: "Proposal",
    amount: "$100M",
    probability: 45,
    expectedClose: "2024-09-30",
    lastActivity: "5 days ago",
    priority: "Medium",
    status: "Active",
    description: "Commercial real estate development fund",
    fundingRound: "Fund Investment",
    valuation: "N/A",
    sector: "Real Estate",
    geography: "North America",
  },
]

const getStageColor = (stage: string) => {
  switch (stage) {
    case "Initial Contact":
      return "bg-gray-100 text-gray-800"
    case "Proposal":
      return "bg-blue-100 text-blue-800"
    case "Due Diligence":
      return "bg-yellow-100 text-yellow-800"
    case "Term Sheet":
      return "bg-purple-100 text-purple-800"
    case "Closed Won":
      return "bg-green-100 text-green-800"
    case "Closed Lost":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800"
    case "Medium":
      return "bg-yellow-100 text-yellow-800"
    case "Low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "On Hold":
      return "bg-yellow-100 text-yellow-800"
    case "Closed":
      return "bg-blue-100 text-blue-800"
    case "Cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function TableView({ data, activeTab, onTaskClick, onNoteClick, onMeetingClick, onEmailClick }: any) {
  return (
    <div className="space-y-4">
      <div className="text-center py-8 text-muted-foreground">
        <p>Table view for {activeTab}</p>
        <p className="text-sm">{data.length} items</p>
      </div>
    </div>
  )
}

function CardView({ data, activeTab, onTaskClick, onNoteClick, onMeetingClick, onEmailClick }: any) {
  return (
    <div className="space-y-4">
      <div className="text-center py-8 text-muted-foreground">
        <p>Card view for {activeTab}</p>
        <p className="text-sm">{data.length} items</p>
      </div>
    </div>
  )
}

function ListView({ data, activeTab, onTaskClick, onNoteClick, onMeetingClick, onEmailClick }: any) {
  return (
    <div className="space-y-4">
      <div className="text-center py-8 text-muted-foreground">
        <p>List view for {activeTab}</p>
        <p className="text-sm">{data.length} items</p>
      </div>
    </div>
  )
}

function getOpportunityTabData(activeTab: string, opportunity: Opportunity) {
  switch (activeTab) {
    case "emails":
      return [
        {
          id: 1,
          subject: "Investment Performance Update",
          from: "portfolio@company.com",
          date: "2 hours ago",
          status: "Unread",
          preview: "Quarterly performance report for your investment in " + opportunity.name,
          type: "received",
        },
        {
          id: 2,
          subject: "Valuation Update Required",
          from: "me@company.com",
          date: "1 day ago",
          status: "Sent",
          preview: "Please provide updated valuation for " + opportunity.name,
          type: "sent",
        },
        {
          id: 3,
          subject: "Due Diligence Documents",
          from: "legal@company.com",
          date: "3 days ago",
          status: "Read",
          preview: "Attached are the due diligence documents for " + opportunity.name,
          type: "received",
        },
      ]
    case "tasks":
      return [
        {
          id: 1,
          title: "Review financial statements",
          assignee: "John Smith",
          dueDate: "2024-02-15",
          status: "In Progress",
          priority: "High",
        },
        {
          id: 2,
          title: "Complete due diligence checklist",
          assignee: "Sarah Johnson",
          dueDate: "2024-02-20",
          status: "Pending",
          priority: "Medium",
        },
      ]
    case "notes":
      return [
        {
          id: 1,
          title: "Initial call notes",
          content: "Discussed investment opportunity and next steps for " + opportunity.name,
          author: "Mike Wilson",
          date: "2024-01-10",
          tags: ["call", "initial", "opportunity"],
        },
      ]
    case "meetings":
      return [
        {
          id: 1,
          title: "Investment Committee Meeting",
          date: "2024-02-10",
          time: "10:00 AM",
          attendees: ["John Smith", "Sarah Johnson", "Mike Wilson"],
          status: "Scheduled",
        },
        {
          id: 2,
          title: "Due Diligence Review",
          date: "2024-02-15",
          time: "2:00 PM",
          attendees: ["Legal Team", "Investment Team"],
          status: "Scheduled",
        },
        {
          id: 3,
          title: "Management Presentation",
          date: "2024-02-20",
          time: "9:00 AM",
          attendees: ["Management Team", "Investment Committee"],
          status: "Pending",
        },
        {
          id: 4,
          title: "Final Investment Decision",
          date: "2024-02-25",
          time: "11:00 AM",
          attendees: ["Investment Committee"],
          status: "Pending",
        },
      ]
    case "files":
      return [
        {
          id: 1,
          name: "Investment Memorandum.pdf",
          size: "2.4 MB",
          type: "PDF",
          uploadDate: "2024-01-15",
          uploadedBy: "John Smith",
        },
        {
          id: 2,
          name: "Financial Statements Q4.xlsx",
          size: "1.1 MB",
          type: "Excel",
          uploadDate: "2024-01-20",
          uploadedBy: "Sarah Johnson",
        },
        {
          id: 3,
          name: "Due Diligence Checklist.docx",
          size: "850 KB",
          type: "Word",
          uploadDate: "2024-01-25",
          uploadedBy: "Mike Wilson",
        },
        {
          id: 4,
          name: "Market Analysis Report.pdf",
          size: "3.2 MB",
          type: "PDF",
          uploadDate: "2024-02-01",
          uploadedBy: "Analysis Team",
        },
        {
          id: 5,
          name: "Legal Documents.zip",
          size: "5.8 MB",
          type: "Archive",
          uploadDate: "2024-02-05",
          uploadedBy: "Legal Team",
        },
      ]
    case "team":
      return [
        {
          id: 1,
          name: "John Smith",
          role: "Investment Manager",
          email: "john.smith@company.com",
          phone: "+1 (555) 123-4567",
        },
        {
          id: 2,
          name: "Sarah Johnson",
          role: "Senior Analyst",
          email: "sarah.johnson@company.com",
          phone: "+1 (555) 234-5678",
        },
        {
          id: 3,
          name: "Mike Wilson",
          role: "Portfolio Manager",
          email: "mike.wilson@company.com",
          phone: "+1 (555) 345-6789",
        },
        {
          id: 4,
          name: "Emily Davis",
          role: "Research Analyst",
          email: "emily.davis@company.com",
          phone: "+1 (555) 456-7890",
        },
        {
          id: 5,
          name: "David Brown",
          role: "Investment Associate",
          email: "david.brown@company.com",
          phone: "+1 (555) 567-8901",
        },
        {
          id: 6,
          name: "Lisa Garcia",
          role: "Operations Manager",
          email: "lisa.garcia@company.com",
          phone: "+1 (555) 678-9012",
        },
      ]
    case "company":
      return [
        {
          id: 1,
          name: opportunity.company.name,
          type: opportunity.company.type,
          description: "Company information and details",
          website: "https://company.com",
          industry: opportunity.sector,
          location: opportunity.geography,
        },
      ]
    default:
      return []
  }
}

function OpportunityNameCell({ opportunity }: { opportunity: Opportunity }) {
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "emails", label: "Emails", count: 3, icon: MailIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: CheckCircleIcon },
    { id: "notes", label: "Notes", count: 1, icon: FileTextIcon },
    { id: "meetings", label: "Meetings", count: 4, icon: CalendarIcon },
    { id: "files", label: "Files", count: 5, icon: FolderIcon },
    { id: "team", label: "People", count: 6, icon: UsersIcon },
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
    if (activeTab === "details") {
      return <OpportunityDetailsPanel opportunity={opportunity} isFullScreen={false} />
    }

    // For other tabs, return generic content similar to the dashboard
    const data = getOpportunityTabData(activeTab, opportunity)

    if (viewMode === "table") {
      return (
        <TableView
          data={data}
          activeTab={activeTab}
          onTaskClick={setSelectedTask}
          onNoteClick={setSelectedNote}
          onMeetingClick={setSelectedMeeting}
          onEmailClick={setSelectedEmail}
        />
      )
    }

    if (viewMode === "card") {
      return (
        <CardView
          data={data}
          activeTab={activeTab}
          onTaskClick={setSelectedTask}
          onNoteClick={setSelectedNote}
          onMeetingClick={setSelectedMeeting}
          onEmailClick={setSelectedEmail}
        />
      )
    }

    return (
      <ListView
        data={data}
        activeTab={activeTab}
        onTaskClick={setSelectedTask}
        onNoteClick={setSelectedNote}
        onMeetingClick={setSelectedMeeting}
        onEmailClick={setSelectedEmail}
      />
    )
  }

  const renderDetailsPanel = (isFullScreen = false) => {
    return <OpportunityDetailsPanel opportunity={opportunity} isFullScreen={isFullScreen} />
  }

  const customActions: React.ReactNode[] = []

  return (
    <MasterDrawer
      trigger={
        <Button variant="link" className="w-fit px-0 text-left text-foreground h-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-medium">
              {opportunity.name.charAt(0)}
            </div>
            <span className="font-medium">{opportunity.name}</span>
          </div>
        </Button>
      }
      title={opportunity.name}
      recordType="Opportunities"
      subtitle={`${opportunity.company.name} • ${opportunity.stage}`}
      tabs={tabs}
      detailsPanel={renderDetailsPanel}
      customActions={customActions}
    >
      {renderTabContent}
    </MasterDrawer>
  )
}

function OpportunityDetailsPanel({
  opportunity,
  isFullScreen = false,
}: { opportunity: Opportunity; isFullScreen?: boolean }) {
  return (
    <div className="px-6 pt-2 pb-6">
      {/* Opportunity Details */}
      <div className="space-y-4">
        <div className="rounded-lg border border-muted bg-muted/10 p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Opportunity Name</Label>
                <p className="text-sm font-medium">{opportunity.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Company ({opportunity.company.type})</Label>
                <p className="text-sm">{opportunity.company.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Contact (Deal Sponsor)</Label>
                <p className="text-sm">{opportunity.contact.name}</p>
                <p className="text-xs text-muted-foreground">{opportunity.contact.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Legal Entity (Investing Party)</Label>
                <p className="text-sm">{opportunity.legalEntity.name}</p>
                <p className="text-xs text-muted-foreground">{opportunity.legalEntity.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Investment Amount</Label>
                <p className="text-sm">{opportunity.amount}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Expected Close</Label>
                <p className="text-sm">{opportunity.expectedClose}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Probability</Label>
                <p className="text-sm">{opportunity.probability}%</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <FileTextIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <p className="text-sm">{opportunity.description}</p>
              </div>
            </div>
          </div>
        </div>

        <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
          Show all values
        </Button>
      </div>
    </div>
  )
}

const columns: ColumnDef<Opportunity>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2">
        Opportunity
        {column.getIsSorted() === "asc" ? (
          <SortAscIcon className="ml-2 h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <SortDescIcon className="ml-2 h-3 w-3" />
        ) : null}
      </Button>
    ),
    cell: ({ row }) => <OpportunityNameCell opportunity={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium">{row.original.company.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.company.type}</p>
      </div>
    ),
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium">{row.original.contact.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.contact.role}</p>
      </div>
    ),
  },
  {
    accessorKey: "legalEntity",
    header: "Legal Entity",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium">{row.original.legalEntity.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.legalEntity.type}</p>
      </div>
    ),
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => <Badge className={`text-xs ${getStageColor(row.original.stage)}`}>{row.original.stage}</Badge>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.amount}</span>,
  },
  {
    accessorKey: "probability",
    header: "Probability",
    cell: ({ row }) => <span className="text-sm">{row.original.probability}%</span>,
  },
  {
    accessorKey: "expectedClose",
    header: "Expected Close",
    cell: ({ row }) => <span className="text-sm">{row.original.expectedClose}</span>,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <Badge className={`text-xs ${getPriorityColor(row.original.priority)}`}>{row.original.priority}</Badge>
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
    accessorKey: "lastActivity",
    header: "Last Activity",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.lastActivity}</span>,
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
          <DropdownMenuItem>Edit opportunity</DropdownMenuItem>
          <DropdownMenuItem>Add to pipeline</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function OpportunitiesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data: opportunitiesData,
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
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search opportunities..."
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
              <DropdownMenuItem>Active opportunities</DropdownMenuItem>
              <DropdownMenuItem>High priority</DropdownMenuItem>
              <DropdownMenuItem>Due diligence stage</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>High probability</DropdownMenuItem>
              <DropdownMenuItem>Recent activity</DropdownMenuItem>
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
          <Button size="sm">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Opportunity
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
