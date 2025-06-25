"use client"

import * as React from "react"
import {
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
import { ChevronDownIcon, ColumnsIcon, FilterIcon, PlusIcon, SearchIcon } from "lucide-react"
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

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuDraggableItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddAssetDialog } from "./add-asset-dialog"
import { MasterDrawer } from "./master-drawer"
import { FileTextIcon,
  FileIcon, MailIcon, CheckCircleIcon, StickyNoteIcon, CalendarIcon, FolderIcon, UsersIcon, BuildingIcon, LandmarkIcon, BarChartIcon, TrendingUpIcon } from "lucide-react"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { UnifiedDetailsPanel } from "@/components/shared/unified-details-panel"
import { buildStandardDetailSections } from "@/components/shared/detail-section-builder"
import { UnifiedActivitySection, type ActivityItem } from "@/components/shared/unified-activity-section"

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

interface AssetsTableProps {
  onAssetClick: (asset: Asset) => void
}

function AssetNameCell({ asset }: { asset: Asset }) {
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "notes", label: "Notes", count: 1, icon: FileIcon },
    { id: "files", label: "Files", count: 4, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 3, icon: CheckCircleIcon },
    { id: "emails", label: "Emails", count: 2, icon: MailIcon },
    { id: "meetings", label: "Meetings", count: 1, icon: CalendarIcon },
    { id: "team", label: "People", count: 2, icon: UsersIcon },
  ]

  const getAssetTabData = (activeTab: string) => {
    switch (activeTab) {
      case "tasks":
        return [
          { id: 1, title: "Quarterly valuation", priority: "High", status: "Pending", assignee: "You", dueDate: "Next week" },
        ]
      case "emails":
        return [
          { id: 1, subject: "Capital Call Notice", from: "fund@gp.com", date: "Today", status: "Unread", preview: "Please see attached capital call" },
        ]
      case "notes":
        return [
          { id: 1, title: "Catch-up call summary", author: "Analyst", date: "Yesterday", content: "Discussed KPIs…" },
        ]
      case "meetings":
        return [
          { id: 1, title: "Board Meeting", date: "Tomorrow", time: "10:00 AM", attendees: ["CFO"], status: "Scheduled" },
        ]
      case "files":
        return [
          { id: 1, name: "Subscription Agreement.pdf", uploadedBy: "Legal", uploadedDate: "Last month", size: "2 MB", type: "PDF" },
        ]
      case "team":
        return [
          { id: 1, name: "Sarah Johnson", role: "Portfolio Manager", email: "sarah@fund.com" },
        ]
      default:
        return []
    }
  }

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
    const data = getAssetTabData(activeTab)
    return (
      <TabContentRenderer activeTab={activeTab} viewMode={viewMode} data={data} onTaskClick={setSelectedTask} onNoteClick={setSelectedNote} onMeetingClick={setSelectedMeeting} onEmailClick={setSelectedEmail} />
    )
  }

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
      recordType="Investment"
      subtitle={asset.type}
      tabs={tabs}
      detailsPanel={(isFullScreen) => <AssetDetailsPanel asset={asset} isFullScreen={isFullScreen} />}
    >
      {renderTabContent}
    </MasterDrawer>
  )
}

export function AssetsTable({ onAssetClick }: AssetsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [isAddAssetDialogOpen, setIsAddAssetDialogOpen] = React.useState(false)
  const [columnOrder, setColumnOrder] = React.useState<string[]>([])
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))

  const table = useReactTable({
    data: assetsData,
    columns: [
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
    ],
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
    },
  })

  // Initialize column order from table columns
  React.useEffect(() => {
    const visibleColumns = table
      .getAllColumns()
      .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
      .map((column) => column.id)

    if (columnOrder.length === 0 && visibleColumns.length > 0) {
      setColumnOrder(visibleColumns)
    }
  }, [table.getAllColumns(), columnOrder])

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

  const columns = React.useMemo(() => table.getAllColumns(), [table.getAllColumns()])

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
              <DropdownMenuItem>Liquid assets</DropdownMenuItem>
              <DropdownMenuItem>Alternative investments</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>High performance</DropdownMenuItem>
              <DropdownMenuItem>Recently acquired</DropdownMenuItem>
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
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={columnOrder} strategy={verticalListSortingStrategy}>
                  {columnOrder.map((columnId) => {
                    const column = table.getColumn(columnId)
                    if (!column) return null

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
                    )
                  })}
                </SortableContext>
              </DndContext>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" onClick={() => setIsAddAssetDialogOpen(true)}>
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

      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredRowModel().rows.length} asset(s) total.
      </div>

      <AddAssetDialog isOpen={isAddAssetDialogOpen} onClose={() => setIsAddAssetDialogOpen(false)} />
    </div>
  )
}

// -------- Details Panel helpers --------
function AssetDetailsPanel({ asset, isFullScreen = false }: { asset: Asset; isFullScreen?: boolean }) {
  // Mock related data (examples)
  const relatedData = {
    entities: [
      { id: 1, name: asset.entity, type: "Fund" },
    ],
    people: [
      { id: 1, name: "Sarah Johnson", role: "Portfolio Manager" },
      { id: 2, name: "Tom Becker", role: "Analyst" },
    ],
    opportunities: [
      { id: 1, name: "Follow-on Investment", status: "Discussion" },
    ],
  }

  // Mock activity content
  const activities: ActivityItem[] = [
    {
      id: 1,
      type: "valuation",
      actor: "Analyst Team",
      action: "updated valuation",
      target: "Current Value",
      objectType: "field",
      url: "#valuation-history", // hypothetical anchor or modal link
      timestamp: "2 days ago",
      date: "2025-06-21",
    },
    {
      id: 2,
      type: "meeting",
      actor: "Portfolio Manager",
      action: "held board meeting",
      target: "Q2 Performance Review",
      objectType: "meeting",
      url: "/meetings/2001",
      timestamp: "1 week ago",
      date: "2025-06-15",
    },
  ]

  // Handlers (stubbed)
  const navigateToRecord = (recordType: string, id: number) => {
    console.log(`Navigate to ${recordType} ${id}`)
  }
  const handleAddRecord = (sectionId: string) => {
    console.log(`Add record to ${sectionId}`)
  }
  const handleUnlinkRecord = (sectionId: string, id: number) => {
    console.log(`Unlink ${sectionId} ${id}`)
  }

  const infoFields = [
    { label: "Name", value: asset.name },
    { label: "Type", value: asset.type },
    { label: "Category", value: asset.category },
    { label: "Entity", value: asset.entity },
    { label: "Acquisition Date", value: asset.acquisitionDate },
    { label: "Current Value", value: asset.currentValue },
    { label: "Original Cost", value: asset.originalCost },
    { label: "Unrealized Gain", value: asset.unrealizedGain },
    { label: "% Gain", value: `${asset.percentageGain}%` },
    { label: "Last Valuation", value: asset.lastValuation },
    { label: "Sector", value: asset.sector },
    { label: "Geography", value: asset.geography },
    { label: "Status", value: asset.status },
  ]

  // Mock companies based on entity or asset name
  const companies = [
    {
      id: 1,
      name: asset.entity || asset.name.split(" ")[0] + " Corp",
      type: "Portfolio Company",
    },
  ]

  const sections = buildStandardDetailSections({
    infoTitle: "Asset Information",
    infoIcon: <BarChartIcon className="h-4 w-4 text-muted-foreground" />,
    infoFields,
    companies,
    people: relatedData.people,
    entities: relatedData.entities,
    investments: [],
    opportunities: relatedData.opportunities,
  })

  return (
    <UnifiedDetailsPanel
      sections={sections}
      isFullScreen={isFullScreen}
      onNavigateToRecord={navigateToRecord}
      onAddRecord={handleAddRecord}
      onUnlinkRecord={handleUnlinkRecord}
      activityContent={<UnifiedActivitySection activities={activities} />}
    />
  )
}
