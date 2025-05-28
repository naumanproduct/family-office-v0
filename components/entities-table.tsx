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
  MapPinIcon,
  ScaleIcon,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"

// Import the AddEntityDialog
import { AddEntityDialog } from "./add-entity-dialog"
import { EmailsTable } from "./emails-table"
import { TasksTable } from "./tasks-table"
import { NotesTable } from "./notes-table"

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

function EntityNameCell({ entity }: { entity: Entity }) {
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("details")

  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "contacts", label: "Contacts", count: 5, icon: UsersIcon },
    { id: "emails", label: "Emails", count: 12, icon: MailIcon },
    { id: "tasks", label: "Tasks", count: 3, icon: CheckCircleIcon },
    { id: "notes", label: "Notes", count: 8, icon: FileTextIcon },
    { id: "meetings", label: "Meetings", count: 6, icon: CalendarIcon },
    { id: "files", label: "Files", count: 15, icon: FolderIcon },
    { id: "activity", label: "Activity", count: null, icon: CalendarIcon },
  ]

  const FullScreenContent = () => {
    const content = (
      <div className="fixed inset-0 z-[9999] bg-background">
        {/* Full Screen Header */}
        <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-background">
              Entities
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <MailIcon className="h-4 w-4" />
              Send notice
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
            <EntityDetailsPanel entity={entity} isFullScreen={true} />
          </div>

          {/* Right Panel - Main Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Record Header */}
            <div className="border-b bg-background px-6 py-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {entity.entityName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{entity.entityName}</h2>
                  <p className="text-sm text-muted-foreground">
                    {entity.entityType} • {entity.jurisdiction}
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
              <EntityTabContent activeTab={activeTab} entity={entity} />
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
              {entity.entityName.charAt(0)}
            </div>
            <span className="font-medium">{entity.entityName}</span>
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
              Entities
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsFullScreen(true)}>
              <ExpandIcon className="h-4 w-4" />
              Full screen
            </Button>
            <Button variant="outline" size="sm">
              <MailIcon className="h-4 w-4" />
              Send notice
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Record Header */}
          <div className="border-b bg-background px-6 py-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {entity.entityName.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{entity.entityName}</h2>
                <p className="text-sm text-muted-foreground">
                  {entity.entityType} • {entity.jurisdiction}
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
            <EntityTabContent activeTab={activeTab} entity={entity} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function EntityDetailsPanel({ entity, isFullScreen = false }: { entity: Entity; isFullScreen?: boolean }) {
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

      {/* Entity Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Entity Details</h4>

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
              <ScaleIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Entity Type</Label>
                <p className="text-sm">{entity.entityType}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Role / Purpose</Label>
                <p className="text-sm">{entity.rolePurpose}</p>
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
              <ScaleIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Badge className={`text-xs ${getStatusColor(entity.status)}`}>{entity.status}</Badge>
              </div>
            </div>

            {entity.ownershipPercent && (
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Ownership %</Label>
                  <p className="text-sm">{entity.ownershipPercent}%</p>
                </div>
              </div>
            )}

            {entity.parentEntity && (
              <div className="flex items-center gap-2">
                <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Parent Entity</Label>
                  <p className="text-sm text-blue-600">{entity.parentEntity}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Manager / Controller</Label>
                <p className="text-sm">{entity.managerController}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Date Formed</Label>
                <p className="text-sm">{new Date(entity.dateFormed).toLocaleDateString()}</p>
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

        {/* Workflows Section */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-medium">Workflows</h4>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-muted">
              <button onClick={() => {}} className="flex w-full items-center justify-between p-3 text-left">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-100"></div>
                  <span className="font-medium">Entity Compliance & Legal Tasks</span>
                  <Badge variant="outline" className="ml-2">
                    In Progress
                  </Badge>
                </div>
                <ChevronDownIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-lg border border-muted">
              <button onClick={() => {}} className="flex w-full items-center justify-between p-3 text-left">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-100"></div>
                  <span className="font-medium">Tax Document Collection & Filing</span>
                  <Badge variant="outline" className="ml-2">
                    Completed
                  </Badge>
                </div>
                <ChevronDownIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EntityTabContent({ activeTab, entity }: { activeTab: string; entity: Entity }) {
  if (activeTab === "details") {
    return <EntityDetailsPanel entity={entity} isFullScreen={false} />
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
        <div className="text-center py-8 text-muted-foreground">
          <p>No contacts found for {entity.entityName}</p>
          <p className="text-sm">Add some contacts to get started</p>
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
          No {activeTab} found for {entity.entityName}
        </p>
        <p className="text-sm">Add some {activeTab} to get started</p>
      </div>
    </div>
  )
}

const columns: ColumnDef<Entity>[] = [
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
  const [rowSelection, setRowSelection] = React.useState({})
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
