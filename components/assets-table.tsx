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
  BuildingIcon,
  FileTextIcon,
  CalendarIcon,
  FolderIcon,
  CheckCircleIcon,
  DollarSignIcon,
  TrendingUpIcon,
  BarChart3Icon,
  MailIcon,
  UsersIcon,
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
import { Label } from "@/components/ui/label"
import { MasterDrawer } from "./master-drawer"

export const assetSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  category: z.string(),
  currentValue: z.string(),
  originalCost: z.string(),
  unrealizedGain: z.string(),
  percentageGain: z.number(),
  acquisitionDate: z.string(),
  lastValuation: z.string(),
  entity: z.string(),
  status: z.string(),
  sector: z.string(),
  geography: z.string(),
})

export type Asset = z.infer<typeof assetSchema>

export const assetsData: Asset[] = [
  {
    id: 1,
    name: "TechFlow Ventures Series C",
    type: "Equity Investment",
    category: "Private Equity",
    currentValue: "$18.5M",
    originalCost: "$15.0M",
    unrealizedGain: "$3.5M",
    percentageGain: 23.3,
    acquisitionDate: "2023-08-15",
    lastValuation: "2024-06-30",
    entity: "Meridian Capital Fund III",
    status: "Active",
    sector: "Enterprise Software",
    geography: "North America",
  },
  {
    id: 2,
    name: "MedInnovate Seed Round",
    type: "Equity Investment",
    category: "Venture Capital",
    currentValue: "$4.2M",
    originalCost: "$3.0M",
    unrealizedGain: "$1.2M",
    percentageGain: 40.0,
    acquisitionDate: "2024-01-30",
    lastValuation: "2024-06-30",
    entity: "Innovation Ventures LLC",
    status: "Active",
    sector: "Healthcare Technology",
    geography: "North America",
  },
  {
    id: 3,
    name: "PayFlow Solutions Growth",
    type: "Equity Investment",
    category: "Growth Capital",
    currentValue: "$22.8M",
    originalCost: "$25.0M",
    unrealizedGain: "-$2.2M",
    percentageGain: -8.8,
    acquisitionDate: "2023-10-15",
    lastValuation: "2024-06-30",
    entity: "Global Growth Partners",
    status: "Under Review",
    sector: "Financial Technology",
    geography: "Global",
  },
  {
    id: 4,
    name: "Urban Development Fund II",
    type: "Fund Investment",
    category: "Real Estate",
    currentValue: "$85.6M",
    originalCost: "$80.0M",
    unrealizedGain: "$5.6M",
    percentageGain: 7.0,
    acquisitionDate: "2022-09-30",
    lastValuation: "2024-03-31",
    entity: "Real Estate Investment Trust",
    status: "Active",
    sector: "Real Estate",
    geography: "North America",
  },
  {
    id: 5,
    name: "Green Energy Infrastructure",
    type: "Direct Investment",
    category: "Infrastructure",
    currentValue: "$45.2M",
    originalCost: "$40.0M",
    unrealizedGain: "$5.2M",
    percentageGain: 13.0,
    acquisitionDate: "2023-03-15",
    lastValuation: "2024-06-30",
    entity: "Sustainable Infrastructure Fund",
    status: "Active",
    sector: "Clean Energy",
    geography: "Europe",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "Under Review":
      return "bg-yellow-100 text-yellow-800"
    case "Exited":
      return "bg-blue-100 text-blue-800"
    case "Written Off":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getGainColor = (percentage: number) => {
  if (percentage > 0) return "text-green-600"
  if (percentage < 0) return "text-red-600"
  return "text-gray-600"
}

function AssetNameCell({ asset }: { asset: Asset }) {
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "emails", label: "Emails", count: 3, icon: MailIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: CheckCircleIcon },
    { id: "notes", label: "Notes", count: 1, icon: FileTextIcon },
    { id: "meetings", label: "Meetings", count: 4, icon: CalendarIcon },
    { id: "files", label: "Files", count: 5, icon: FolderIcon },
    { id: "team", label: "Team", count: 6, icon: UsersIcon },
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
      return <AssetDetailsPanel asset={asset} isFullScreen={false} />
    }

    if (activeTab === "performance") {
      return <AssetTabContent activeTab={activeTab} asset={asset} />
    }

    // For other tabs, return generic content similar to the dashboard
    const data = getAssetTabData(activeTab, asset)

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
    return <AssetDetailsPanel asset={asset} isFullScreen={isFullScreen} />
  }

  const customActions = [
    <Button key="performance" variant="outline" size="sm">
      <BarChart3Icon className="h-4 w-4" />
      Performance
    </Button>,
  ]

  return (
    <MasterDrawer
      trigger={
        <Button variant="link" className="w-fit px-0 text-left text-foreground h-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-medium">
              {asset.name.charAt(0)}
            </div>
            <span className="font-medium">{asset.name}</span>
          </div>
        </Button>
      }
      title={asset.name}
      recordType="Assets"
      subtitle={`${asset.type} • ${asset.category}`}
      tabs={tabs}
      detailsPanel={renderDetailsPanel}
      customActions={customActions}
    >
      {renderTabContent}
    </MasterDrawer>
  )
}

function getAssetTabData(activeTab: string, asset: Asset) {
  switch (activeTab) {
    case "emails":
      return [
        {
          id: 1,
          subject: "Investment Performance Update",
          from: "portfolio@company.com",
          date: "2 hours ago",
          status: "Unread",
          preview: "Quarterly performance report for your investment in " + asset.name,
          type: "received",
        },
        {
          id: 2,
          subject: "Valuation Update Required",
          from: "me@company.com",
          date: "1 day ago",
          status: "Sent",
          preview: "Please provide updated valuation for " + asset.name,
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
          content: `Strong performance in ${asset.sector} sector. Key growth drivers remain intact.`,
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
          description: `Quarterly review of ${asset.name} performance.`,
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

function AssetDetailsPanel({ asset, isFullScreen = false }: { asset: Asset; isFullScreen?: boolean }) {
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

      {/* Asset Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Asset Details</h4>

        <div className="rounded-lg border border-muted bg-muted/10 p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Asset Name</Label>
                <p className="text-sm font-medium">{asset.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Type</Label>
                <p className="text-sm">{asset.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Category</Label>
                <p className="text-sm">{asset.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Current Value</Label>
                <p className="text-sm">{asset.currentValue}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Original Cost</Label>
                <p className="text-sm">{asset.originalCost}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Unrealized Gain/Loss</Label>
                <p className={`text-sm ${getGainColor(asset.percentageGain)}`}>
                  {asset.unrealizedGain} ({asset.percentageGain > 0 ? "+" : ""}
                  {asset.percentageGain}%)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Acquisition Date</Label>
                <p className="text-sm">{asset.acquisitionDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Entity</Label>
                <p className="text-sm">{asset.entity}</p>
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

function AssetTabContent({ activeTab, asset }: { activeTab: string; asset: Asset }) {
  if (activeTab === "details") {
    return <AssetDetailsPanel asset={asset} isFullScreen={false} />
  }

  if (activeTab === "performance") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Performance</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              1Y
            </Button>
            <Button variant="outline" size="sm">
              3Y
            </Button>
            <Button variant="outline" size="sm">
              5Y
            </Button>
            <Button variant="outline" size="sm">
              All
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Performance chart would appear here
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total Return</div>
              <div className={`text-2xl font-semibold ${getGainColor(asset.percentageGain)}`}>
                {asset.percentageGain > 0 ? "+" : ""}
                {asset.percentageGain}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">IRR</div>
              <div className="text-2xl font-semibold">12.4%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">MOIC</div>
              <div className="text-2xl font-semibold">1.8x</div>
            </CardContent>
          </Card>
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
          <PlusIcon className="h-4 w-4 mr-2" />
          Add {activeTab.slice(0, -1)}
        </Button>
      </div>
      <div className="text-center py-8 text-muted-foreground">
        <p>
          No {activeTab} found for {asset.name}
        </p>
        <p className="text-sm">Add some {activeTab} to get started</p>
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

const columns: ColumnDef<Asset>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <AssetNameCell asset={row.original} />,
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "currentValue",
    header: "Current Value",
  },
  {
    accessorKey: "originalCost",
    header: "Original Cost",
  },
  {
    accessorKey: "unrealizedGain",
    header: "Unrealized Gain",
  },
  {
    accessorKey: "percentageGain",
    header: "Percentage Gain",
    cell: ({ row }) => {
      const percentage = row.original.percentageGain
      const gainColor = getGainColor(percentage)
      return (
        <span className={gainColor}>
          {percentage > 0 ? "+" : ""}
          {percentage}%
        </span>
      )
    },
  },
  {
    accessorKey: "acquisitionDate",
    header: "Acquisition Date",
  },
  {
    accessorKey: "lastValuation",
    header: "Last Valuation",
  },
  {
    accessorKey: "entity",
    header: "Entity",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      const statusColor = getStatusColor(status)
      return <Badge className={statusColor}>{status}</Badge>
    },
  },
  {
    accessorKey: "sector",
    header: "Sector",
  },
  {
    accessorKey: "geography",
    header: "Geography",
  },
]

export function AssetsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data: assetsData,
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
              placeholder="Search assets..."
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
              <DropdownMenuItem>Active assets</DropdownMenuItem>
              <DropdownMenuItem>High performers</DropdownMenuItem>
              <DropdownMenuItem>Under review</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Private equity</DropdownMenuItem>
              <DropdownMenuItem>Venture capital</DropdownMenuItem>
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
            Add Asset
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
