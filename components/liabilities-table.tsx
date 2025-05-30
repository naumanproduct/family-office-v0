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
  ArrowLeftIcon,
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
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-is-mobile"

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

function LiabilityDrawer({
  liability,
  open,
  onOpenChange,
}: { liability: Liability; open: boolean; onOpenChange: (open: boolean) => void }) {
  const isMobile = useIsMobile()

  const drawerContent = (
    <>
      <div className="bg-muted px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-8 w-8 p-0">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Badge variant="secondary">Liabilities</Badge>
          </div>
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">{liability.name}</h2>
          <p className="text-sm text-muted-foreground">{liability.type}</p>
        </div>
      </div>

      <Tabs defaultValue="details" className="flex-1">
        <TabsList className="grid w-full grid-cols-3 mx-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="px-4 py-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Liability Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Balance</label>
                  <p className="text-sm">{liability.currentBalance}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Original Amount</label>
                  <p className="text-sm">{liability.originalAmount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Interest Rate</label>
                  <p className="text-sm">{liability.interestRate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Maturity Date</label>
                  <p className="text-sm">{liability.maturityDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Entity</label>
                  <p className="text-sm">{liability.entity}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Lender</label>
                  <p className="text-sm">{liability.lender}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="px-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Next Payment</label>
                  <p className="text-sm">{liability.nextPayment}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Amount</label>
                  <p className="text-sm">{liability.paymentAmount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="px-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[90vh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Liability Details</DrawerTitle>
          </DrawerHeader>
          {drawerContent}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[90vh] max-w-4xl mx-auto">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Liability Details</DrawerTitle>
        </DrawerHeader>
        {drawerContent}
      </DrawerContent>
    </Drawer>
  )
}

const columns: ColumnDef<Liability>[] = [
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
        Liability Name
        {column.getIsSorted() === "asc" ? (
          <SortAscIcon className="ml-2 h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <SortDescIcon className="ml-2 h-3 w-3" />
        ) : null}
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.type}</p>
      </div>
    ),
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
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [selectedLiability, setSelectedLiability] = React.useState<Liability | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)

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

  const handleRowClick = (liability: Liability) => {
    setSelectedLiability(liability)
    setDrawerOpen(true)
  }

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
          <Button size="sm">
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
                  onClick={() => handleRowClick(row.original)}
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

      {/* Drawer */}
      {selectedLiability && (
        <LiabilityDrawer liability={selectedLiability} open={drawerOpen} onOpenChange={setDrawerOpen} />
      )}
    </div>
  )
}
