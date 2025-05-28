"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

import { createPortal } from "react-dom"
import {
  ExpandIcon,
  XIcon,
  MailIcon,
  BuildingIcon,
  FileTextIcon,
  CalendarIcon,
  FolderIcon,
  CheckCircleIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
  BriefcaseIcon,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"

import { EmailsTable } from "./emails-table"
import { TasksTable } from "./tasks-table"
import { NotesTable } from "./notes-table"

export const contactSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  companyId: z.number().optional(),
  location: z.string(),
  tags: z.array(z.string()),
  lastInteraction: z.string(),
  connectionStrength: z.string(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  twitterFollowers: z.number().optional(),
  bio: z.string(),
  avatar: z.string().optional(),
  status: z.string(),
})

type Contact = z.infer<typeof contactSchema>

const contactsData: Contact[] = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@craftventures.com",
    phone: "+1 (555) 123-4567",
    jobTitle: "CEO",
    company: "Craft Ventures",
    companyId: 1,
    location: "San Francisco, CA",
    tags: ["Investor", "Decision Maker", "VIP"],
    lastInteraction: "2 days ago",
    connectionStrength: "Very strong",
    linkedin: "sarahjohnson",
    twitter: "@sarahjohnson",
    twitterFollowers: 15600,
    bio: "Sarah is the CEO of Craft Ventures with over 15 years of experience in venture capital...",
    avatar: "/placeholder.svg?height=40&width=40&query=SJ",
    status: "Active",
  },
  {
    id: 2,
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@falconx.io",
    phone: "+1 (555) 234-5678",
    jobTitle: "CTO",
    company: "FalconX",
    companyId: 2,
    location: "San Mateo, CA",
    tags: ["Technical", "Engineering"],
    lastInteraction: "1 week ago",
    connectionStrength: "Strong",
    linkedin: "michaelchen",
    twitter: "@mchen",
    twitterFollowers: 8700,
    bio: "Michael leads the technical team at FalconX, focusing on blockchain infrastructure...",
    avatar: "/placeholder.svg?height=40&width=40&query=MC",
    status: "Active",
  },
  {
    id: 3,
    firstName: "Lisa",
    lastName: "Wang",
    email: "lisa.wang@google.com",
    phone: "+1 (555) 345-6789",
    jobTitle: "VP of Product",
    company: "Google",
    companyId: 3,
    location: "Mountain View, CA",
    tags: ["Product", "Decision Maker"],
    lastInteraction: "3 days ago",
    connectionStrength: "Very strong",
    linkedin: "lisawang",
    twitter: "@lwang",
    twitterFollowers: 12400,
    bio: "Lisa oversees product strategy and development at Google's cloud division...",
    avatar: "/placeholder.svg?height=40&width=40&query=LW",
    status: "Active",
  },
  {
    id: 4,
    firstName: "David",
    lastName: "Kim",
    email: "david.kim@amplitude.com",
    phone: "+1 (555) 456-7890",
    jobTitle: "Head of Sales",
    company: "Amplitude",
    companyId: 4,
    location: "San Francisco, CA",
    tags: ["Sales", "Business Development"],
    lastInteraction: "1 month ago",
    connectionStrength: "Medium",
    linkedin: "davidkim",
    bio: "David leads the enterprise sales team at Amplitude, focusing on Fortune 500 clients...",
    avatar: "/placeholder.svg?height=40&width=40&query=DK",
    status: "Prospect",
  },
  {
    id: 5,
    firstName: "Emma",
    lastName: "Garcia",
    email: "emma.garcia@stripe.com",
    phone: "+1 (555) 567-8901",
    jobTitle: "CFO",
    company: "Stripe",
    companyId: 5,
    location: "San Francisco, CA",
    tags: ["Finance", "Decision Maker"],
    lastInteraction: "2 weeks ago",
    connectionStrength: "Strong",
    linkedin: "emmagarcia",
    twitter: "@egarcia",
    twitterFollowers: 5600,
    bio: "Emma oversees all financial operations at Stripe, with a background in investment banking...",
    avatar: "/placeholder.svg?height=40&width=40&query=EG",
    status: "Active",
  },
  {
    id: 6,
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@notion.so",
    phone: "+1 (555) 678-9012",
    jobTitle: "Head of Marketing",
    company: "Notion",
    companyId: 6,
    location: "San Francisco, CA",
    tags: ["Marketing", "Content"],
    lastInteraction: "5 days ago",
    connectionStrength: "Very strong",
    linkedin: "jameswilson",
    twitter: "@jwilson",
    twitterFollowers: 9800,
    bio: "James leads Notion's global marketing strategy, focusing on community-driven growth...",
    avatar: "/placeholder.svg?height=40&width=40&query=JW",
    status: "Active",
  },
  {
    id: 7,
    firstName: "Sophia",
    lastName: "Martinez",
    email: "sophia.martinez@figma.com",
    phone: "+1 (555) 789-0123",
    jobTitle: "Design Director",
    company: "Figma",
    companyId: 7,
    location: "San Francisco, CA",
    tags: ["Design", "Creative"],
    lastInteraction: "3 weeks ago",
    connectionStrength: "Medium",
    linkedin: "sophiamartinez",
    twitter: "@smartinez",
    twitterFollowers: 14300,
    bio: "Sophia oversees the design team at Figma, with expertise in product and interface design...",
    avatar: "/placeholder.svg?height=40&width=40&query=SM",
    status: "Inactive",
  },
  {
    id: 8,
    firstName: "Alex",
    lastName: "Thompson",
    email: "alex.thompson@airtable.com",
    phone: "+1 (555) 890-1234",
    jobTitle: "Product Manager",
    company: "Airtable",
    companyId: 8,
    location: "San Francisco, CA",
    tags: ["Product", "Technical"],
    lastInteraction: "1 week ago",
    connectionStrength: "Strong",
    linkedin: "alexthompson",
    twitter: "@athompson",
    twitterFollowers: 7200,
    bio: "Alex leads product development for Airtable's enterprise solutions...",
    avatar: "/placeholder.svg?height=40&width=40&query=AT",
    status: "Active",
  },
]

const getConnectionStrengthColor = (strength: string) => {
  switch (strength) {
    case "Very strong":
      return "bg-green-100 text-green-800"
    case "Strong":
      return "bg-blue-100 text-blue-800"
    case "Medium":
      return "bg-yellow-100 text-yellow-800"
    case "Weak":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800"
    case "Prospect":
      return "bg-blue-100 text-blue-800"
    case "VIP":
      return "bg-purple-100 text-purple-800"
    case "Inactive":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

function ContactNameCell({ contact }: { contact: Contact }) {
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("details")

  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "emails", label: "Emails", count: 8, icon: MailIcon },
    { id: "tasks", label: "Tasks", count: 3, icon: CheckCircleIcon },
    { id: "notes", label: "Notes", count: 5, icon: FileTextIcon },
    { id: "meetings", label: "Meetings", count: 4, icon: CalendarIcon },
    { id: "files", label: "Files", count: 2, icon: FolderIcon },
    { id: "activity", label: "Activity", count: null, icon: CalendarIcon },
  ]

  const FullScreenContent = () => {
    const content = (
      <div className="fixed inset-0 z-[9999] bg-background">
        {/* Full Screen Header */}
        <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-background">
              Contacts
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
        <div className="flex h-[calc(100vh-73px)]">
          {/* Left Panel - Details (Persistent) */}
          <div className="w-96 border-r bg-background">
            <ContactDetailsPanel contact={contact} isFullScreen={true} />
          </div>

          {/* Right Panel - Main Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Record Header */}
            <div className="border-b bg-background px-6 py-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={contact.avatar || "/placeholder.svg"}
                    alt={`${contact.firstName} ${contact.lastName}`}
                  />
                  <AvatarFallback>
                    {contact.firstName.charAt(0)}
                    {contact.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">
                    {contact.firstName} {contact.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {contact.jobTitle} at {contact.company}
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
              <ContactTabContent activeTab={activeTab} contact={contact} />
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
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={contact.avatar || "/placeholder.svg"}
                alt={`${contact.firstName} ${contact.lastName}`}
              />
              <AvatarFallback>
                {contact.firstName.charAt(0)}
                {contact.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">
              {contact.firstName} {contact.lastName}
            </span>
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
              Contacts
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
          {/* Record Header */}
          <div className="border-b bg-background px-6 py-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={contact.avatar || "/placeholder.svg"}
                  alt={`${contact.firstName} ${contact.lastName}`}
                />
                <AvatarFallback>
                  {contact.firstName.charAt(0)}
                  {contact.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">
                  {contact.firstName} {contact.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {contact.jobTitle} at {contact.company}
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
            <ContactTabContent activeTab={activeTab} contact={contact} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function ContactDetailsPanel({ contact, isFullScreen = false }: { contact: Contact; isFullScreen?: boolean }) {
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

      {/* Contact Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Contact Details</h4>

        <div className="rounded-lg border border-muted bg-muted/10 p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Name</Label>
                <p className="text-sm font-medium">
                  {contact.firstName} {contact.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="text-sm text-blue-600">{contact.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <p className="text-sm">{contact.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Job Title</Label>
                <p className="text-sm">{contact.jobTitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Company</Label>
                <p className="text-sm text-blue-600">{contact.company}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Location</Label>
                <p className="text-sm">{contact.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <FileTextIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Bio</Label>
                <p className="text-sm">{contact.bio}</p>
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

function ContactTabContent({ activeTab, contact }: { activeTab: string; contact: Contact }) {
  if (activeTab === "details") {
    return <ContactDetailsPanel contact={contact} isFullScreen={false} />
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
          No {activeTab} found for {contact.firstName} {contact.lastName}
        </p>
        <p className="text-sm">Add some {activeTab} to get started</p>
      </div>
    </div>
  )
}

const columns: ColumnDef<Contact>[] = [
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
        Name
        {column.getIsSorted() === "asc" ? (
          <SortAscIcon className="ml-2 h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <SortDescIcon className="ml-2 h-3 w-3" />
        ) : null}
      </Button>
    ),
    cell: ({ row }) => <ContactNameCell contact={row.original} />,
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <a href={`mailto:${row.original.email}`} className="text-sm text-blue-600 hover:underline">
        {row.original.email}
      </a>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span className="text-sm">{row.original.phone}</span>,
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
    cell: ({ row }) => <span className="text-sm">{row.original.jobTitle}</span>,
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.company}</span>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-sm">{row.original.location}</span>,
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 max-w-[200px]">
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
    accessorKey: "lastInteraction",
    header: "Last Interaction",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.lastInteraction}</span>,
  },
  {
    accessorKey: "connectionStrength",
    header: "Connection",
    cell: ({ row }) => (
      <Badge className={`text-xs ${getConnectionStrengthColor(row.original.connectionStrength)}`}>
        {row.original.connectionStrength}
      </Badge>
    ),
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
          <DropdownMenuItem>Edit contact</DropdownMenuItem>
          <DropdownMenuItem>Add to list</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function PeopleTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data: contactsData,
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
              placeholder="Search people..."
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
              <DropdownMenuItem>Active people</DropdownMenuItem>
              <DropdownMenuItem>VIP people</DropdownMenuItem>
              <DropdownMenuItem>By company</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Strong connections</DropdownMenuItem>
              <DropdownMenuItem>Recent interactions</DropdownMenuItem>
            </DropdownMenuContent>
            \
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
