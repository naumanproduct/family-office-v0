"use client"
import {
  CalendarIcon,
  ChevronDownIcon,
  DotIcon as DotsHorizontalIcon,
  SearchIcon,
  SortAscIcon,
  TagIcon,
  UserIcon,
  BuildingIcon,
  PlusIcon,
  FilterIcon,
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
import React, { useState } from "react"

const notesData = [
  {
    id: 1,
    title: "Investment Committee Meeting Notes",
    topic:
      "Discussed the new venture capital opportunity with TechFlow Inc. The committee agreed to proceed with due diligence. Key concerns include market competition and burn rate.",
    author: "Sarah Johnson",
    date: "2 hours ago",
    lastModified: "1 hour ago",
  },
  {
    id: 2,
    title: "Tax Planning Strategy 2024",
    topic:
      "Review of tax optimization strategies for the family office. Considering establishing a new trust structure for international investments.",
    author: "Michael Chen",
    date: "Yesterday",
    lastModified: "Yesterday",
  },
  {
    id: 3,
    title: "Portfolio Rebalancing Analysis",
    topic:
      "Q3 portfolio performance exceeded expectations. Recommend increasing allocation to emerging markets by 5% and reducing fixed income exposure.",
    author: "You",
    date: "3 days ago",
    lastModified: "2 days ago",
  },
  {
    id: 4,
    title: "Real Estate Acquisition Proposal",
    topic:
      "Identified prime commercial property in downtown. Cap rate of 7.5%, stable tenant base. Requires $15M initial investment.",
    author: "David Park",
    date: "Last week",
    lastModified: "5 days ago",
  },
  {
    id: 5,
    title: "Risk Assessment Update",
    topic:
      "Updated risk models show increased exposure to currency fluctuations. Recommend hedging strategy for EUR and GBP positions.",
    author: "Risk Team",
    date: "2 weeks ago",
    lastModified: "1 week ago",
  },
]

export function NotesTable({ onNoteSelect }: { onNoteSelect?: (note: any) => void }) {
  const [notes, setNotes] = useState(notesData)
  const [selectedNote, setSelectedNote] = React.useState<any>(null)

  // Handle note selection
  const handleNoteClick = (note: any) => {
    setSelectedNote(note)
    onNoteSelect?.(note)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input className="h-8 w-[250px]" placeholder="Search notes..." />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filter
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuCheckboxItem>Created (Newest)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Created (Oldest)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Modified (Recent)</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem>Title (A-Z)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Title (Z-A)</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem>Author (A-Z)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Author (Z-A)</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <TagIcon className="mr-2 h-4 w-4" />
                Tags
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuLabel className="text-xs">Tags</DropdownMenuLabel>
              <DropdownMenuCheckboxItem>investment</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>research</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>legal</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>financial</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>meeting</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button size="sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes.map((note) => (
              <TableRow
                key={note.id}
                className="group cursor-pointer hover:bg-muted/50"
                onClick={() => handleNoteClick(note)}
              >
                <TableCell className="font-medium">{note.title}</TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="truncate text-sm text-muted-foreground">{note.topic}</p>
                </TableCell>
                <TableCell>{note.author}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{note.date}</p>
                    <p className="text-xs text-muted-foreground">Modified: {note.lastModified}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DotsHorizontalIcon className="h-4 w-4" />
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
      </div>
    </div>
  )
}
