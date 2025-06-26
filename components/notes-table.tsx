"use client"
import {
  FileIcon,
  PlusIcon,
  MoreVerticalIcon,
  CalendarIcon,
  ChevronDownIcon,
  SearchIcon,
  SortAscIcon,
  UserIcon,
  TagIcon,
  ChevronLeftIcon,
  ExpandIcon,
  FileTextIcon,
  MailIcon,
  FolderIcon,
  CheckCircleIcon,
  UsersIcon,
  BuildingIcon,
  UserRoundIcon,
  LayoutIcon,
  DollarSignIcon,
  TrendingUpIcon,
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
import React from "react"

const notes = [
  {
    id: "NOTE-1234",
    title: "Investment Thesis for Acme Corp",
    content: "Acme Corp shows strong potential for growth in the renewable energy sector...",
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-15T14:45:00Z",
    author: "John Smith",
    priority: "High",
    tags: ["investment", "research"],
    relatedTo: { type: "Company", name: "Acme Corp" },
  },
  {
    id: "NOTE-1235",
    title: "Legal Review of Merger Documents",
    content: "The merger documents for XYZ Holdings require additional scrutiny in section 5.3...",
    createdAt: "2023-05-14T09:15:00Z",
    updatedAt: "2023-05-14T16:20:00Z",
    author: "Sarah Johnson",
    priority: "Medium",
    tags: ["legal", "merger"],
    relatedTo: { type: "Entity", name: "XYZ Holdings" },
  },
  {
    id: "NOTE-1236",
    title: "Quarterly Financial Analysis",
    content: "Q1 financial results show a 15% increase in revenue compared to previous quarter...",
    createdAt: "2023-05-10T13:45:00Z",
    updatedAt: "2023-05-12T11:30:00Z",
    author: "Michael Brown",
    priority: "High",
    tags: ["financial", "quarterly"],
    relatedTo: { type: "Company", name: "Tech Innovations Inc" },
  },
  {
    id: "NOTE-1237",
    title: "Meeting Notes: Strategic Planning",
    content: "The strategic planning session identified three key growth areas for the next fiscal year...",
    createdAt: "2023-05-08T15:00:00Z",
    updatedAt: "2023-05-08T17:30:00Z",
    author: "Emily Davis",
    priority: "Low",
    tags: ["meeting", "strategy"],
    relatedTo: { type: "Entity", name: "Global Ventures" },
  },
  {
    id: "NOTE-1238",
    title: "Due Diligence Findings",
    content: "Initial due diligence reveals potential concerns in the target company's supply chain...",
    createdAt: "2023-05-05T11:20:00Z",
    updatedAt: "2023-05-07T09:45:00Z",
    author: "Robert Wilson",
    priority: "High",
    tags: ["due diligence", "acquisition"],
    relatedTo: { type: "Company", name: "Sunrise Manufacturing" },
  },
]

export function NotesTable({ onNoteSelect }: { onNoteSelect?: (note: any) => void }) {
  const [selectedNote, setSelectedNote] = React.useState<any>(null)
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search notes..." className="w-full bg-background pl-8" />
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
              <DropdownMenuCheckboxItem>Title (A-Z)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Title (Z-A)</DropdownMenuCheckboxItem>
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
              <DropdownMenuLabel className="text-xs">Priority</DropdownMenuLabel>
              <DropdownMenuCheckboxItem>High</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Medium</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Low</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs">Tags</DropdownMenuLabel>
              <DropdownMenuCheckboxItem>Investment</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Legal</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Research</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Meeting</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Financial</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Related To</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.map((note) => (
                <TableRow
                  key={note.id}
                  className="group cursor-pointer hover:bg-muted/50"
                  onClick={() => onNoteSelect?.(note)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{note.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{note.content}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{note.author}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {note.relatedTo.type === "Company" ? (
                        <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{note.relatedTo.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        note.priority === "High" ? "destructive" : note.priority === "Medium" ? "default" : "outline"
                      }
                    >
                      {note.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVerticalIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
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
