import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Building2Icon, UsersIcon, TrendingUpIcon, TargetIcon, ChevronDownIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export type Asset = {
  id: string
  name: string
  description: string
  imageUrl: string
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
  owner: {
    id: string
    name: string
    email: string
    imageUrl: string
  }
}

export const columns: ColumnDef<Asset>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Avatar>
          <AvatarImage src={row.original.imageUrl || "/placeholder.svg"} alt={row.original.name} />
          <AvatarFallback>{row.original.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "default" : "destructive"}>{row.original.status}</Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => row.original.createdAt.toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const asset = row.original
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Asset Details</SheetTitle>
              <SheetDescription>
                View all the details of this asset. Click below to navigate to the asset page.
              </SheetDescription>
            </SheetHeader>
            <MasterDetailsPanel asset={asset} />
          </SheetContent>
        </Sheet>
      )
    },
  },
]

interface MasterDetailsPanelProps {
  asset: Asset
}

function MasterDetailsPanel({ asset }: MasterDetailsPanelProps) {
  return (
    <ScrollArea>
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>{asset.name}</CardTitle>
            <CardDescription>{asset.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={asset.imageUrl || "/placeholder.svg"} alt={asset.name} />
                <AvatarFallback>{asset.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{asset.owner.name}</p>
                <p className="text-sm text-muted-foreground">{asset.owner.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {/* Company Section */}
          <Collapsible defaultOpen={false}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <Building2Icon className="h-4 w-4" />
                <span className="font-medium">Company</span>
              </div>
              <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary">Acme Corp</Badge>
                <Badge variant="secondary">TechStart Inc</Badge>
                <Badge variant="secondary">Global Ventures</Badge>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* People Section */}
          <Collapsible defaultOpen={false}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4" />
                <span className="font-medium">People</span>
              </div>
              <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary">John Smith</Badge>
                <Badge variant="secondary">Sarah Johnson</Badge>
                <Badge variant="secondary">Michael Chen</Badge>
                <Badge variant="secondary">Emily Davis</Badge>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Investments Section */}
          <Collapsible defaultOpen={false}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4" />
                <span className="font-medium">Investments</span>
              </div>
              <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary">Series A - $2M</Badge>
                <Badge variant="secondary">Seed Round - $500K</Badge>
                <Badge variant="secondary">Bridge - $1M</Badge>
                <Badge variant="secondary">Series B - $5M</Badge>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Opportunities Section */}
          <Collapsible defaultOpen={false}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <TargetIcon className="h-4 w-4" />
                <span className="font-medium">Opportunities</span>
              </div>
              <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary">Exit Strategy</Badge>
                <Badge variant="secondary">IPO Preparation</Badge>
                <Badge variant="secondary">Strategic Partnership</Badge>
                <Badge variant="secondary">Market Expansion</Badge>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </ScrollArea>
  )
}

interface DataTableProps {
  columns: ColumnDef<Asset>[]
  data: Asset[]
}

export function AssetsTable({ columns, data }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
  )
}
