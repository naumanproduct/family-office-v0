"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
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
  CheckCircle2Icon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  GripVerticalIcon,
  LoaderIcon,
  MoreVerticalIcon,
  PlusIcon,
  BriefcaseIcon,
  BuildingIcon,
  FileTextIcon,
  FileIcon,
  MailIcon,
  UserCircleIcon,
  ExpandIcon,
  LayoutGridIcon,
  ListIcon,
  TableIcon,
  PhoneIcon,
  CalendarIcon,
  FolderIcon,
  XIcon,
  UsersIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  ClipboardIcon,
  DotsHorizontalIcon,
  EyeNoneIcon,
  FilterIcon,
  ListFilterIcon,
  MoreHorizontalIcon,
  SettingsIcon,
  SlidersHorizontalIcon,
  TrashIcon,
} from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ChartConfig } from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuDraggableItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTasks } from "@/components/tasks-table"

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: "Header",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Section Type",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3">
        {row.original.status === "Done" ? (
          <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
        ) : (
          <LoaderIcon />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "target",
    header: () => <div className="w-full text-right">Target</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: "Done",
            error: "Error",
          })
        }}
      >
        <Label htmlFor={`${row.original.id}-target`} className="sr-only">
          Target
        </Label>
        <Input
          className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background"
          defaultValue={row.original.target}
          id={`${row.original.id}-target`}
        />
      </form>
    ),
  },
  {
    accessorKey: "limit",
    header: () => <div className="w-full text-right">Limit</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: "Done",
            error: "Error",
          })
        }}
      >
        <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
          Limit
        </Label>
        <Input
          className="h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background"
          defaultValue={row.original.limit}
          id={`${row.original.id}-limit`}
        />
      </form>
    ),
  },
  {
    accessorKey: "reviewer",
    header: "Reviewer",
    cell: ({ row }) => {
      const isAssigned = row.original.reviewer !== "Assign reviewer"

      if (isAssigned) {
        return row.original.reviewer
      }

      return (
        <>
          <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
            Reviewer
          </Label>
          <Select>
            <SelectTrigger className="h-8 w-40" id={`${row.original.id}-reviewer`}>
              <SelectValue placeholder="Assign reviewer" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
              <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
            </SelectContent>
          </Select>
        </>
      )
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  )
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumn?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
      <div className="flex-1 text-sm text-muted-foreground py-4">
        {table.getFilteredRowModel().rows.length} row(s) total.
      </div>
    </div>
  )
}

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("details")
  const [viewMode, setViewMode] = React.useState<"card" | "list" | "table">("table")

  const tabs = [
    ...(!isFullScreen ? [{ id: "details", label: "Details", count: null, icon: FileTextIcon }] : []),
    { id: "notes", label: "Notes", count: 1, icon: FileIcon },
    { id: "files", label: "Files", count: 5, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: CheckCircleIcon },
    { id: "emails", label: "Emails", count: 3, icon: MailIcon },
    { id: "meetings", label: "Meetings", count: 4, icon: CalendarIcon },
    { id: "team", label: "Team", count: 6, icon: UsersIcon },
    { id: "company", label: "Company", count: null, icon: BuildingIcon },
  ]

  React.useEffect(() => {
    if (isFullScreen && activeTab === "details") {
      // Switch to first available tab when going fullscreen
      const firstTab = tabs.find(tab => tab.id !== "details");
      if (firstTab) {
        setActiveTab(firstTab.id);
      }
    }
  }, [isFullScreen, tabs])

  // Lock body scroll when full screen is active
  React.useEffect(() => {
    if (isFullScreen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Add styles to prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position and remove styles
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      };
    }
  }, [isFullScreen]);

  const ViewModeSelector = () => {
    if (activeTab === "details") return null

    return (
      <div className="flex items-center gap-1 rounded-lg border p-1">
        <Button
          variant={viewMode === "card" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setViewMode("card")}
          className="h-7 px-2"
        >
          <LayoutGridIcon className="h-3 w-3" />
        </Button>
        <Button
          variant={viewMode === "list" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setViewMode("list")}
          className="h-7 px-2"
        >
          <ListIcon className="h-3 w-3" />
        </Button>
        <Button
          variant={viewMode === "table" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setViewMode("table")}
          className="h-7 px-2"
        >
          <TableIcon className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  const FullScreenContent = () => {
    const content = (
      <>
        {/* Semi-transparent overlay */}
        <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" onClick={() => setIsFullScreen(false)} />
        
        {/* Main container with rounded corners and spacing */}
        <div className="fixed inset-4 z-[9999] bg-background rounded-xl shadow-xl overflow-hidden">
          {/* Full Screen Header */}
          <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-background">
                {item.header}
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
          <div className="flex h-[calc(100%-73px)]">
            {/* Left Panel - Details (Persistent) */}
            <div className="w-[672px] border-r bg-background">
              <DetailsPanel item={item} isFullScreen={true} />
            </div>

            {/* Right Panel - Main Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Record Header - moved here */}
              <div className="border-b bg-background px-6 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {item.header.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{item.header}</h2>
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
                        <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
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
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{tabs.find((tab) => tab.id === activeTab)?.label}</h3>
                  <div className="flex items-center gap-2">
                    <ViewModeSelector />
                    {activeTab !== "activity" && activeTab !== "company" && (
                      <Button variant="outline" size="sm">
                        <PlusIcon className="h-4 w-4" />
                        Add {activeTab === "team" ? "member" : activeTab.slice(0, -1)}
                      </Button>
                    )}
                    {activeTab === "activity" && (
                      <Button variant="outline" size="sm">
                        <PlusIcon className="h-4 w-4" />
                        Add meeting
                      </Button>
                    )}
                  </div>
                </div>
                <TabContent activeTab={activeTab} viewMode={viewMode} item={item} />
              </div>
            </div>
          </div>
        </div>
      </>
    )

    // Use portal to render outside of current DOM hierarchy
    return typeof document !== "undefined" ? createPortal(content, document.body) : null
  }

  if (isFullScreen) {
    return <FullScreenContent />
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.header}
        </Button>
      </SheetTrigger>
             <SheetContent side="right" className="flex w-full max-w-[30vw] flex-col p-0 sm:max-w-[30vw] [&>button]:hidden overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => {
              const element = document.querySelector('[data-state="open"]');
              if (element && element instanceof HTMLElement) {
                element.click();
              }
            }}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="bg-background">
              {item.header}
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
          {/* Record Header - moved here */}
          <div className="border-b bg-background px-6 py-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {item.header.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{item.header}</h2>
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
                    <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                      {tab.count}
                    </Badge>
                  )}
                  {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{tabs.find((tab) => tab.id === activeTab)?.label}</h3>
                <div className="flex items-center gap-2">
                  <ViewModeSelector />
                  {activeTab !== "activity" && activeTab !== "company" && (
                    <Button variant="outline" size="sm">
                      <PlusIcon className="h-4 w-4" />
                      Add {activeTab === "team" ? "member" : activeTab.slice(0, -1)}
                    </Button>
                  )}
                  {activeTab === "activity" && (
                    <Button variant="outline" size="sm">
                      <PlusIcon className="h-4 w-4" />
                      Add meeting
                    </Button>
                  )}
                </div>
              </div>
              <TabContent activeTab={activeTab} viewMode={viewMode} item={item} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function TabContent({
  activeTab,
  viewMode,
  item,
}: { activeTab: string; viewMode: "card" | "list" | "table"; item: z.infer<typeof schema> }) {
  if (activeTab === "details") {
    return <DetailsPanel item={item} isFullScreen={false} />
  }

  if (activeTab === "activity") {
    return <ActivityContent item={item} />
  }

  if (activeTab === "company") {
    return <CompanyContent item={item} />
  }

  const data = getTabData(activeTab, item)

  if (viewMode === "table") {
    return <TableView data={data} activeTab={activeTab} />
  }

  if (viewMode === "card") {
    return <CardView data={data} activeTab={activeTab} />
  }

  return <ListView data={data} activeTab={activeTab} />
}

function ActivityContent({ item }: { item: z.infer<typeof schema> }) {
  const [expandedActivity, setExpandedActivity] = React.useState<number | null>(null)

  const activities = [
    {
      id: 1,
      type: "change",
      actor: "Atilo system",
      action: "changed",
      target: "Email addresses",
      timestamp: "3 days ago",
      date: "2025-05-27",
      details: {
        changes: [
          { field: "Primary Email", from: "old@company.com", to: "new@company.com" },
          { field: "Secondary Email", from: "", to: "backup@company.com" },
        ],
        reason: "Email migration as part of company rebranding initiative",
        affectedSystems: ["CRM", "Marketing Automation", "Support Desk"],
      },
    },
    {
      id: 2,
      type: "creation",
      actor: "Atilo system",
      action: "was created by",
      target: item.header,
      timestamp: "3 days ago",
      date: "2025-05-27",
      details: {
        source: "Lead import from trade show",
        initialData: {
          company: "Acme Corp",
          industry: "Technology",
          employees: "500-1000",
          revenue: "$50M-$100M",
        },
        assignedTo: "Sarah Johnson",
        leadScore: 85,
      },
    },
    {
      id: 3,
      type: "meeting",
      actor: "A user",
      action: "attended a meeting",
      target: "Task Manager App Mockup Review",
      timestamp: "4 months ago",
      date: "2025-02-01",
      time: "2:00 PM - 3:00 PM",
      details: {
        attendees: ["John Smith", "Sarah Chen", "Mike Rodriguez", "Lisa Wang"],
        agenda: [
          "Review current mockup designs",
          "Discuss user feedback",
          "Identify improvement areas",
          "Plan next iteration",
        ],
        outcomes: [
          "Approved navigation structure",
          "Requested changes to color scheme",
          "Scheduled user testing session",
        ],
        nextSteps: [
          "Update designs based on feedback",
          "Prepare prototype for testing",
          "Schedule follow-up in 2 weeks",
        ],
      },
    },
    {
      id: 4,
      type: "contact",
      actor: item.header,
      action: "made first contact with",
      target: item.header,
      timestamp: "2 years ago",
      date: "2022-12-15",
      details: {
        method: "Cold email outreach",
        campaign: "Q4 Enterprise Prospects",
        subject: "Streamline Your Project Management Workflow",
        response: "Interested in learning more",
        followUpScheduled: "2022-12-20",
        leadSource: "LinkedIn Sales Navigator",
      },
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "change":
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>
      case "creation":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>
      case "meeting":
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>
      case "contact":
        return <div className="h-2 w-2 rounded-full bg-orange-500"></div>
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>
    }
  }

  const formatActivityText = (activity: any) => {
    switch (activity.type) {
      case "change":
        return (
          <span>
            <span className="font-medium">{activity.actor}</span>{" "}
            <span className="text-muted-foreground">{activity.action}</span>{" "}
            <Badge variant="outline" className="text-xs mx-1">
              {activity.target}
            </Badge>
          </span>
        )
      case "creation":
        return (
          <span>
            <span className="font-medium">{activity.target}</span>{" "}
            <span className="text-muted-foreground">{activity.action}</span>{" "}
            <span className="font-medium">{activity.actor}</span>
          </span>
        )
      case "meeting":
        return (
          <span>
            <CheckCircleIcon className="h-4 w-4 text-green-500 inline mr-1" />
            <span className="font-medium">{activity.actor}</span>{" "}
            <span className="text-muted-foreground">{activity.action}</span>{" "}
            <span className="font-medium">{activity.target}</span>
          </span>
        )
      case "contact":
        return (
          <span>
            <span className="font-medium">{activity.actor}</span>{" "}
            <span className="text-muted-foreground">{activity.action}</span>{" "}
            <span className="font-medium">{activity.target}</span>
          </span>
        )
      default:
        return (
          <span>
            <span className="font-medium">{activity.actor}</span>{" "}
            <span className="text-muted-foreground">{activity.action}</span>{" "}
            <span className="font-medium">{activity.target}</span>
          </span>
        )
    }
  }

  const renderExpandedDetails = (activity: any) => {
    switch (activity.type) {
      case "change":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Changes Made</h5>
              <div className="space-y-2">
                {activity.details.changes.map((change: any, index: number) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{change.field}:</span>{" "}
                    {change.from && <span className="text-red-600 line-through">{change.from}</span>}
                    {change.from && " → "}
                    <span className="text-green-600">{change.to}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Reason</h5>
              <p className="text-sm text-muted-foreground">{activity.details.reason}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Affected Systems</h5>
              <div className="flex gap-1 flex-wrap">
                {activity.details.affectedSystems.map((system: string) => (
                  <Badge key={system} variant="outline" className="text-xs">
                    {system}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )
      case "creation":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-1">Source</h5>
              <p className="text-sm text-muted-foreground">{activity.details.source}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-2">Initial Data</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(activity.details.initialData).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-muted-foreground capitalize">{key}:</span> <span>{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Assigned to:</span>{" "}
                <span className="font-medium">{activity.details.assignedTo}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Lead Score:</span>{" "}
                <Badge variant="outline" className="text-green-600">
                  {activity.details.leadScore}
                </Badge>
              </div>
            </div>
          </div>
        )
      case "meeting":
        return (
          <div className="mt-4 space-y-3">
            <div className="rounded bg-muted p-3">
              <p className="text-sm font-medium">{activity.target}</p>
              <p className="text-xs text-muted-foreground">
                {activity.date}, {activity.time}
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Attendees ({activity.details.attendees.length})</h5>
              <div className="flex gap-1 flex-wrap">
                {activity.details.attendees.map((attendee: string) => (
                  <Badge key={attendee} variant="outline" className="text-xs">
                    {attendee}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Agenda</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                {activity.details.agenda.map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Key Outcomes</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                {activity.details.outcomes.map((outcome: string, index: number) => (
                  <li key={index}>✓ {outcome}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Next Steps</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                {activity.details.nextSteps.map((step: string, index: number) => (
                  <li key={index}>→ {step}</li>
                ))}
              </ul>
            </div>
          </div>
        )
      case "contact":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Contact Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Method:</span> <span>{activity.details.method}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Campaign:</span> <span>{activity.details.campaign}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Lead Source:</span> <span>{activity.details.leadSource}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Follow-up:</span>{" "}
                  <span>{activity.details.followUpScheduled}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Email Subject</h5>
              <p className="text-sm text-muted-foreground italic">"{activity.details.subject}"</p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Response</h5>
              <p className="text-sm text-green-600">{activity.details.response}</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // Group activities by year and month
  const groupedActivities = activities.reduce(
    (acc, activity) => {
      const date = new Date(activity.date)
      const year = date.getFullYear()
      const month = date.toLocaleDateString("en-US", { month: "long" })

      if (!acc[year]) acc[year] = {}
      if (!acc[year][month]) acc[year][month] = []
      acc[year][month].push(activity)

      return acc
    },
    {} as Record<number, Record<string, any[]>>,
  )

  return (
    <div className="space-y-6">
      {Object.entries(groupedActivities)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, months]) => (
          <div key={year}>
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">{year}</h4>
            <div className="space-y-4">
              {Object.entries(months)
                .sort(([a], [b]) => new Date(`${a} 1, ${year}`).getTime() - new Date(`${b} 1, ${year}`).getTime())
                .map(([month, monthActivities]) => (
                  <div key={month}>
                    <h5 className="mb-2 text-sm font-medium">{month}</h5>
                    <div className="space-y-2">
                      {monthActivities.map((activity) => (
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
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  )
}

function CompanyContent({ item }: { item: z.infer<typeof schema> }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground text-2xl font-bold">
              AC
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">Acme Corporation</CardTitle>
              <CardDescription className="mt-1">Technology • San Francisco, CA</CardDescription>
              <div className="mt-3 flex items-center gap-4">
                <Badge variant="outline">Enterprise</Badge>
                <Badge variant="outline" className="text-green-600">
                  Active Customer
                </Badge>
                <span className="text-sm text-muted-foreground">Founded 2015</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Company Overview</h4>
            <p className="text-sm text-muted-foreground">
              Acme Corporation is a leading technology company specializing in enterprise software solutions. They
              provide innovative tools for project management, team collaboration, and business analytics to Fortune 500
              companies worldwide. With over 500 employees and offices in 12 countries, Acme has established itself as a
              trusted partner for digital transformation initiatives.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Key Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Industry:</span>
                  <span>Technology</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employees:</span>
                  <span>500-1000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue:</span>
                  <span>$50M - $100M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Website:</span>
                  <span className="text-blue-600">acme.com</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Contact Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-blue-600">info@acme.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span>123 Tech St, SF, CA</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Contract renewed for $250K</span>
                <span className="text-muted-foreground">• 2 weeks ago</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span>New contact added: Sarah Johnson</span>
                <span className="text-muted-foreground">• 1 month ago</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getTabData(activeTab: string, item: z.infer<typeof schema>) {
  switch (activeTab) {
    case "emails":
      return [
        {
          id: 1,
          subject: "Re: Project Discussion",
          from: `${item.header.toLowerCase()}@company.com`,
          date: "2 hours ago",
          status: "Unread",
          preview:
            "Thanks for the update on the project timeline. I've reviewed the documents and have a few questions...",
          type: "received",
        },
        {
          id: 2,
          subject: "Project Timeline Update",
          from: "me@company.com",
          date: "1 day ago",
          status: "Sent",
          preview: `Hi ${item.header}, I wanted to provide you with an update on our current project timeline...`,
          type: "sent",
        },
        {
          id: 3,
          subject: "Welcome to the team!",
          from: `${item.header.toLowerCase()}@company.com`,
          date: "3 days ago",
          status: "Read",
          preview: "Thank you for the warm welcome! I'm excited to start working with the team...",
          type: "received",
        },
      ]
    case "tasks":
      return [
        {
          id: 1,
          title: "Follow up on project proposal",
          priority: "High",
          status: "pending",
          assignee: "You",
          dueDate: "Tomorrow",
          description: "Need to schedule a follow-up call to discuss the project proposal details and next steps.",
        },
        {
          id: 2,
          title: "Send contract documents",
          priority: "Medium",
          status: "completed",
          assignee: "You",
          dueDate: "2 days ago",
          description: "Contract documents have been sent via email and are awaiting signature.",
        },
        {
          id: 3,
          title: "Schedule quarterly review meeting",
          priority: "Medium",
          status: "pending",
          assignee: "Sarah Chen",
          dueDate: "Next week",
          description: "Coordinate with all stakeholders to find a suitable time for the quarterly review.",
        },
      ]
    case "notes":
      return [
        {
          id: 1,
          title: "Strategic Review Meeting",
          date: "3 days ago",
          content: `Family Office Strategic Review - ${item.header}

Meeting Date: January 27, 2025
Participants: Investment Committee, Family Members, Advisory Board

Executive Summary:
Conducted comprehensive strategic review for ${item.header} within the family office portfolio. The assessment covered investment performance, strategic alignment, and future opportunities.

Key Discussion Points:

1. Portfolio Position Analysis:
   • Current Allocation: 8.5% of total portfolio
   • Performance YTD: +15.7% (outperforming benchmark by 320bps)
   • Risk-Adjusted Returns: Sharpe ratio of 1.8
   • Correlation with Other Holdings: Low (0.35)

2. Strategic Alignment:
   • Fits within technology sector allocation (target: 30-35%)
   • Aligns with ESG investment criteria
   • Supports multi-generational wealth preservation goals
   • Provides diversification benefits

3. Investment Thesis Validation:
   ✓ Market leadership position maintained
   ✓ Revenue growth exceeding projections (45% YoY)
   ✓ Management team executing on strategic plan
   ✓ Competitive moat strengthening

4. Risk Assessment Update:
   • Market Risk: MODERATE - Sector volatility expected
   • Operational Risk: LOW - Strong management team
   • Regulatory Risk: LOW - No significant concerns
   • Concentration Risk: MODERATE - Consider partial profit-taking

5. Opportunities Identified:
   a) Follow-on Investment:
      - Company raising Series D in Q2 2025
      - Pro-rata rights available ($3-5M)
      - Valuation expected at 2x current mark

   b) Strategic Initiatives:
      - Board observer seat available
      - Co-investment opportunities in acquisitions
      - Access to management for other portfolio companies

6. Family Member Perspectives:
   • Next generation expressed interest in deeper involvement
   • Alignment with family values (innovation, sustainability)
   • Educational opportunity for younger members
   • Potential for philanthropic partnership

7. Tax Considerations:
   • Current unrealized gain: $12.5M
   • QSBS eligibility confirmed
   • Opportunity zone investment potential
   • Estate planning implications reviewed

Recommendations:
1. HOLD current position (no immediate action required)
2. Prepare for Series D participation ($5M allocation)
3. Arrange next-gen family member site visit
4. Explore board observer opportunity
5. Monitor for partial exit opportunity at 3x

Action Items:
• Schedule follow-up with company CEO (February)
• Update investment memo for family records
• Coordinate with tax advisor on QSBS planning
• Plan educational session for next generation
• Review allocation targets with Investment Committee

Next Review: April 2025 (post Series D announcement)

This investment continues to perform well and aligns with family office objectives. Strong recommendation to maintain position with potential for increase.`,
          tags: ["Strategic Review", "Investment Committee", "Portfolio Analysis"],
        },
        {
          id: 2,
          title: "Due Diligence Update",
          date: "1 day ago",
          content: `Ongoing Due Diligence - ${item.header}

Date: January 29, 2025
Prepared by: Investment Team

Purpose:
Continuous monitoring and due diligence update for ${item.header} as part of active portfolio management.

Recent Developments:

1. Financial Performance:
   • Q4 Revenue: $28.5M (108% of plan)
   • Gross Margins: 74% (improving from 71%)
   • Cash Position: $45M (24 months runway)
   • ARR Growth: 85% year-over-year

2. Operational Updates:
   • Headcount: 187 (added 25 in Q4)
   • New CTO hired from major tech company
   • Opened European office (Amsterdam)
   • Launched version 3.0 of core product

3. Market Position:
   • Maintained #2 market share position
   • Won 3 enterprise logos from competitor
   • NPS score improved to 67 (from 58)
   • Industry analyst recognition received

4. Customer Base Analysis:
   • Total Customers: 450+
   • Enterprise Clients: 85 (up from 62)
   • Net Revenue Retention: 125%
   • Churn Rate: 5% annually (improved)

5. Competitive Landscape:
   • Main competitor acquired for $1.2B
   • New entrants focusing on SMB market
   • Our portfolio company targeting enterprise
   • Differentiation strategy working well

6. Management Assessment:
   • CEO performing exceptionally well
   • Strong bench strength developed
   • Culture scores high (eNPS: 45)
   • Low executive turnover

7. Financial Controls Review:
   ✓ Monthly reporting package on time
   ✓ Audit completed with no findings
   ✓ Burn rate within projections
   ✓ Unit economics improving

8. Legal & Compliance:
   • No outstanding litigation
   • IP portfolio expanded (4 new patents)
   • Data privacy compliance maintained
   • All contracts reviewed and current

9. Technology Infrastructure:
   • Platform stability: 99.99% uptime
   • Security audit passed
   • Scalability tested to 10x current load
   • AI/ML capabilities enhanced

Red Flags: None identified

Yellow Flags:
• Customer concentration improving but still high
• International expansion requires monitoring
• Talent retention in competitive market

Investment Recommendation: MAINTAIN POSITIVE OUTLOOK

The company continues to execute well against plan. All key metrics trending positively. Management team aligned with investor interests. No immediate concerns requiring intervention.

Follow-up Actions:
1. Monthly check-in calls continuing
2. Board observer attending all meetings
3. Reviewing Series D terms when available
4. Monitoring competitive dynamics
5. Supporting executive recruiting efforts

This investment remains one of the stronger performers in our portfolio with clear path to liquidity event within 3-5 years.`,
          tags: ["Due Diligence", "Monitoring", "Performance Update"],
        },
      ]
    case "meetings":
      return [
        {
          id: 1,
          title: "Project Kickoff Meeting",
          date: "Tomorrow",
          time: "2:00 PM - 3:00 PM",
          status: "Confirmed",
          location: "Conference Room A",
          attendees: 5,
          description: `Initial project kickoff with ${item.header} and the development team.`,
        },
        {
          id: 2,
          title: "Quarterly Business Review",
          date: "Next week",
          time: "10:00 AM - 11:30 AM",
          status: "Pending",
          location: "Video Call",
          attendees: 8,
          description: "Quarterly review of business metrics and planning for next quarter.",
        },
        {
          id: 3,
          title: "Technical Demo Session",
          date: "3 days ago",
          time: "3:00 PM - 4:00 PM",
          status: "Completed",
          location: "Video Call",
          attendees: 3,
          description: "Demonstrated key platform features and answered technical questions.",
        },
      ]
    case "files":
      return [
        {
          id: 1,
          name: "Project_Proposal_v2.pdf",
          size: "2.4 MB",
          uploadedBy: "You",
          uploadedDate: "2 days ago",
          type: "pdf",
          description: "Updated project proposal with revised timeline and budget estimates.",
        },
        {
          id: 2,
          name: "Requirements_Analysis.xlsx",
          size: "1.8 MB",
          uploadedBy: item.header,
          uploadedDate: "1 week ago",
          type: "xlsx",
          description: "Detailed requirements analysis and feature specifications.",
        },
        {
          id: 3,
          name: "UI_Mockups.zip",
          size: "15.2 MB",
          uploadedBy: "Design Team",
          uploadedDate: "3 days ago",
          type: "zip",
          description: "Initial UI mockups and design concepts for the new platform.",
        },
      ]
    case "team":
      return [
        {
          id: 1,
          name: "Sarah Johnson",
          role: "Product Manager",
          email: "sarah.johnson@acme.com",
          phone: "+1 (555) 123-4567",
          department: "Product",
          joinDate: "2023-01-15",
          status: "Active",
        },
        {
          id: 2,
          name: "Michael Chen",
          role: "Senior Developer",
          email: "michael.chen@acme.com",
          phone: "+1 (555) 234-5678",
          department: "Engineering",
          joinDate: "2022-08-20",
          status: "Active",
        },
        {
          id: 3,
          name: "Emily Rodriguez",
          role: "UX Designer",
          email: "emily.rodriguez@acme.com",
          phone: "+1 (555) 345-6789",
          department: "Design",
          joinDate: "2023-03-10",
          status: "Active",
        },
        {
          id: 4,
          name: "David Kim",
          role: "Sales Director",
          email: "david.kim@acme.com",
          phone: "+1 (555) 456-7890",
          department: "Sales",
          joinDate: "2021-11-05",
          status: "Active",
        },
      ]
    default:
      return []
  }
}

function TableView({ data, activeTab }: { data: any[]; activeTab: string }) {
  // Get the updateTaskStatus function from the tasks context if we're on the tasks tab
  const tasksContext = activeTab === "tasks" ? useTasks() : null;

  // Use a ref to handle checkbox clicks
  const checkboxRefs = React.useRef<Map<number, HTMLDivElement | null>>(new Map());

  // Handle task status change
  const handleTaskStatusChange = (taskId: number) => {
    if (tasksContext) {
      const task = data.find(task => task.id === taskId);
      if (task) {
        const newStatus = task.status.toLowerCase() === "completed" ? "pending" : "completed";
        tasksContext.updateTaskStatus(taskId, newStatus);
      }
    }
  };

  // Set up event listeners for each checkbox after render
  useEffect(() => {
    if (activeTab === "tasks") {
      checkboxRefs.current.forEach((ref, taskId) => {
        if (ref) {
          const handler = () => handleTaskStatusChange(taskId);
          ref.addEventListener("click", handler);
          return () => ref.removeEventListener("click", handler);
        }
      });
    }
  }, [data, activeTab]); // Re-run when data or active tab changes

  if (activeTab === "tasks") {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((task) => (
              <TableRow key={task.id}>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox 
                    checked={task.status.toLowerCase() === "completed"}
                    onCheckedChange={() => {
                      if (tasksContext) {
                        const newStatus = task.status.toLowerCase() === "completed" ? "pending" : "completed";
                        tasksContext.updateTaskStatus(task.id, newStatus);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <p
                      className={`font-medium ${task.status.toLowerCase() === "completed" ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm capitalize">
                    {task.priority}
                  </span>
                </TableCell>
                <TableCell>{task.assignee}</TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>
                  <span className="text-sm capitalize">
                    {task.status.toLowerCase() === "completed" ? "Completed" : "Pending"}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskStatusChange(task.id);
                        }}
                      >
                        {task.status.toLowerCase() === "completed" ? "Mark as Pending" : "Mark as Completed"}
                      </DropdownMenuItem>
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

  // Generic table for other tabs
  const getTableColumns = () => {
    switch (activeTab) {
      case "emails":
        return ["Subject", "From", "Date", "Status"]
      case "files":
        return ["Name", "Size", "Uploaded By", "Date"]
      case "team":
        return ["Name", "Role", "Department", "Email", "Status"]
      case "meetings":
        return ["Event", "Date", "Time", "Status", "Location"]
      default:
        return ["Name", "Date", "Status"]
    }
  }

  const getTableData = (item: any) => {
    switch (activeTab) {
      case "emails":
        return [item.subject, item.from, item.date, item.status]
      case "files":
        return [item.name, item.size, item.uploadedBy, item.uploadedDate]
      case "team":
        return [item.name, item.role, item.department, item.email, item.status]
      case "meetings":
        return [item.title, item.date, item.time, item.status, item.location]
      default:
        return [item.title || item.name, item.date, item.status]
    }
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {getTableColumns().map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {getTableData(item).map((value, index) => (
                <TableCell key={index}>
                  {index === getTableData(item).length - 1 && activeTab !== "team" ? (
                    <Badge variant="outline">{value}</Badge>
                  ) : (
                    value
                  )}
                </TableCell>
              ))}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
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

function CardView({ data, activeTab }: { data: any[]; activeTab: string }) {
  if (activeTab === "team") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.department}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <MailIcon className="h-3 w-3" />
                      <span className="text-blue-600">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <PhoneIcon className="h-3 w-3" />
                      <span>{member.phone}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge variant="outline" className="text-green-600">
                      {member.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Send Email</DropdownMenuItem>
                        <DropdownMenuItem>Call</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Generic card view for other tabs
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium">{item.title || item.subject || item.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{item.description || item.preview || item.content}</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  {activeTab === "meetings" && <CalendarIcon className="h-3 w-3" />}
                  {activeTab === "files" && <FolderIcon className="h-3 w-3" />}
                  {activeTab === "emails" && <MailIcon className="h-3 w-3" />}
                  <span>{item.date || item.uploadedDate}</span>
                  {item.size && <span>• {item.size}</span>}
                  {item.time && <span>• {item.time}</span>}
                </div>
                {item.tags && (
                  <div className="mt-2 flex gap-1">
                    {item.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {(item.status || item.priority) && (
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className="capitalize"
                    >
                      {item.status || item.priority}
                    </Badge>
                  </div>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
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

function ListView({ data, activeTab }: { data: any[]; activeTab: string }) {
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.id} className="rounded-lg border p-4">
          <div className="flex items-start gap-3">
            {activeTab === "emails" && (
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  item.type === "sent" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                }`}
              >
                {item.type === "sent" ? "ME" : item.from.charAt(0).toUpperCase()}
              </div>
            )}
            {activeTab === "tasks" && <Checkbox className="mt-1" checked={item.status === "completed"} />}
            {activeTab === "meetings" && (
              <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <span className="text-xs font-medium">MAY</span>
                <span className="text-sm font-bold">28</span>
              </div>
            )}
            {activeTab === "notes" && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <FileTextIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            {activeTab === "files" && (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">📄</div>
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      item.status === "completed" ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item.title || item.subject || item.name}
                  </p>
                  {(item.from || item.assignee || item.uploadedBy) && (
                    <p className="text-xs text-muted-foreground">
                      {activeTab === "emails" && `From: ${item.from}`}
                      {activeTab === "tasks" && `Assigned to: ${item.assignee}`}
                      {activeTab === "files" && `Uploaded by: ${item.uploadedBy}`}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{item.date || item.dueDate || item.uploadedDate}</p>
                  {item.status && (
                    <span
                      className={`text-xs mt-1 ${
                        item.status === "Unread"
                          ? "text-blue-600"
                          : item.status === "completed"
                            ? "text-green-600"
                            : "text-muted-foreground"
                      }`}
                    >
                      {item.status === "completed" ? "Completed" : item.status}
                    </span>
                  )}
                  {item.priority && item.status !== "completed" && (
                    <>
                      <span className="text-xs text-muted-foreground mx-1">•</span>
                      <span className="text-xs capitalize">
                        {item.priority}
                      </span>
                    </>
                  )}
                  {item.size && (
                    <>
                      <span className="text-xs text-muted-foreground mx-1">•</span>
                      <span className="text-xs text-muted-foreground">
                        {item.size}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{item.description || item.preview || item.content}</p>
              {item.tags && (
                <div className="flex items-center gap-2 mt-3">
                  {item.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              {activeTab === "meetings" && item.location && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">📍 {item.location}</span>
                  <span className="text-xs text-muted-foreground">👥 {item.attendees} attendees</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function DetailsPanel({ item, isFullScreen = false }: { item: z.infer<typeof schema>; isFullScreen?: boolean }) {
  return (
    <div className="p-6">
      {/* Record Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Record Details</h4>

        <div className="rounded-lg border border-muted bg-muted/10 p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <UserCircleIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Name</Label>
                <p className="text-sm font-medium">{item.header}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Email addresses</Label>
                <p className="text-sm text-blue-600">{item.header.toLowerCase()}@company.com</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <FileTextIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <p className="text-sm">
                  Working as an analyst at a hedge fund taught me how to synthesize complex data into...
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Company</Label>
                <p className="text-sm text-blue-600">Set Company</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Job title</Label>
                <p className="text-sm text-blue-600">Set Job title...</p>
              </div>
            </div>
          </div>
        </div>

        <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
          Show all values
        </Button>
      </div>

      {/* Lists Section */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-medium">Lists</h4>
          <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
            Add to list
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">This record has not been added to any lists</p>
      </div>
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
          <ActivityContent item={item} />
        </div>
      )}
    </div>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const [columnOrder, setColumnOrder] = React.useState<string[]>([])
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))

  // Initialize column order from table columns
  React.useEffect(() => {
    const visibleColumns = table
      .getAllColumns()
      .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
      .map((column) => column.id);
    
    if (columnOrder.length === 0 && visibleColumns.length > 0) {
      setColumnOrder(visibleColumns);
    }
  }, [table.getAllColumns(), columnOrder]);

  // Handle drag end for column reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active && over && active.id !== over.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MoreHorizontalIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={columnOrder} strategy={verticalListSortingStrategy}>
            {columnOrder.map((columnId) => {
              const column = table.getColumn(columnId) as any;
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
  )
}
