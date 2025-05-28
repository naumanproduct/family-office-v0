import type React from "react"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Liability } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface LiabilitiesTableProps {
  data: Liability[]
}

const LiabilityNameCell = ({ liability }: { liability: Liability }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <a href="#" className="font-medium hover:underline">
          {liability.name}
        </a>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            <Badge className="mr-2">Liabilities</Badge>
            {liability.name}
          </SheetTitle>
          <SheetDescription>View details about this liability.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Name</h4>
            <p className="text-gray-500 dark:text-gray-400">{liability.name}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Balance</h4>
            <p className="text-gray-500 dark:text-gray-400">${liability.balance.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Interest Rate</h4>
            <p className="text-gray-500 dark:text-gray-400">{liability.interestRate}%</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const LiabilitiesTable: React.FC<LiabilitiesTableProps> = ({ data }) => {
  const columns: ColumnDef<Liability>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <LiabilityNameCell liability={row.original} />,
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => `$${(row.getValue("balance") as number).toLocaleString()}`,
    },
    {
      accessorKey: "interestRate",
      header: "Interest Rate",
      cell: ({ row }) => `${row.getValue("interestRate")}%`,
    },
  ]

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
              <TableRow key={row.id} data-row={JSON.stringify(row.original)}>
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

export default LiabilitiesTable
