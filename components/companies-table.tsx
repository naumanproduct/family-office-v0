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
  GlobeIcon,
  MapPinIcon,
  DollarSignIcon,
  TrendingUpIcon,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

// Import the AddCompanyDialog at the top of the file
import { AddCompanyDialog } from "./add-company-dialog"
import { EmailsTable } from "./emails-table"
import { TasksTable } from "./tasks-table"
import { NotesTable } from "./notes-table"
import { MasterDrawer } from "./master-drawer"

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
    { id: "emails", label: "Emails", count: 3, icon: MailIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: CheckCircleIcon },
    { id: "notes", label: "Notes", count: 1, icon: FileTextIcon },
    { id: "meetings", label: "Meetings", count: 4, icon: CalendarIcon },
    { id: "files", label: "Files", count: 5, icon: FolderIcon },
    { id: "team", label: "Team", count: 6, icon: UsersIcon },
    { id: "workflows", label: "Workflows", count: company.workflows.length, icon: FolderIcon },
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
      return <CompanyDetailsPanel company={company} isFullScreen={false} />
    }

    if (activeTab === "workflows") {
      return <CompanyTabContent activeTab={activeTab} company={company} />
    }

    // For other tabs, return generic content similar to the dashboard
    const data = getCompanyTabData(activeTab, company)

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
          title: "Update company profile",
          priority: "Medium",
          status: "pending",
          assignee: "You",
          dueDate: "Tomorrow",
          description: "Update profile details for " + company.name,
        },
        {
          id: 2,
          title: "Schedule quarterly review",
          priority: "High",
          status: "pending",
          assignee: "Sarah Johnson",
          dueDate: "Next week",
          description: "Set up quarterly review meeting with " + company.name + " team",
        },
      ]
    case "notes":
      return [
        {
          id: 1,
          title: "Meeting Notes - Q2 Review",
          date: "2 weeks ago",
          content: "Discussed Q2 performance and future collaboration plans...",
        },
        {
          id: 2,
          title: "Partnership Terms",
          date: "1 month ago",
          content: "Notes regarding partnership terms and conditions...",
        },
      ]
    case "meetings":
      return [
        {
          id: 1,
          title: "Quarterly Review",
          date: "Tomorrow, 2:00 PM",
          status: "Scheduled",
          attendees: ["You", "Sarah Johnson", "Michael Chen"],
        },
        {
          id: 2,
          title: "Partnership Discussion",
          date: "Next Monday, 10:00 AM",
          status: "Scheduled",
          attendees: ["You", "Emma Garcia", "David Kim"],
        },
      ]
    case "files":
      return [
        {
          id: 1,
          name: "Partnership Agreement.pdf",
          uploadedBy: "You",
          uploadedDate: "2 weeks ago",
          size: "2.4 MB",
          type: "pdf",
        },
        {
          id: 2,
          name: "Company Profile.docx",
          uploadedBy: "Sarah Johnson",
          uploadedDate: "1 month ago",
          size: "1.8 MB",
          type: "docx",
        },
      ]
    case "team":
      return [
        {
          id: 1,
          name: "Sarah Johnson",
          role: "CEO",
          email: "sarah.johnson@" + company.name.toLowerCase().replace(/\s+/g, "") + ".com",
        },
        {
          id: 2,
          name: "Michael Chen",
          role: "CTO",
          email: "michael.chen@" + company.name.toLowerCase().replace(/\s+/g, "") + ".com",
        },
      ]
    default:
      return []
  }
}

function TableView({
  data,
  activeTab,
  onTaskClick,
  onNoteClick,
  onMeetingClick,
  onEmailClick,
}: {
  data: any[]
  activeTab: string
  onTaskClick?: (task: any) => void
  onNoteClick?: (note: any) => void
  onMeetingClick?: (meeting: any) => void
  onEmailClick?: (email: any) => void
}) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No {activeTab} found</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {activeTab === "emails" && (
              <>
                <TableHead>Subject</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </>
            )}
            {activeTab === "tasks" && (
              <>
                <TableHead>Title</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </>
            )}
            {activeTab === "notes" && (
              <>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </>
            )}
            {activeTab === "meetings" && (
              <>
                <TableHead>Title</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead className="w-12"></TableHead>
              </>
            )}
            {activeTab === "files" && (
              <>
                <TableHead>Name</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="w-12"></TableHead>
              </>
            )}
            {activeTab === "team" && (
              <>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-12"></TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              className={`${
                (activeTab === "tasks" && onTaskClick) ||
                (activeTab === "notes" && onNoteClick) ||
                (activeTab === "meetings" && onMeetingClick) ||
                (activeTab === "emails" && onEmailClick)
                  ? "cursor-pointer hover:bg-muted/50"
                  : ""
              }`}
              onClick={() => {
                if (activeTab === "tasks" && onTaskClick) {
                  onTaskClick(item)
                } else if (activeTab === "notes" && onNoteClick) {
                  onNoteClick(item)
                } else if (activeTab === "meetings" && onMeetingClick) {
                  onMeetingClick(item)
                } else if (activeTab === "emails" && onEmailClick) {
                  onEmailClick(item)
                }
              }}
            >
              {activeTab === "emails" && (
                <>
                  <TableCell className="font-medium">{item.subject}</TableCell>
                  <TableCell>{item.from}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Unread" ? "default" : "outline"}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Reply</DropdownMenuItem>
                        <DropdownMenuItem>Forward</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </>
              )}
              {activeTab === "tasks" && (
                <>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.dueDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.priority === "High" ? "destructive" : item.priority === "Medium" ? "default" : "secondary"
                      }
                    >
                      {item.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.assignee}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </>
              )}
              {/* Add implementations for other tab types as needed */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function CardView({
  data,
  activeTab,
  onTaskClick,
  onNoteClick,
  onMeetingClick,
  onEmailClick,
}: {
  data: any[]
  activeTab: string
  onTaskClick?: (task: any) => void
  onNoteClick?: (note: any) => void
  onMeetingClick?: (meeting: any) => void
  onEmailClick?: (email: any) => void
}) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No {activeTab} found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((item) => (
        <Card
          key={item.id}
          className={`${
            (activeTab === "tasks" && onTaskClick) ||
            (activeTab === "notes" && onNoteClick) ||
            (activeTab === "meetings" && onMeetingClick) ||
            (activeTab === "emails" && onEmailClick)
              ? "cursor-pointer hover:bg-muted/50"
              : ""
          }`}
          onClick={() => {
            if (activeTab === "tasks" && onTaskClick) {
              onTaskClick(item)
            } else if (activeTab === "notes" && onNoteClick) {
              onNoteClick(item)
            } else if (activeTab === "meetings" && onMeetingClick) {
              onMeetingClick(item)
            } else if (activeTab === "emails" && onEmailClick) {
              onEmailClick(item)
            }
          }}
        >
          <CardContent className="p-4">
            {/* Email Card */}
            {activeTab === "emails" && (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{item.subject}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.preview}</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">From:</span>
                      <span>{item.from}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.status === "Unread" ? "default" : "outline"}>{item.status}</Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem>Reply</DropdownMenuItem>
                    <DropdownMenuItem>Forward</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Task Card */}
            {activeTab === "tasks" && (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Due:</span>
                      <span>{item.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Assignee:</span>
                      <span>{item.assignee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          item.priority === "High"
                            ? "destructive"
                            : item.priority === "Medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {item.priority}
                      </Badge>
                      <Badge variant="outline">{item.status}</Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Add implementations for other card types as needed */}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ListView({
  data,
  activeTab,
  onTaskClick,
  onNoteClick,
  onMeetingClick,
  onEmailClick,
}: {
  data: any[]
  activeTab: string
  onTaskClick?: (task: any) => void
  onNoteClick?: (note: any) => void
  onMeetingClick?: (meeting: any) => void
  onEmailClick?: (email: any) => void
}) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No {activeTab} found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div
          key={item.id}
          className={`rounded-lg border p-4 ${
            (activeTab === "tasks" && onTaskClick) ||
            (activeTab === "notes" && onNoteClick) ||
            (activeTab === "meetings" && onMeetingClick) ||
            (activeTab === "emails" && onEmailClick)
              ? "cursor-pointer hover:bg-muted/50"
              : ""
          }`}
          onClick={() => {
            if (activeTab === "tasks" && onTaskClick) {
              onTaskClick(item)
            } else if (activeTab === "notes" && onNoteClick) {
              onNoteClick(item)
            } else if (activeTab === "meetings" && onMeetingClick) {
              onMeetingClick(item)
            } else if (activeTab === "emails" && onEmailClick) {
              onEmailClick(item)
            }
          }}
        >
          {/* Email List Item */}
          {activeTab === "emails" && (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.subject}</p>
                    <p className="text-xs text-muted-foreground">From: {item.from}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                    <div className="mt-1">
                      <Badge variant={item.status === "Unread" ? "default" : "outline"} className="text-xs">
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{item.preview}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View</DropdownMenuItem>
                  <DropdownMenuItem>Reply</DropdownMenuItem>
                  <DropdownMenuItem>Forward</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Task List Item */}
          {activeTab === "tasks" && (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">Assigned to: {item.assignee}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Due: {item.dueDate}</p>
                    <div className="mt-1 flex items-center gap-1 justify-end">
                      <Badge
                        variant={
                          item.priority === "High"
                            ? "destructive"
                            : item.priority === "Medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {item.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Add implementations for other list item types as needed */}
        </div>
      ))}
    </div>
  )
}

function CompanyDetailsPanel({ company, isFullScreen = false }: { company: Company; isFullScreen?: boolean }) {
  const [expandedWorkflows, setExpandedWorkflows] = React.useState<Record<string, boolean>>({})

  const toggleWorkflow = (id: string) => {
    setExpandedWorkflows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

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

      {/* Company Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Company Details</h4>

        <div className="rounded-lg border border-muted bg-muted/10 p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Company Name</Label>
                <p className="text-sm font-medium">{company.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Industry</Label>
                <p className="text-sm">{company.industry}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Revenue</Label>
                <p className="text-sm">{company.revenue}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Employees</Label>
                <p className="text-sm">{company.employees}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <GlobeIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Website</Label>
                <p className="text-sm text-blue-600">{company.website}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Location</Label>
                <p className="text-sm">{company.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <FileTextIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <p className="text-sm">{company.description}</p>
              </div>
            </div>
          </div>
        </div>

        <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
          Show all values
        </Button>
      </div>

      {/* Workflows Section */}
      {company.workflows && company.workflows.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-medium">Workflows</h4>
          </div>
          <div className="space-y-3">
            {company.workflows.map((workflow) => (
              <div key={workflow.id} className="rounded-lg border border-muted">
                <button
                  onClick={() => toggleWorkflow(workflow.id)}
                  className="flex w-full items-center justify-between p-3 text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${workflow.stageColor}`}></div>
                    <span className="font-medium">{workflow.name}</span>
                    <Badge variant="outline" className="ml-2">
                      {workflow.stage}
                    </Badge>
                  </div>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform ${expandedWorkflows[workflow.id] ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedWorkflows[workflow.id] && (
                  <div className="border-t p-3">
                    <div className="grid gap-2">
                      {workflow.targetRaise && (
                        <div className="flex items-center gap-2">
                          <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-xs text-muted-foreground">Target Raise:</span>
                            <span className="ml-2 text-sm">{workflow.targetRaise}</span>
                          </div>
                        </div>
                      )}
                      {workflow.fundingRound && (
                        <div className="flex items-center gap-2">
                          <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-xs text-muted-foreground">Funding Round:</span>
                            <span className="ml-2 text-sm">{workflow.fundingRound}</span>
                          </div>
                        </div>
                      )}
                      {workflow.nextMeeting && (
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-xs text-muted-foreground">Next Meeting:</span>
                            <span className="ml-2 text-sm">{workflow.nextMeeting}</span>
                          </div>
                        </div>
                      )}
                      {workflow.dueDate && (
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-xs text-muted-foreground">Due Date:</span>
                            <span className="ml-2 text-sm">{workflow.dueDate}</span>
                          </div>
                        </div>
                      )}
                      {workflow.assignee && (
                        <div className="flex items-center gap-2">
                          <UsersIcon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-xs text-muted-foreground">Assignee:</span>
                            <span className="ml-2 text-sm">{workflow.assignee}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CompanyTabContent({ activeTab, company }: { activeTab: string; company: Company }) {
  if (activeTab === "details") {
    return <CompanyDetailsPanel company={company} isFullScreen={false} />
  }

  if (activeTab === "emails") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Emails</h3>
          <Button variant="outline" size="sm">
            <PlusIcon className="h-4 w-4" />
            Compose Email
          </Button>
        </div>
        <EmailsTable />
      </div>
    )
  }

  if (activeTab === "tasks") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Tasks</h3>
          <Button variant="outline" size="sm">
            <PlusIcon className="h-4 w-4" />
            Add Task
          </Button>
        </div>
        <TasksTable />
      </div>
    )
  }

  if (activeTab === "notes") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Notes</h3>
          <Button variant="outline" size="sm">
            <PlusIcon className="h-4 w-4" />
            Add Note
          </Button>
        </div>
        <NotesTable />
      </div>
    )
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
            { name: "Sarah Johnson", role: "CEO", email: "sarah@" + company.website, phone: "+1 (555) 123-4567" },
            { name: "Mike Chen", role: "CTO", email: "mike@" + company.website, phone: "+1 (555) 234-5678" },
            { name: "Lisa Wang", role: "VP Sales", email: "lisa@" + company.website, phone: "+1 (555) 345-6789" },
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
          No {activeTab} found for {company.name}
        </p>
        <p className="text-sm">Add some {activeTab} to get started</p>
      </div>
    </div>
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
