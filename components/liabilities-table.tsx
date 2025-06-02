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
  FileTextIcon,
  MailIcon,
  CheckCircleIcon,
  CalendarIcon,
  FolderIcon,
  UsersIcon,
  BuildingIcon,
  DollarSignIcon,
  TrendingUpIcon,
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
import { Card, CardContent } from "@/components/ui/card"
import { MasterDrawer } from "./master-drawer"
import { Label } from "@/components/ui/label"
import { AddLiabilityDialog } from "./add-liability-dialog"

export const liabilitySchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  category: z.string(),
  currentBalance: z.string(),
  originalAmount: z.string(),
  interestRate: z.string(),
  maturityDate: z.string(),
  nextPayment: z.string(),
  paymentAmount: z.string(),
  entity: z.string(),
  status: z.string(),
  lender: z.string(),
  collateral: z.string(),
})

export type Liability = z.infer<typeof liabilitySchema>

export const liabilitiesData: Liability[] = [
  {
    id: 1,
    name: "Credit Facility - Fund Operations",
    type: "Credit Line",
    category: "Operating Debt",
    currentBalance: "$12.5M",
    originalAmount: "$25.0M",
    interestRate: "4.25%",
    maturityDate: "2026-12-31",
    nextPayment: "2024-08-15",
    paymentAmount: "$44,270",
    entity: "Meridian Capital Fund III",
    status: "Current",
    lender: "First National Bank",
    collateral: "Fund Assets",
  },
  {
    id: 2,
    name: "Acquisition Financing - TechFlow",
    type: "Term Loan",
    category: "Investment Debt",
    currentBalance: "$8.2M",
    originalAmount: "$10.0M",
    interestRate: "6.75%",
    maturityDate: "2027-08-15",
    nextPayment: "2024-08-01",
    paymentAmount: "$92,150",
    entity: "Innovation Ventures LLC",
    status: "Current",
    lender: "Capital Investment Bank",
    collateral: "TechFlow Equity",
  },
  {
    id: 3,
    name: "Bridge Loan - Real Estate Fund",
    type: "Bridge Financing",
    category: "Development Debt",
    currentBalance: "$35.8M",
    originalAmount: "$40.0M",
    interestRate: "8.50%",
    maturityDate: "2025-03-31",
    nextPayment: "2024-08-10",
    paymentAmount: "$253,833",
    entity: "Real Estate Investment Trust",
    status: "Current",
    lender: "Development Finance Corp",
    collateral: "Property Portfolio",
  },
  {
    id: 4,
    name: "Subscription Credit Line",
    type: "Credit Line",
    category: "Capital Call Facility",
    currentBalance: "$0.0M",
    originalAmount: "$50.0M",
    interestRate: "3.85%",
    maturityDate: "2025-12-31",
    nextPayment: "N/A",
    paymentAmount: "N/A",
    entity: "Global Growth Partners",
    status: "Undrawn",
    lender: "International Credit Bank",
    collateral: "LP Commitments",
  },
  {
    id: 5,
    name: "Equipment Financing",
    type: "Equipment Loan",
    category: "Asset-Based Debt",
    currentBalance: "$2.1M",
    originalAmount: "$3.5M",
    interestRate: "5.25%",
    maturityDate: "2026-06-30",
    nextPayment: "2024-08-05",
    paymentAmount: "$18,750",
    entity: "Sustainable Infrastructure Fund",
    status: "Current",
    lender: "Equipment Finance Solutions",
    collateral: "Infrastructure Equipment",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Current":
      return "bg-green-100 text-green-800"
    case "Past Due":
      return "bg-red-100 text-red-800"
    case "Undrawn":
      return "bg-blue-100 text-blue-800"
    case "Matured":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function LiabilityNameCell({ liability }: { liability: Liability }) {
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "emails", label: "Emails", count: 2, icon: MailIcon },
    { id: "tasks", label: "Tasks", count: 1, icon: CheckCircleIcon },
    { id: "notes", label: "Notes", count: 1, icon: FileTextIcon },
    { id: "meetings", label: "Meetings", count: 3, icon: CalendarIcon },
    { id: "files", label: "Files", count: 4, icon: FolderIcon },
    { id: "team", label: "Team", count: 3, icon: UsersIcon },
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
      return <LiabilityDetailsPanel liability={liability} isFullScreen={false} />
    }

    // For other tabs, return generic content similar to assets
    const data = getLiabilityTabData(activeTab, liability)

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
    return <LiabilityDetailsPanel liability={liability} isFullScreen={isFullScreen} />
  }

  const customActions = [
    <Button key="payment" variant="outline" size="sm">
      <DollarSignIcon className="h-4 w-4" />
      Make Payment
    </Button>,
  ]

  return (
    <MasterDrawer
      trigger={
        <Button variant="link" className="w-fit px-0 text-left text-foreground h-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-medium">
              {liability.name.charAt(0)}
            </div>
            <span className="font-medium">{liability.name}</span>
          </div>
        </Button>
      }
      title={liability.name}
      recordType="Liabilities"
      subtitle={`${liability.type} • ${liability.category}`}
      tabs={tabs}
      detailsPanel={renderDetailsPanel}
      customActions={customActions}
    >
      {renderTabContent}
    </MasterDrawer>
  )
}

function getLiabilityTabData(activeTab: string, liability: Liability) {
  switch (activeTab) {
    case "emails":
      return [
        {
          id: 1,
          subject: "Payment Reminder",
          from: "lender@bank.com",
          date: "1 day ago",
          status: "Unread",
          preview: "Upcoming payment due for " + liability.name,
          type: "received",
        },
        {
          id: 2,
          subject: "Payment Confirmation",
          from: "me@company.com",
          date: "3 days ago",
          status: "Sent",
          preview: "Payment processed for " + liability.name,
          type: "sent",
        },
      ]
    case "tasks":
      return [
        {
          id: 1,
          title: "Process monthly payment",
          priority: "High",
          status: "pending",
          assignee: "You",
          dueDate: "Tomorrow",
          description: "Process monthly payment for " + liability.name,
        },
      ]
    case "notes":
      return [
        {
          id: 1,
          title: "Refinancing opportunity",
          date: "1 week ago",
          content: `Potential to refinance ${liability.name} at lower rate.`,
          tags: ["Refinancing", "Cost Savings"],
        },
      ]
    case "meetings":
      return [
        {
          id: 1,
          title: "Lender Review Meeting",
          date: "Next week",
          time: "10:00 AM - 11:00 AM",
          status: "Scheduled",
          location: "Conference Room B",
          attendees: 3,
          description: `Annual review meeting for ${liability.name}.`,
        },
      ]
    case "files":
      return [
        {
          id: 1,
          name: "Loan_Agreement.pdf",
          size: "3.2 MB",
          uploadedBy: "Legal Team",
          uploadedDate: "1 week ago",
          type: "pdf",
          description: "Original loan agreement and terms.",
        },
      ]
    case "team":
      return [
        {
          id: 1,
          name: "Michael Chen",
          role: "Debt Manager",
          email: "michael.chen@company.com",
          phone: "+1 (555) 987-6543",
          department: "Finance",
          joinDate: "2022-08-20",
          status: "Active",
        },
      ]
    default:
      return []
  }
}

function LiabilityDetailsPanel({ liability, isFullScreen = false }: { liability: Liability; isFullScreen?: boolean }) {
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

      {/* Liability Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Liability Details</h4>

        <div className="rounded-lg border border-muted bg-muted/10 p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Liability Name</Label>
                <p className="text-sm font-medium">{liability.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Type</Label>
                <p className="text-sm">{liability.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Category</Label>
                <p className="text-sm">{liability.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Current Balance</Label>
                <p className="text-sm font-medium">{liability.currentBalance}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Original Amount</Label>
                <p className="text-sm">{liability.originalAmount}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Interest Rate</Label>
                <p className="text-sm">{liability.interestRate}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Maturity Date</Label>
                <p className="text-sm">{liability.maturityDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Lender</Label>
                <p className="text-sm">{liability.lender}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Entity</Label>
                <p className="text-sm">{liability.entity}</p>
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
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              className={
                activeTab === "tasks" || activeTab === "notes" || activeTab === "meetings" || activeTab === "emails"
                  ? "cursor-pointer hover:bg-muted/50"
                  : ""
              }
              onClick={() => {
                if (activeTab === "tasks") {
                  onTaskClick?.(item)
                } else if (activeTab === "notes") {
                  onNoteClick?.(item)
                } else if (activeTab === "meetings") {
                  onMeetingClick?.(item)
                } else if (activeTab === "emails") {
                  onEmailClick?.(item)
                }
              }}
            >
              <TableCell>{item.title || item.subject || item.name}</TableCell>
              <TableCell>{item.date || item.uploadedDate}</TableCell>
              <TableCell>
                <Badge variant="outline">{item.status || item.priority}</Badge>
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((item) => (
        <Card
          key={item.id}
          className={
            activeTab === "tasks" || activeTab === "notes" || activeTab === "meetings" || activeTab === "emails"
              ? "cursor-pointer hover:bg-muted/50"
              : ""
          }
          onClick={() => {
            if (activeTab === "tasks") {
              onTaskClick?.(item)
            } else if (activeTab === "notes") {
              onNoteClick?.(item)
            } else if (activeTab === "meetings") {
              onMeetingClick?.(item)
            } else if (activeTab === "emails") {
              onEmailClick?.(item)
            }
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium">{item.title || item.subject || item.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{item.description || item.preview || item.content}</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{item.date || item.uploadedDate}</span>
                  {item.size && <span>• {item.size}</span>}
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
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div
          key={item.id}
          className={`rounded-lg border p-4 ${activeTab === "tasks" || activeTab === "notes" || activeTab === "meetings" || activeTab === "emails" ? "cursor-pointer hover:bg-muted/50" : ""}`}
          onClick={() => {
            if (activeTab === "tasks") {
              onTaskClick?.(item)
            } else if (activeTab === "notes") {
              onNoteClick?.(item)
            } else if (activeTab === "meetings") {
              onMeetingClick?.(item)
            } else if (activeTab === "emails") {
              onEmailClick?.(item)
            }
          }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.title || item.subject || item.name}</p>
                  {item.assignee && <p className="text-xs text-muted-foreground">Assigned to: {item.assignee}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{item.date || item.uploadedDate}</p>
                  {item.status && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {item.status}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{item.description || item.preview || item.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const columns: ColumnDef<Liability>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2">
        Liability Name
        {column.getIsSorted() === "asc" ? (
          <SortAscIcon className="ml-2 h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <SortDescIcon className="ml-2 h-3 w-3" />
        ) : null}
      </Button>
    ),
    cell: ({ row }) => <LiabilityNameCell liability={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <span className="text-sm">{row.original.category}</span>,
  },
  {
    accessorKey: "currentBalance",
    header: "Current Balance",
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.currentBalance}</span>,
  },
  {
    accessorKey: "interestRate",
    header: "Interest Rate",
    cell: ({ row }) => <span className="text-sm">{row.original.interestRate}</span>,
  },
  {
    accessorKey: "maturityDate",
    header: "Maturity Date",
    cell: ({ row }) => <span className="text-sm">{row.original.maturityDate}</span>,
  },
  {
    accessorKey: "nextPayment",
    header: "Next Payment",
    cell: ({ row }) => (
      <div>
        <p className="text-sm">{row.original.nextPayment}</p>
        <p className="text-xs text-muted-foreground">{row.original.paymentAmount}</p>
      </div>
    ),
  },
  {
    accessorKey: "entity",
    header: "Entity",
    cell: ({ row }) => <span className="text-sm">{row.original.entity}</span>,
  },
  {
    accessorKey: "lender",
    header: "Lender",
    cell: ({ row }) => <span className="text-sm">{row.original.lender}</span>,
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
          <DropdownMenuItem>Edit liability</DropdownMenuItem>
          <DropdownMenuItem>Make payment</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View payment history</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function LiabilitiesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)

  const table = useReactTable({
    data: liabilitiesData,
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
              placeholder="Search liabilities..."
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
              <DropdownMenuItem>Current liabilities</DropdownMenuItem>
              <DropdownMenuItem>Past due</DropdownMenuItem>
              <DropdownMenuItem>Maturing soon</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Credit lines</DropdownMenuItem>
              <DropdownMenuItem>Term loans</DropdownMenuItem>
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
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Liability
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
                  className="h-12 cursor-pointer hover:bg-muted/50"
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

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} liability(s) total.
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
      <AddLiabilityDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />
    </div>
  )
}
