"use client"
import {
  CalendarIcon,
  ChevronDownIcon,
  DotIcon as DotsHorizontalIcon,
  PaperclipIcon,
  SearchIcon,
  SortAscIcon,
  TagIcon,
  BuildingIcon,
  MailIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const emails = [
  {
    id: "EMAIL-1234",
    subject: "Investment Opportunity: Acme Corp Series B",
    preview: "I wanted to discuss the upcoming investment opportunity with Acme Corp...",
    sentAt: "2023-05-15T10:30:00Z",
    from: "john.smith@example.com",
    to: ["investor@yourfirm.com"],
    cc: ["team@yourfirm.com"],
    hasAttachments: true,
    status: "Received",
    priority: "High",
    relatedTo: { type: "Company", name: "Acme Corp" },
  },
  {
    id: "EMAIL-1235",
    subject: "Due Diligence Documents for XYZ Holdings",
    preview: "Please find attached the due diligence documents you requested for XYZ Holdings...",
    sentAt: "2023-05-14T09:15:00Z",
    from: "legal@xyzholdings.com",
    to: ["legal@yourfirm.com"],
    cc: [],
    hasAttachments: true,
    status: "Received",
    priority: "Medium",
    relatedTo: { type: "Entity", name: "XYZ Holdings" },
  },
  {
    id: "EMAIL-1236",
    subject: "Q1 Financial Report - Tech Innovations Inc",
    preview: "Attached is the Q1 financial report for Tech Innovations Inc...",
    sentAt: "2023-05-10T13:45:00Z",
    from: "finance@techinnovations.com",
    to: ["analyst@yourfirm.com"],
    cc: ["team@yourfirm.com"],
    hasAttachments: true,
    status: "Received",
    priority: "Medium",
    relatedTo: { type: "Company", name: "Tech Innovations Inc" },
  },
  {
    id: "EMAIL-1237",
    subject: "Meeting Confirmation: Strategic Planning Session",
    preview: "This email confirms our strategic planning session scheduled for next week...",
    sentAt: "2023-05-08T15:00:00Z",
    from: "you@yourfirm.com",
    to: ["partners@globalventures.com"],
    cc: ["team@yourfirm.com"],
    hasAttachments: false,
    status: "Sent",
    priority: "Low",
    relatedTo: { type: "Entity", name: "Global Ventures" },
  },
  {
    id: "EMAIL-1238",
    subject: "Follow-up: Sunrise Manufacturing Acquisition",
    preview: "Following our discussion about the potential acquisition of Sunrise Manufacturing...",
    sentAt: "2023-05-05T11:20:00Z",
    from: "you@yourfirm.com",
    to: ["ceo@sunrisemanufacturing.com"],
    cc: ["team@yourfirm.com", "legal@yourfirm.com"],
    hasAttachments: false,
    status: "Sent",
    priority: "High",
    relatedTo: { type: "Company", name: "Sunrise Manufacturing" },
  },
]

export function EmailsTable() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search emails..." className="w-full bg-background pl-8" />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <SortAscIcon className="mr-2 h-3.5 w-3.5" />
                Sort
                <ChevronDownIcon className="ml-2 h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Date (newest first)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Date (oldest first)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Subject (A-Z)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Subject (Z-A)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Priority (High-Low)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Priority (Low-High)</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <TagIcon className="mr-2 h-3.5 w-3.5" />
                Filter
                <ChevronDownIcon className="ml-2 h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs">Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem>Sent</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Received</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs">Priority</DropdownMenuLabel>
              <DropdownMenuCheckboxItem>High</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Medium</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Low</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs">Has Attachments</DropdownMenuLabel>
              <DropdownMenuCheckboxItem>Yes</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>No</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>From/To</TableHead>
                <TableHead>Related To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center">
                        {email.subject}
                        {email.hasAttachments && <PaperclipIcon className="h-4 w-4 ml-2 text-muted-foreground" />}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{email.preview}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(email.sentAt).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MailIcon className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {email.status === "Sent"
                          ? `To: ${email.to[0]}${email.to.length > 1 ? ` +${email.to.length - 1}` : ""}`
                          : `From: ${email.from}`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {email.relatedTo.type === "Company" ? (
                        <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{email.relatedTo.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        email.status === "Sent" ? "outline" : email.status === "Received" ? "default" : "secondary"
                      }
                    >
                      {email.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        email.priority === "High" ? "destructive" : email.priority === "Medium" ? "default" : "outline"
                      }
                    >
                      {email.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <DotsHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Reply</DropdownMenuItem>
                        <DropdownMenuItem>Forward</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
