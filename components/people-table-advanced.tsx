"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CaretSortIcon,
  CheckIcon,
} from "@radix-ui/react-icons"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableInfinite } from "@/components/ui/data-table-infinite"
import { cn } from "@/lib/utils"
import { MasterDrawer } from "./master-drawer"
import { AddPersonDialog } from "./add-person-dialog"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import {
  Building2Icon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  MoreHorizontalIcon,
} from "lucide-react"

// Person type definition
export interface Person {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  jobTitle: string
  company: string
  companyId?: number
  location: string
  tags: string[]
  lastInteraction: string
  connectionStrength: string
  linkedin?: string
  twitter?: string
  twitterFollowers?: number
  bio: string
  avatar?: string
  status: string
  type?: string
  associatedEntities?: string[]
  relatedInvestments?: string[]
  internalOwner?: string
  introducedBy?: string
}

// Mock data function
const generatePeopleData = (count: number, offset: number = 0): Person[] => {
  const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emma", "Robert", "Lisa", "William", "Mary"]
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]
  const companies = ["TechCorp", "FinanceHub", "DataSoft", "CloudWorks", "InvestCo", "VentureX", "CapitalOne", "GrowthPartners"]
  const jobTitles = ["CEO", "CFO", "CTO", "Managing Director", "Partner", "VP Engineering", "Director", "Manager"]
  const locations = ["New York, NY", "San Francisco, CA", "London, UK", "Boston, MA", "Chicago, IL", "Austin, TX"]
  const connectionStrengths = ["Very strong", "Strong", "Medium", "Weak"]
  const statuses = ["Active", "Inactive", "Pending"]
  const types = ["GP", "LP", "Advisor", "Portfolio Company Executive", "Vendor", "Internal"]
  const tags = ["Investor", "Decision Maker", "VIP", "Key Contact", "Technical", "Strategic"]

  return Array.from({ length: count }, (_, i) => {
    const index = offset + i
    const firstName = firstNames[index % firstNames.length]
    const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length]
    return {
      id: index + 1,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      jobTitle: jobTitles[index % jobTitles.length],
      company: companies[index % companies.length],
      companyId: Math.random() > 0.3 ? Math.floor(Math.random() * 10) + 1 : undefined,
      location: locations[index % locations.length],
      tags: [tags[index % tags.length], tags[(index + 1) % tags.length]].slice(0, Math.floor(Math.random() * 2) + 1),
      lastInteraction: `${Math.floor(Math.random() * 30) + 1} days ago`,
      connectionStrength: connectionStrengths[index % connectionStrengths.length],
      bio: `Professional with ${Math.floor(Math.random() * 20) + 5} years of experience in the industry.`,
      status: statuses[index % statuses.length],
      type: types[index % types.length],
    }
  })
}

// Column definitions
export const columns: ColumnDef<Person>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        Name
        {column.getIsSorted() === "asc" ? (
          <ArrowUpIcon className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDownIcon className="ml-2 h-4 w-4" />
        ) : (
          <CaretSortIcon className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const person = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={person.avatar} alt={`${person.firstName} ${person.lastName}`} />
            <AvatarFallback>
              {person.firstName[0]}{person.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">
              {person.firstName} {person.lastName}
            </span>
            <span className="text-xs text-muted-foreground">
              {person.jobTitle}
            </span>
          </div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const person = row.original
      const fullName = `${person.firstName} ${person.lastName}`.toLowerCase()
      return fullName.includes(value.toLowerCase())
    },
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        <Building2Icon className="mr-2 h-4 w-4" />
        Company
        {column.getIsSorted() === "asc" ? (
          <ArrowUpIcon className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDownIcon className="ml-2 h-4 w-4" />
        ) : (
          <CaretSortIcon className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      return <div className="w-[180px]">{row.getValue("company")}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        <MailIcon className="mr-2 h-4 w-4" />
        Email
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <span className="max-w-[180px] truncate font-medium">
            {row.getValue("email")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        <PhoneIcon className="mr-2 h-4 w-4" />
        Phone
      </Button>
    ),
    cell: ({ row }) => {
      return <div className="w-[140px]">{row.getValue("phone")}</div>
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        <MapPinIcon className="mr-2 h-4 w-4" />
        Location
      </Button>
    ),
    cell: ({ row }) => {
      return <div className="w-[120px]">{row.getValue("location")}</div>
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string | undefined
      if (!type) return null
      
      const typeColors: Record<string, string> = {
        "GP": "bg-purple-100 text-purple-800",
        "LP": "bg-blue-100 text-blue-800",
        "Advisor": "bg-green-100 text-green-800",
        "Portfolio Company Executive": "bg-orange-100 text-orange-800",
        "Vendor": "bg-gray-100 text-gray-800",
        "Internal": "bg-indigo-100 text-indigo-800",
      }
      
      return (
        <Badge 
          variant="secondary" 
          className={cn("font-normal", typeColors[type] || "bg-gray-100 text-gray-800")}
        >
          {type}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "connectionStrength",
    header: "Connection",
    cell: ({ row }) => {
      const strength = row.getValue("connectionStrength") as string
      
      const strengthColors: Record<string, string> = {
        "Very strong": "bg-green-100 text-green-800",
        "Strong": "bg-blue-100 text-blue-800",
        "Medium": "bg-yellow-100 text-yellow-800",
        "Weak": "bg-red-100 text-red-800",
        "Internal": "bg-purple-100 text-purple-800",
      }
      
      return (
        <Badge 
          variant="secondary" 
          className={cn("font-normal", strengthColors[strength] || "bg-gray-100 text-gray-800")}
        >
          {strength}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      
      const statusColors: Record<string, string> = {
        "Active": "bg-green-100 text-green-800",
        "Inactive": "bg-gray-100 text-gray-800",
        "Pending": "bg-yellow-100 text-yellow-800",
      }
      
      return (
        <Badge 
          variant="secondary" 
          className={cn("font-normal", statusColors[status] || "bg-gray-100 text-gray-800")}
        >
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "lastInteraction",
    header: "Last Contact",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground">
          {row.getValue("lastInteraction")}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const person = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <MoreHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(person.email)}
            >
              Copy email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit contact</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Delete contact
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function PeopleTableAdvanced() {
  const [data, setData] = React.useState<Person[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true)
  const [page, setPage] = React.useState(0)
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)

  const ITEMS_PER_PAGE = 50

  // Load initial data
  React.useEffect(() => {
    const initialData = generatePeopleData(ITEMS_PER_PAGE, 0)
    setData(initialData)
    setPage(1)
  }, [])

  // Load more data function
  const loadMore = React.useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const newData = generatePeopleData(ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
      setData((prev) => [...prev, ...newData])
      setPage((prev) => prev + 1)
      setIsLoading(false)
      
      // Stop loading more after 200 items (for demo)
      if ((page + 1) * ITEMS_PER_PAGE >= 200) {
        setHasMore(false)
      }
    }, 500)
  }, [page, isLoading, hasMore])

  // Handle row click
  const handleRowClick = (person: Person) => {
    setSelectedPerson(person)
  }

  // Filter configuration
  const filters = [
    {
      column: "type",
      title: "Type",
      options: [
        { label: "GP", value: "GP" },
        { label: "LP", value: "LP" },
        { label: "Advisor", value: "Advisor" },
        { label: "Portfolio Company Executive", value: "Portfolio Company Executive" },
        { label: "Vendor", value: "Vendor" },
        { label: "Internal", value: "Internal" },
      ],
    },
    {
      column: "connectionStrength",
      title: "Connection",
      options: [
        { label: "Very strong", value: "Very strong" },
        { label: "Strong", value: "Strong" },
        { label: "Medium", value: "Medium" },
        { label: "Weak", value: "Weak" },
      ],
    },
    {
      column: "status",
      title: "Status",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
        { label: "Pending", value: "Pending" },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">People</h1>
          <p className="text-muted-foreground">
            Manage your contacts and relationships
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <CheckIcon className="mr-2 h-4 w-4" />
          Add Person
        </Button>
      </div>

      <DataTableInfinite
        columns={columns}
        data={data}
        searchPlaceholder="Filter people..."
        filters={filters}
        onLoadMore={loadMore}
        isLoading={isLoading}
        hasMore={hasMore}
        virtualHeight="calc(100vh - 250px)"
        onRowClick={(person) => setSelectedPerson(person)}
      />

      {/* Person Details Drawer */}
      {selectedPerson && (
        <Sheet open={!!selectedPerson} onOpenChange={(open) => !open && setSelectedPerson(null)}>
          <SheetContent className="sm:max-w-[480px]">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  {selectedPerson.firstName} {selectedPerson.lastName}
                </h2>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">Email</Label>
                      <p className="text-sm">{selectedPerson.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Phone</Label>
                      <p className="text-sm">{selectedPerson.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Location</Label>
                      <p className="text-sm">{selectedPerson.location}</p>
                    </div>
                  </div>
                </div>
                
                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Professional Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">Job Title</Label>
                      <p className="text-sm">{selectedPerson.jobTitle}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Company</Label>
                      <p className="text-sm">{selectedPerson.company}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Type</Label>
                      <p className="text-sm">{selectedPerson.type || "N/A"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Relationship Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Relationship Status</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">Connection Strength</Label>
                      <p className="text-sm">{selectedPerson.connectionStrength}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Last Interaction</Label>
                      <p className="text-sm">{selectedPerson.lastInteraction}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Status</Label>
                      <p className="text-sm">{selectedPerson.status}</p>
                    </div>
                  </div>
                </div>
                
                {/* Bio */}
                {selectedPerson.bio && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Bio</h3>
                    <p className="text-sm text-muted-foreground">{selectedPerson.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Add Person Dialog */}
      <AddPersonDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  )
} 