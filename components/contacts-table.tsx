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
  flexRender,
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
  FileTextIcon,
  MailIcon,
  CalendarIcon,
  FolderIcon,
  ClockIcon,
  MessageSquareIcon,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MasterDrawer } from "@/components/master-drawer"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { MasterDetailsPanel } from "@/components/shared/master-details-panel"

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
    avatar: "/placeholder.svg?height=40&width=40",
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
    avatar: "/placeholder.svg?height=40&width=40",
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
    avatar: "/placeholder.svg?height=40&width=40",
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
    avatar: "/placeholder.svg?height=40&width=40",
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
    avatar: "/placeholder.svg?height=40&width=40",
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
    avatar: "/placeholder.svg?height=40&width=40",
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
    avatar: "/placeholder.svg?height=40&width=40",
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
    avatar: "/placeholder.svg?height=40&width=40",
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
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: ClockIcon },
    { id: "notes", label: "Notes", count: 1, icon: MessageSquareIcon },
    { id: "meetings", label: "Meetings", count: 4, icon: CalendarIcon },
    { id: "emails", label: "Emails", count: 3, icon: MailIcon },
    { id: "files", label: "Files", count: 5, icon: FolderIcon },
  ]

  const renderTabContent = (
    activeTab: string,
    viewMode: "card" | "list" | "table",
    setSelectedTask?: (task: any) => void,
    setSelectedNote?: (note: any) => void,
    setSelectedMeeting?: (meeting: any) => void,
    setSelectedEmail?: (email: any) => void,
  ) => {
    // For other tabs, use TabContentRenderer instead of custom implementations
    const data = getContactTabData(activeTab, contact)

    // Create custom tab renderers for special tabs
    const customTabRenderers = {
      details: (isFullScreen = false) => <ContactDetailsPanel contact={contact} isFullScreen={isFullScreen} />,
    }

    // Create a handler for "add" actions for empty states
    const handleAdd = () => {
      console.log(`Add new ${activeTab.slice(0, -1)} for ${contact.firstName} ${contact.lastName}`)
      // In a real implementation, this would open the appropriate modal or form
    }

    return (
      <TabContentRenderer
        activeTab={activeTab}
        viewMode={viewMode}
        data={data}
        customTabRenderers={customTabRenderers}
        onTaskClick={setSelectedTask}
        onNoteClick={setSelectedNote}
        onMeetingClick={setSelectedMeeting}
        onEmailClick={setSelectedEmail}
        onAdd={handleAdd}
      />
    )
  }

  const renderDetailsPanel = (isFullScreen = false) => {
    return <ContactDetailsPanel contact={contact} isFullScreen={isFullScreen} />
  }

  const customActions: React.ReactNode[] = []

  return (
    <MasterDrawer
      trigger={
        <Button variant="link" className="px-0 h-auto font-medium flex items-center gap-2 text-left">
          <Avatar className="h-8 w-8">
            {contact.avatar && (
              <AvatarImage
                src={contact.avatar || "/placeholder.svg"}
                alt={`${contact.firstName} ${contact.lastName}`}
              />
            )}
            <AvatarFallback>
              {contact.firstName.charAt(0)}
              {contact.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span>
              {contact.firstName} {contact.lastName}
            </span>
            <span className="text-xs text-muted-foreground">{contact.email}</span>
          </div>
        </Button>
      }
      title={`${contact.firstName} ${contact.lastName}`}
      recordType="Contact"
      subtitle={`${contact.jobTitle} at ${contact.company}`}
      tabs={tabs}
      detailsPanel={renderDetailsPanel}
      customActions={customActions}
      onComposeEmail={() => console.log("Compose email to", contact.email)}
    >
      {renderTabContent}
    </MasterDrawer>
  )
}

function getContactTabData(activeTab: string, contact: Contact) {
  switch (activeTab) {
    case "emails":
      return [
        {
          id: 1,
          subject: "Meeting Request",
          from: contact.email,
          date: "2 hours ago",
          status: "Unread",
          preview: `Hello, I would like to schedule a meeting to discuss...`,
          type: "received",
        },
        {
          id: 2,
          subject: "Follow-up",
          from: "me@company.com",
          date: "1 day ago",
          status: "Sent",
          preview: `Hi ${contact.firstName}, thank you for our meeting yesterday...`,
          type: "sent",
        },
      ]
    case "tasks":
      return [
        {
          id: 1,
          title: `Send information to ${contact.firstName}`,
          priority: "High",
          status: "pending",
          assignee: "You",
          dueDate: "Tomorrow",
          description: `Prepare and send requested information to ${contact.firstName} ${contact.lastName}`,
        },
        {
          id: 2,
          title: "Schedule follow-up call",
          priority: "Medium",
          status: "pending",
          assignee: "You",
          dueDate: "Next week",
          description: `Schedule a follow-up call with ${contact.firstName} to discuss next steps`,
        },
      ]
    case "notes":
      return [
        {
          id: 1,
          title: "Initial Contact Notes",
          date: "2 weeks ago",
          content: `First meeting with ${contact.firstName}. Discussed potential collaboration opportunities.`,
        },
        {
          id: 2,
          title: "Background Information",
          date: "1 month ago",
          content: `${contact.firstName} previously worked at InnovateTech for 5 years before joining ${contact.company}.`,
        },
      ]
    case "meetings":
      return [
        {
          id: 1,
          title: "Introductory Call",
          date: "Tomorrow, 2:00 PM",
          status: "Scheduled",
          attendees: ["You", contact.firstName + " " + contact.lastName],
        },
        {
          id: 2,
          title: "Project Review",
          date: "Next Monday, 10:00 AM",
          status: "Scheduled",
          attendees: ["You", contact.firstName + " " + contact.lastName, "Sarah Johnson"],
        },
      ]
    case "files":
      return [
        {
          id: 1,
          name: "Contact Profile.pdf",
          uploadedBy: "You",
          uploadedDate: "2 weeks ago",
          size: "1.4 MB",
          type: "pdf",
        },
        {
          id: 2,
          name: "Meeting Notes.docx",
          uploadedBy: "Sarah Johnson",
          uploadedDate: "1 month ago",
          size: "0.8 MB",
          type: "docx",
        },
      ]
    default:
      return []
  }
}

function ContactActivityContent({ contact }: { contact: Contact }) {
  const [expandedActivity, setExpandedActivity] = React.useState<number | null>(null)

  const activities = [
    {
      id: 1,
      type: "meeting",
      actor: "You",
      action: "had a meeting with",
      target: `${contact.firstName} ${contact.lastName}`,
      timestamp: "3 days ago",
      date: "2025-01-27",
      details: {
        type: "Video Call",
        duration: "45 minutes",
        topics: ["Partnership opportunities", "Q1 planning", "Budget discussion"],
        outcome: "Positive discussion, follow-up scheduled",
        nextSteps: "Send proposal by Friday, schedule technical review",
      },
    },
    {
      id: 2,
      type: "email",
      actor: contact.firstName,
      action: "sent email about",
      target: "Project collaboration",
      timestamp: "1 week ago",
      date: "2025-01-23",
      details: {
        subject: "Re: Partnership Proposal",
        type: "Response",
        sentiment: "Positive",
        keyPoints: ["Interested in collaboration", "Budget approved", "Timeline discussion needed"],
        followUp: "Schedule technical review meeting",
      },
    },
    {
      id: 3,
      type: "role_change",
      actor: contact.firstName,
      action: "was promoted to",
      target: contact.jobTitle,
      timestamp: "2 months ago",
      date: "2024-11-28",
      details: {
        previousRole: "Senior Manager",
        newRole: contact.jobTitle,
        company: contact.company,
        effectiveDate: "2024-12-01",
        impact: "Increased decision-making authority, larger budget responsibility",
      },
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>
      case "email":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>
      case "role_change":
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>
    }
  }

  const formatActivityText = (activity: any) => {
    return (
      <span>
        <span className="font-medium">{activity.actor}</span>{" "}
        <span className="text-muted-foreground">{activity.action}</span>{" "}
        <span className="font-medium">{activity.target}</span>
      </span>
    )
  }

  const renderExpandedDetails = (activity: any) => {
    switch (activity.type) {
      case "meeting":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Meeting Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span> <span>{activity.details.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span> <span>{activity.details.duration}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Topics Discussed</h5>
              <p className="text-sm text-muted-foreground">{activity.details.topics.join(", ")}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Outcome</h5>
              <p className="text-sm text-muted-foreground">{activity.details.outcome}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Next Steps</h5>
              <p className="text-sm text-muted-foreground">{activity.details.nextSteps}</p>
            </div>
          </div>
        )
      case "email":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Email Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Subject:</span> <span>{activity.details.subject}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span> <span>{activity.details.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Sentiment:</span> <span>{activity.details.sentiment}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Key Points</h5>
              <p className="text-sm text-muted-foreground">{activity.details.keyPoints.join(", ")}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Follow Up</h5>
              <p className="text-sm text-muted-foreground">{activity.details.followUp}</p>
            </div>
          </div>
        )
      case "role_change":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Role Change Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Previous Role:</span>{" "}
                  <span>{activity.details.previousRole}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">New Role:</span> <span>{activity.details.newRole}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Company:</span> <span>{activity.details.company}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Effective Date:</span>{" "}
                  <span>{activity.details.effectiveDate}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Impact</h5>
              <p className="text-sm text-muted-foreground">{activity.details.impact}</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
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
  )
}

function ContactDetailsPanel({ contact, isFullScreen = false }: { contact: Contact; isFullScreen?: boolean }) {
  const fieldGroups = [
    {
      id: "contact-info",
      label: "Contact Details",
      icon: UserIcon,
      fields: [
        { label: "Name", value: `${contact.firstName} ${contact.lastName}` },
        { label: "Email", value: contact.email, isLink: true },
        { label: "Phone", value: contact.phone },
        { label: "Job Title", value: contact.jobTitle },
        { label: "Company", value: contact.company, isLink: true },
        { label: "Location", value: contact.location },
        { label: "Bio", value: contact.bio },
      ],
    },
  ]

  // Define additional content with Activity section
  const additionalContent = (
    <>
      {/* Show all values button */}
      <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
        Show all values (including social profiles)
      </Button>

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
          <ContactActivityContent contact={contact} />
        </div>
      )}
    </>
  )

  return (
    <MasterDetailsPanel fieldGroups={fieldGroups} isFullScreen={isFullScreen} additionalContent={additionalContent} />
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
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add contact
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
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

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 py-1 text-sm"
            >
              {[10, 25, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
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
              <ChevronLeftIcon className="h-4 w-4" />
              <ChevronLeftIcon className="h-4 w-4" />
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
              <ChevronDownIcon className="h-4 w-4 rotate-[-90deg]" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronDownIcon className="h-4 w-4 rotate-[-90deg]" />
              <ChevronDownIcon className="h-4 w-4 rotate-[-90deg]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
