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
  BriefcaseIcon,
  UserIcon,
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
  MapPinIcon,
  ScaleIcon,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Import the AddEntityDialog
import { AddEntityDialog } from "./add-entity-dialog"
import { EmailsTable } from "./emails-table"
import { TasksTable } from "./tasks-table"
import { NotesTable } from "./notes-table"
import { MasterDrawer } from "./master-drawer"

export const entitySchema = z.object({
  id: z.number(),
  entityName: z.string(),
  entityType: z.string(),
  rolePurpose: z.string(),
  jurisdiction: z.string(),
  status: z.string(),
  ownershipPercent: z.number().optional(),
  parentEntity: z.string().optional(),
  managerController: z.string(),
  dateFormed: z.string(),
  tags: z.array(z.string()),
  lastModified: z.string(),
  linkedDocs: z.number(),
  upcomingDeadlines: z.array(z.string()),
  notes: z.string(),
  taxId: z.string(),
  formationDate: z.string(),
  registeredAgent: z.string(),
})

type Entity = z.infer<typeof entitySchema>

export const entitiesData: Entity[] = [
  {
    id: 1,
    entityName: "Venture Holdings LLC",
    entityType: "LLC",
    rolePurpose: "Holding Co",
    jurisdiction: "Delaware",
    status: "Active",
    ownershipPercent: 100,
    parentEntity: undefined,
    managerController: "John Smith",
    dateFormed: "2020-01-15",
    tags: ["Taxable", "Onshore"],
    lastModified: "2024-01-15",
    linkedDocs: 12,
    upcomingDeadlines: ["Tax Filing - March 15", "Annual Report - April 30"],
    notes: "Primary holding company for all venture investments",
    taxId: "123456789",
    formationDate: "2020-01-15",
    registeredAgent: "John Smith",
  },
  {
    id: 2,
    entityName: "Tech Investments LP",
    entityType: "LP",
    rolePurpose: "LP",
    jurisdiction: "Cayman",
    status: "Active",
    ownershipPercent: 75,
    parentEntity: "Venture Holdings LLC",
    managerController: "Sarah Johnson",
    dateFormed: "2021-03-10",
    tags: ["Offshore", "Investment Vehicle"],
    lastModified: "2024-01-10",
    linkedDocs: 8,
    upcomingDeadlines: ["Audit - June 30"],
    notes: "Limited partnership for technology sector investments",
    taxId: "987654321",
    formationDate: "2021-03-10",
    registeredAgent: "Sarah Johnson",
  },
  {
    id: 3,
    entityName: "Global Trust Foundation",
    entityType: "Foundation",
    rolePurpose: "Trust",
    jurisdiction: "BVI",
    status: "Active",
    ownershipPercent: undefined,
    parentEntity: undefined,
    managerController: "Michael Chen",
    dateFormed: "2019-11-20",
    tags: ["Offshore", "Charitable"],
    lastModified: "2023-12-20",
    linkedDocs: 15,
    upcomingDeadlines: [],
    notes: "Charitable foundation for philanthropic activities",
    taxId: "555555555",
    formationDate: "2019-11-20",
    registeredAgent: "Michael Chen",
  },
  {
    id: 4,
    entityName: "OpCo Delaware Inc",
    entityType: "Corp",
    rolePurpose: "Operating Co",
    jurisdiction: "Delaware",
    status: "Active",
    ownershipPercent: 100,
    parentEntity: "Venture Holdings LLC",
    managerController: "Lisa Wang",
    dateFormed: "2022-05-01",
    tags: ["Taxable", "Onshore", "Operating"],
    lastModified: "2024-01-05",
    linkedDocs: 6,
    upcomingDeadlines: ["Board Meeting - February 15", "Tax Filing - March 15"],
    notes: "Operating company for direct business activities",
    taxId: "111111111",
    formationDate: "2022-05-01",
    registeredAgent: "Lisa Wang",
  },
  {
    id: 5,
    entityName: "Legacy Trust LLC",
    entityType: "LLC",
    rolePurpose: "Trust",
    jurisdiction: "Nevada",
    status: "Inactive",
    ownershipPercent: undefined,
    parentEntity: undefined,
    managerController: "Robert Davis",
    dateFormed: "2018-08-12",
    tags: ["Onshore", "Legacy"],
    lastModified: "2023-08-12",
    linkedDocs: 3,
    upcomingDeadlines: [],
    notes: "Legacy trust structure, currently inactive",
    taxId: "222222222",
    formationDate: "2018-08-12",
    registeredAgent: "Robert Davis",
  },
  {
    id: 6,
    entityName: "Growth Partners GP",
    entityType: "LP",
    rolePurpose: "GP",
    jurisdiction: "Delaware",
    status: "Active",
    ownershipPercent: 2,
    parentEntity: "Venture Holdings LLC",
    managerController: "Amanda Wilson",
    dateFormed: "2023-01-30",
    tags: ["Taxable", "Onshore", "GP"],
    lastModified: "2024-01-12",
    linkedDocs: 9,
    upcomingDeadlines: ["K-1 Distribution - March 31"],
    notes: "General partner entity for fund management",
    taxId: "333333333",
    formationDate: "2023-01-30",
    registeredAgent: "Amanda Wilson",
  },
  {
    id: 7,
    entityName: "International Holdings Ltd",
    entityType: "Corp",
    rolePurpose: "Holding Co",
    jurisdiction: "Cayman",
    status: "Active",
    ownershipPercent: 50,
    parentEntity: "Global Trust Foundation",
    managerController: "David Brown",
    dateFormed: "2020-12-01",
    tags: ["Offshore", "International"],
    lastModified: "2023-12-01",
    linkedDocs: 11,
    upcomingDeadlines: ["Annual Filing - May 31"],
    notes: "International holding structure for global investments",
    taxId: "444444444",
    formationDate: "2020-12-01",
    registeredAgent: "David Brown",
  },
  {
    id: 8,
    entityName: "Family Office Trust",
    entityType: "Trust",
    rolePurpose: "Trust",
    jurisdiction: "Wyoming",
    status: "Active",
    ownershipPercent: undefined,
    parentEntity: undefined,
    managerController: "Jennifer Taylor",
    dateFormed: "2021-09-15",
    tags: ["Onshore", "Family Office", "Dynasty"],
    lastModified: "2024-01-08",
    linkedDocs: 18,
    upcomingDeadlines: ["Trust Review - April 15"],
    notes: "Dynasty trust for multi-generational wealth planning",
    taxId: "666666666",
    formationDate: "2021-09-15",
    registeredAgent: "Jennifer Taylor",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "Inactive":
      return "bg-yellow-100 text-yellow-800"
    case "Dissolved":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getEntityTypeColor = (type: string) => {
  switch (type) {
    case "LLC":
      return "bg-blue-100 text-blue-800"
    case "LP":
      return "bg-purple-100 text-purple-800"
    case "Trust":
      return "bg-green-100 text-green-800"
    case "Corp":
      return "bg-orange-100 text-orange-800"
    case "Foundation":
      return "bg-pink-100 text-pink-800"
    default:
      return "bg-gray-100 text-gray-800"
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
  return (
    <div className="space-y-4">
      <div className="text-center py-8 text-muted-foreground">
        <p>Table view for {activeTab}</p>
        <p className="text-sm">{data.length} items</p>
      </div>
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
  return (
    <div className="space-y-4">
      <div className="text-center py-8 text-muted-foreground">
        <p>Card view for {activeTab}</p>
        <p className="text-sm">{data.length} items</p>
      </div>
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
  return (
    <div className="space-y-4">
      <div className="text-center py-8 text-muted-foreground">
        <p>List view for {activeTab}</p>
        <p className="text-sm">{data.length} items</p>
      </div>
    </div>
  )
}

function getEntityTabData(activeTab: string, entity: Entity) {
  switch (activeTab) {
    case "emails":
      return [
        {
          id: 1,
          subject: "Investment Performance Update",
          from: "portfolio@company.com",
          date: "2 hours ago",
          status: "Unread",
          preview: "Quarterly performance report for your investment in " + entity.entityName,
          type: "received",
        },
        {
          id: 2,
          subject: "Valuation Update Required",
          from: "me@company.com",
          date: "1 day ago",
          status: "Sent",
          preview: "Please provide updated valuation for " + entity.entityName,
          type: "sent",
        },
        {
          id: 3,
          subject: "Due Diligence Documents",
          from: "legal@company.com",
          date: "3 days ago",
          status: "Read",
          preview: "Attached are the due diligence documents for " + entity.entityName,
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
          content: "Discussed investment opportunity and next steps for " + entity.entityName,
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
          name: entity.entityName,
          type: entity.entityType,
          description: "Company information and details",
          website: "https://company.com",
          industry: "Various",
          location: entity.jurisdiction,
        },
      ]
    default:
      return []
  }
}

function EntityNameCell({ entity }: { entity: Entity }) {
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
      return <EntityDetailsPanel entity={entity} isFullScreen={false} />
    }

    // For other tabs, return generic content similar to the dashboard
    const data = getEntityTabData(activeTab, entity)

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
    return <EntityDetailsPanel entity={entity} isFullScreen={isFullScreen} />
  }

  const customActions: React.ReactNode[] = []

  return (
    <MasterDrawer
      trigger={
        <Button variant="link" className="w-fit px-0 text-left text-foreground h-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-medium">
              {entity.entityName.charAt(0)}
            </div>
            <span className="font-medium">{entity.entityName}</span>
          </div>
        </Button>
      }
      title={entity.entityName}
      recordType="Entities"
      subtitle={`${entity.entityType} • ${entity.jurisdiction}`}
      tabs={tabs}
      detailsPanel={renderDetailsPanel}
      customActions={customActions}
    >
      {renderTabContent}
    </MasterDrawer>
  )
}

function EntityDetailsPanel({ entity, isFullScreen = false }: { entity: Entity; isFullScreen?: boolean }) {
  return (
    <div className="px-6 pt-2 pb-6">
      {/* Entity Details */}
      <div className="space-y-4">
        <div className="rounded-lg border border-muted bg-muted/10 p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Entity Name</Label>
                <p className="text-sm font-medium">{entity.entityName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Entity Type</Label>
                <p className="text-sm">{entity.entityType}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Tax ID / EIN</Label>
                <p className="text-sm">{entity.taxId}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Jurisdiction</Label>
                <p className="text-sm">{entity.jurisdiction}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Formation Date</Label>
                <p className="text-sm">{entity.formationDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Registered Agent</Label>
                <p className="text-sm">{entity.registeredAgent}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <FileTextIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Notes</Label>
                <p className="text-sm">{entity.notes}</p>
              </div>
            </div>
          </div>
        </div>

        <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
          Show all values
        </Button>

        {/* Activity Section - Always shown, regardless of mode */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-medium">Activity</h4>
            <Button variant="outline" size="sm">
              <PlusIcon className="h-4 w-4" />
              Add activity
            </Button>
          </div>
          <EntityActivityContent entity={entity} />
        </div>
      </div>
    </div>
  )
}

// Add the EntityActivityContent component
function EntityActivityContent({ entity }: { entity: Entity }) {
  const [expandedActivity, setExpandedActivity] = React.useState<number | null>(null);

  const activities = [
    {
      id: 1,
      type: "filing",
      actor: "Compliance Team",
      action: "submitted annual filing for",
      target: entity.entityName,
      timestamp: "2 weeks ago",
      date: "2025-01-15",
      details: {
        filingType: "Annual Report",
        jurisdiction: entity.jurisdiction,
        period: "2024",
        status: "Completed",
        confirmation: "AR-23456789",
        filingFee: "$350.00",
      },
    },
    {
      id: 2,
      type: "document",
      actor: "Legal Team",
      action: "updated operating agreement for",
      target: entity.entityName,
      timestamp: "1 month ago",
      date: "2024-12-20",
      details: {
        documentType: "Operating Agreement",
        version: "3.2",
        changes: "Updated member capital contributions and ownership percentages",
        approvedBy: "Board of Managers",
        effectiveDate: "2025-01-01",
      },
    },
    {
      id: 3,
      type: "tax",
      actor: "Tax Team",
      action: "prepared tax return for",
      target: entity.entityName,
      timestamp: "3 months ago",
      date: "2024-10-15",
      details: {
        taxYear: "2023",
        returnType: "Federal Income Tax",
        status: "Filed",
        filingDate: "2024-10-15",
        taxDue: "$42,850.00",
        preparedBy: "Smith & Associates LLP",
      },
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "filing":
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
      case "document":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case "tax":
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>;
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>;
    }
  };

  const formatActivityText = (activity: any) => {
    return (
      <span>
        <span className="font-medium">{activity.actor}</span> {activity.action}{" "}
        <span className="font-medium">{activity.target}</span>
      </span>
    );
  };

  const renderExpandedDetails = (activity: any) => {
    switch (activity.type) {
      case "filing":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Filing Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Filing Type:</span>{" "}
                  <span className="font-medium">{activity.details.filingType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Jurisdiction:</span>{" "}
                  <span>{activity.details.jurisdiction}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Period:</span>{" "}
                  <span>{activity.details.period}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <span>{activity.details.status}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Filing Fee</h5>
              <p className="text-sm text-muted-foreground">{activity.details.filingFee}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Confirmation Number</h5>
              <p className="text-sm text-muted-foreground">{activity.details.confirmation}</p>
            </div>
          </div>
        );
      case "document":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Document Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Document Type:</span>{" "}
                  <span>{activity.details.documentType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Version:</span>{" "}
                  <span>{activity.details.version}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Effective Date:</span>{" "}
                  <span>{activity.details.effectiveDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Approved By:</span>{" "}
                  <span>{activity.details.approvedBy}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Changes Made</h5>
              <p className="text-sm text-muted-foreground">{activity.details.changes}</p>
            </div>
          </div>
        );
      case "tax":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Tax Filing Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Tax Year:</span>{" "}
                  <span>{activity.details.taxYear}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Return Type:</span>{" "}
                  <span>{activity.details.returnType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <span>{activity.details.status}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Filing Date:</span>{" "}
                  <span>{activity.details.filingDate}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Tax Due</h5>
              <p className="text-sm text-muted-foreground">{activity.details.taxDue}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Prepared By</h5>
              <p className="text-sm text-muted-foreground">{activity.details.preparedBy}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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
  );
}

const columns: ColumnDef<Entity>[] = [
  {
    accessorKey: "entityName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2">
        Entity Name
        {column.getIsSorted() === "asc" ? (
          <SortAscIcon className="ml-2 h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <SortDescIcon className="ml-2 h-3 w-3" />
        ) : null}
      </Button>
    ),
    cell: ({ row }) => <EntityNameCell entity={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "entityType",
    header: "Entity Type",
    cell: ({ row }) => (
      <Badge className={`text-xs ${getEntityTypeColor(row.original.entityType)}`}>{row.original.entityType}</Badge>
    ),
  },
  {
    accessorKey: "rolePurpose",
    header: "Role / Purpose",
    cell: ({ row }) => <span className="text-sm">{row.original.rolePurpose}</span>,
  },
  {
    accessorKey: "jurisdiction",
    header: "Jurisdiction",
    cell: ({ row }) => <span className="text-sm">{row.original.jurisdiction}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={`text-xs ${getStatusColor(row.original.status)}`}>{row.original.status}</Badge>
    ),
  },
  {
    accessorKey: "ownershipPercent",
    header: "Ownership %",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.ownershipPercent ? `${row.original.ownershipPercent}%` : "—"}</span>
    ),
  },
  {
    accessorKey: "parentEntity",
    header: "Parent Entity",
    cell: ({ row }) => <span className="text-sm text-blue-600">{row.original.parentEntity || "—"}</span>,
  },
  {
    accessorKey: "managerController",
    header: "Manager / Controller",
    cell: ({ row }) => <span className="text-sm">{row.original.managerController}</span>,
  },
  {
    accessorKey: "dateFormed",
    header: "Date Formed",
    cell: ({ row }) => <span className="text-sm">{new Date(row.original.dateFormed).toLocaleDateString()}</span>,
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 max-w-[150px]">
        {row.original.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
            {tag}
          </Badge>
        ))}
        {row.original.tags.length > 2 && (
          <Badge variant="outline" className="text-xs px-1 py-0">
            +{row.original.tags.length - 2}
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "lastModified",
    header: "Last Modified",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{new Date(row.original.lastModified).toLocaleDateString()}</span>
    ),
  },
  {
    accessorKey: "linkedDocs",
    header: "# of Linked Docs",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <FolderIcon className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm font-medium">{row.original.linkedDocs}</span>
      </div>
    ),
  },
  {
    accessorKey: "upcomingDeadlines",
    header: "Upcoming Deadlines",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <CalendarIcon className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">
          {row.original.upcomingDeadlines.length > 0
            ? `${row.original.upcomingDeadlines.length} deadline${row.original.upcomingDeadlines.length > 1 ? "s" : ""}`
            : "None"}
        </span>
      </div>
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
          <DropdownMenuItem>Edit entity</DropdownMenuItem>
          <DropdownMenuItem>Add to structure</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function EntitiesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [addEntityOpen, setAddEntityOpen] = React.useState(false)

  const table = useReactTable({
    data: entitiesData,
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
      {/* Add Entity Dialog */}
      <AddEntityDialog open={addEntityOpen} onOpenChange={setAddEntityOpen} />

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entities..."
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
              <DropdownMenuItem>Active entities</DropdownMenuItem>
              <DropdownMenuItem>Inactive entities</DropdownMenuItem>
              <DropdownMenuItem>Holding companies</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Upcoming deadlines</DropdownMenuItem>
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
          <Button size="sm" onClick={() => setAddEntityOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Entity
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
