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
import { Checkbox } from "@/components/ui/checkbox"
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

function OpportunityNameCell({ opportunity }: { opportunity: Opportunity }) {
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("details")

  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "contacts", label: "Contacts", count: 3, icon: UsersIcon },
    { id: "emails", label: "Emails", count: 8, icon: MailIcon },
    { id: "tasks", label: "Tasks", count: 5, icon: CheckCircleIcon },
    { id: "notes", label: "Notes", count: 12, icon: FileTextIcon },
    { id: "meetings", label: "Meetings", count: 4, icon: CalendarIcon },
    { id: "files", label: "Files", count: 7, icon: FolderIcon },
    { id: "activity", label: "Activity", count: null, icon: CalendarIcon },
  ]

  const FullScreenContent = () => {
    const content = (
      <div className="fixed inset-0 z-[9999] bg-background">
        {/* Full Screen Header */}
        <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-background">
              Opportunities
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <MailIcon className="h-4 w-4" />
              Compose email
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsFullScreen(false)}>
              <XIcon className="h-4 w-4" />
              Close
            </Button>
          </div>
        </div>

        {/* Full Screen Content - Two Column Layout */}
        <div className="flex h-[calc(100vh-73px)]">
          {/* Left Panel - Details (Persistent) */}
          <div className="w-96 border-r bg-background">
            <OpportunityDetailsPanel opportunity={opportunity} isFullScreen={true} />
          </div>

          {/* Right Panel - Main Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Record Header */}
            <div className="border-b bg-background px-6 py-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {opportunity.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{opportunity.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {opportunity.company.name} • {opportunity.stage}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b bg-background px-6">
              <div className="flex gap-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative whitespace-nowrap py-3 text-sm font-medium flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.icon && <tab.icon className="h-4 w-4" />}
                    {tab.label}
                    {tab.count !== null && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                        {tab.count}
                      </Badge>
                    )}
                    {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <OpportunityTabContent activeTab={activeTab} opportunity={opportunity} />
            </div>
          </div>
        </div>
      </div>
    )

    return typeof document !== "undefined" ? createPortal(content, document.body) : null
  }

  if (isFullScreen) {
    return <FullScreenContent />
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground h-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-medium">
              {opportunity.name.charAt(0)}
            </div>
            <span className="font-medium">{opportunity.name}</span>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => document.querySelector('[data-state="open"]')?.click()}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="bg-background">
              Opportunities
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsFullScreen(true)}>
              <ExpandIcon className="h-4 w-4" />
              Full screen
            </Button>
            <Button variant="outline" size="sm">
              <MailIcon className="h-4 w-4" />
              Compose email
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Record Header */}
          <div className="border-b bg-background px-6 py-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {opportunity.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{opportunity.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {opportunity.company.name} • {opportunity.stage}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b bg-background px-6">
            <div className="flex gap-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative whitespace-nowrap py-3 text-sm font-medium flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.icon && <tab.icon className="h-4 w-4" />}
                  {tab.label}
                  {tab.count !== null && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                      {tab.count}
                    </Badge>
                  )}
                  {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <OpportunityTabContent activeTab={activeTab} opportunity={opportunity} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function OpportunityDetailsPanel({
  opportunity,
  isFullScreen = false,
}: { opportunity: Opportunity; isFullScreen?: boolean }) {
  return (
    <div className="p-6">
      {/* Details Tab */}
      <div className="mb-6 border-b">
        <div className="flex gap-6">
          <button className="relative border-b-2 border-primary pb-3 text-sm font-medium text-primary">
            Details
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>
          </button>
          <button className="relative pb-3 text-sm text-muted-foreground hover:text-foreground">
            Comments
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              0
            </Badge>
          </button>
        </div>
      </div>

      {/* Opportunity Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Opportunity Details</h4>

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

function OpportunityTabContent({ activeTab, opportunity }: { activeTab: string; opportunity: Opportunity }) {
  if (activeTab === "details") {
    return <OpportunityDetailsPanel opportunity={opportunity} isFullScreen={false} />
  }

  if (activeTab === "contacts") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Contacts</h3>
          <Button variant="outline" size="sm">
            <PlusIcon className="h-4 w-4" />
            Add Contact
          </Button>
        </div>
        <div className="grid gap-4">
          {[
            {
              name: opportunity.contact.name,
              role: opportunity.contact.role,
              email: "contact@example.com",
              phone: "+1 (555) 123-4567",
            },
            { name: "Legal Counsel", role: "Attorney", email: "legal@example.com", phone: "+1 (555) 234-5678" },
            {
              name: "Investment Committee",
              role: "Decision Maker",
              email: "committee@example.com",
              phone: "+1 (555) 345-6789",
            },
          ].map((contact, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground">{contact.role}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <MailIcon className="h-3 w-3" />
                        <span className="text-blue-600">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <PhoneIcon className="h-3 w-3" />
                        <span>{contact.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Generic content for other tabs
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
        <Button variant="outline" size="sm">
          <PlusIcon className="h-4 w-4" />
          Add {activeTab.slice(0, -1)}
        </Button>
      </div>
      <div className="text-center py-8 text-muted-foreground">
        <p>
          No {activeTab} found for {opportunity.name}
        </p>
        <p className="text-sm">Add some {activeTab} to get started</p>
      </div>
    </div>
  )
}

const columns: ColumnDef<Opportunity>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
  const [rowSelection, setRowSelection] = React.useState({})
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
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="h-12">
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
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
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
