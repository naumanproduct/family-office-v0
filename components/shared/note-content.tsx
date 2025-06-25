"use client"
import { useState } from "react"
import {
  CalendarIcon,
  ChevronDownIcon,
  DotIcon as DotsHorizontalIcon,
  SearchIcon,
  SortAscIcon,
  TagIcon,
  UserIcon,
  BuildingIcon,
  FileTextIcon,
  PlusIcon,
  LayoutGridIcon,
  ListIcon,
  TableIcon,
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
import { ViewModeSelector } from "@/components/shared/view-mode-selector"

// Function to get context-specific notes based on task title
export function getContextualNotes(taskTitle?: string) {
  // Main task: Update capital schedule – Call #4
  if (!taskTitle || taskTitle.includes("Update capital schedule – Call #4")) {
    return [
      {
        id: "NOTE-4001",
        title: "Capital Call #4 Fund Parameters",
        content: "Call #4 is for $15M to fund the acquisition of TechVantage Solutions. This represents 15% of total commitments. Fund has $65M called to date (65%), with $35M remaining uncalled capital (35%).",
        createdAt: "2023-10-18T09:30:00Z",
        updatedAt: "2023-10-18T14:45:00Z",
        date: "4 days ago",
        lastModified: "4 days ago",
        author: "Michael Chen",
        priority: "High",
        tags: ["capital call", "fund management", "call #4"],
        relatedTo: { type: "Fund", name: "Growth Fund III" },
      },
      {
        id: "NOTE-4002",
        title: "TechVantage Acquisition Terms",
        content: "TechVantage Solutions acquisition - $28M total consideration with $15M from this capital call and $13M from existing fund reserves. Deal expected to close on November 15th pending final regulatory approvals.",
        createdAt: "2023-10-17T11:20:00Z",
        updatedAt: "2023-10-17T15:10:00Z",
        date: "5 days ago",
        lastModified: "5 days ago",
        author: "Sarah Johnson",
        priority: "Medium",
        tags: ["acquisition", "techvantage", "investment"],
        relatedTo: { type: "Company", name: "TechVantage Solutions" },
      },
      {
        id: "NOTE-4003",
        title: "Capital Call #4 Timeline",
        content: "Capital Call #4 schedule: Capital call notices to be issued by Oct 25th, payment due by Nov 10th (15 day period), with company acquisition closing scheduled for Nov 15th.",
        createdAt: "2023-10-16T14:15:00Z",
        updatedAt: "2023-10-16T16:20:00Z",
        date: "6 days ago",
        lastModified: "6 days ago",
        author: "Emily Watson",
        priority: "High",
        tags: ["timeline", "capital call", "call #4"],
        relatedTo: { type: "Fund", name: "Growth Fund III" },
      },
    ];
  }
  
  // Subtask 1: Calculate pro-rata allocation
  else if (taskTitle.includes("Calculate pro-rata allocation")) {
    return [
      {
        id: "NOTE-4101",
        title: "LP Commitment Percentages",
        content: "Current LP commitment breakdown: Apex Capital Partners (25%), Summit Ventures LLC (20%), Ridge Family Office (15%), Meridian Holdings (40%). Updated after Ridge's secondary sale of 5% to Meridian last quarter.",
        createdAt: "2023-10-19T10:30:00Z",
        updatedAt: "2023-10-19T14:45:00Z",
        date: "3 days ago",
        lastModified: "3 days ago",
        author: "Michael Chen",
        priority: "High",
        tags: ["LP allocation", "commitments", "pro-rata"],
        relatedTo: { type: "Fund", name: "Growth Fund III" },
      },
      {
        id: "NOTE-4102",
        title: "Call #4 Calculation Notes",
        content: "For Call #4 ($15M), calculated amounts are: Apex Capital ($3.75M), Summit Ventures ($3M), Ridge Family ($2.25M), Meridian Holdings ($6M). Confirmed with accounting department on October 19.",
        createdAt: "2023-10-19T13:15:00Z",
        updatedAt: "2023-10-19T16:20:00Z",
        date: "3 days ago",
        lastModified: "3 days ago",
        author: "David Park",
        priority: "Medium",
        tags: ["calculations", "call #4", "allocation"],
        relatedTo: { type: "Fund", name: "Growth Fund III" },
      }
    ];
  }
  
  // Subtask 2: Update LP capital accounts
  else if (taskTitle.includes("Update LP capital accounts")) {
    return [
      {
        id: "NOTE-4201",
        title: "Capital Account Update Process",
        content: "Remember to update both committed capital percentage and the called capital tracking in the LP portal. System requires update to fund data first, then individual LP records.",
        createdAt: "2023-10-20T09:45:00Z",
        updatedAt: "2023-10-20T11:30:00Z",
        date: "2 days ago",
        lastModified: "2 days ago",
        author: "Jessica Martinez",
        priority: "Medium",
        tags: ["capital accounts", "system", "process"],
        relatedTo: { type: "System", name: "LP Portal" },
      },
      {
        id: "NOTE-4202",
        title: "Historical Capital Account Data",
        content: "Call #1: $10M (10%), Call #2: $25M (25%), Call #3: $30M (30%), Current Call #4: $15M (15%). Total called after this call will be $80M (80%).",
        createdAt: "2023-10-20T14:20:00Z",
        updatedAt: "2023-10-20T16:40:00Z",
        date: "2 days ago",
        lastModified: "2 days ago",
        author: "Michael Chen",
        priority: "High",
        tags: ["historical data", "capital calls", "tracking"],
        relatedTo: { type: "Fund", name: "Growth Fund III" },
      }
    ];
  }
  
  // Subtask 3: Generate capital call notices
  else if (taskTitle.includes("Generate capital call notices")) {
    return [
      {
        id: "NOTE-4301",
        title: "Call Notice Template Updates",
        content: "Using updated capital call template approved by legal in September. New template includes expanded wire instructions section and digital signature capability.",
        createdAt: "2023-10-21T08:15:00Z",
        updatedAt: "2023-10-21T10:20:00Z",
        date: "Yesterday",
        lastModified: "Yesterday",
        author: "Emily Watson",
        priority: "Medium",
        tags: ["template", "call notices", "legal"],
        relatedTo: { type: "Document", name: "Capital Call Template" },
      },
      {
        id: "NOTE-4302",
        title: "LP Special Instructions",
        content: "Remember Meridian Holdings requires 2 business days advance notice before formal call notice. Ridge Family Office needs notice copied to their new administrative email: admin@ridgefamily.com",
        createdAt: "2023-10-21T13:40:00Z",
        updatedAt: "2023-10-21T15:10:00Z",
        date: "Yesterday",
        lastModified: "Yesterday",
        author: "Sarah Johnson",
        priority: "High",
        tags: ["LP instructions", "process", "call notices"],
        relatedTo: { type: "Process", name: "LP Communication Protocol" },
      }
    ];
  }
  
  // Subtask 4: Update fund commitment tracker
  else if (taskTitle.includes("Update fund commitment tracker")) {
    return [
      {
        id: "NOTE-4401",
        title: "Fund Tracker Spreadsheet Location",
        content: "Latest version of commitment tracker is in the shared drive: Finance/Fund III/Capital Calls/Tracker_v3.4.xlsx - Make sure to back up before updating.",
        createdAt: "2023-10-22T09:10:00Z",
        updatedAt: "2023-10-22T09:30:00Z",
        date: "Today",
        lastModified: "Today",
        author: "Michael Chen",
        priority: "Medium",
        tags: ["tracker", "spreadsheet", "commitments"],
        relatedTo: { type: "Document", name: "Fund Commitment Tracker" },
      },
      {
        id: "NOTE-4402",
        title: "New Reporting Requirements",
        content: "After Call #4, we'll exceed 75% called capital threshold, triggering quarterly reporting requirements to Investment Committee on uncalled capital plans.",
        createdAt: "2023-10-22T11:45:00Z",
        updatedAt: "2023-10-22T14:15:00Z",
        date: "Today",
        lastModified: "Today",
        author: "Thomas Wong",
        priority: "High",
        tags: ["reporting", "investment committee", "requirements"],
        relatedTo: { type: "Process", name: "IC Reporting" },
      }
    ];
  }
  
  // Subtask 5: Reconcile capital schedule
  else if (taskTitle.includes("Reconcile capital schedule")) {
    return [
      {
        id: "NOTE-4501",
        title: "Previous Reconciliation Issues",
        content: "Last reconciliation for Call #3 found a $50K discrepancy in Apex Capital's account. Issue was due to FX conversion rate difference. Confirm with accounting on any similar watch items for Call #4.",
        createdAt: "2023-10-22T15:30:00Z",
        updatedAt: "2023-10-22T17:20:00Z",
        date: "Today",
        lastModified: "Today",
        author: "Jessica Martinez",
        priority: "High",
        tags: ["reconciliation", "previous issues", "accounting"],
        relatedTo: { type: "Process", name: "Capital Reconciliation" },
      },
      {
        id: "NOTE-4502",
        title: "Reconciliation Checklist",
        content: "Steps for reconciliation: 1) Compare LP management system data vs. accounting system, 2) Verify total called amounts match fund admin records, 3) Check individual LP records match capital accounts, 4) Confirm percentages align with LP agreements, 5) Document and resolve any discrepancies.",
        createdAt: "2023-10-22T16:15:00Z",
        updatedAt: "2023-10-22T16:45:00Z",
        date: "Today",
        lastModified: "Today",
        author: "David Park",
        priority: "Medium",
        tags: ["process", "checklist", "reconciliation"],
        relatedTo: { type: "Process", name: "Capital Reconciliation" },
      }
    ];
  }
  
  // Default case - return general notes
  else {
    return defaultNotes;
  }
}

// Default mock data, can be overridden by passing data prop
const defaultNotes = [
  {
    id: "NOTE-1234",
    title: "Investment Thesis for Acme Corp",
    content: "Acme Corp shows strong potential for growth in the renewable energy sector...",
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-15T14:45:00Z",
    date: "2 days ago",
    lastModified: "12 hours ago",
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
    date: "3 days ago",
    lastModified: "3 days ago",
    author: "Sarah Johnson",
    priority: "Medium",
    tags: ["legal", "merger"],
    relatedTo: { type: "Entity", name: "XYZ Holdings" },
  },
  // More notes can be added here
]

export type NoteContentProps = {
  data?: any[] // Optional - if not provided, uses default mock data
  viewMode?: "table" | "card" | "list" // Optional - defaults to table
  onNoteSelect?: (note: any) => void // Optional - callback when a note is selected
  title?: string // Optional - section title
  taskTitle?: string // Optional - used to contextually filter notes
}

export function NoteContent({ 
  data, 
  viewMode: initialViewMode = "table", 
  onNoteSelect,
  title = "Notes",
  taskTitle
}: NoteContentProps) {
  // Use contextual notes if no data is provided
  const initialData = data || getContextualNotes(taskTitle);
  const [notes, setNotes] = useState<any[]>(initialData);
  const [selectedNote, setSelectedNote] = useState<any>(null)
  const [viewMode, setViewMode] = useState(initialViewMode)

  const handleNoteSelect = (note: any) => {
    if (onNoteSelect) {
      onNoteSelect(note)
    } else {
      setSelectedNote(note)
    }
  }

  const createNewNote = () => {
    const newNote = {
      id: `NOTE-${Math.floor(1000 + Math.random() * 9000)}`,
      title: "New Note",
      content: "Click to edit this note...",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      date: "Just now",
      lastModified: "Just now",
      author: "You",
      priority: "Medium",
      tags: ["new"],
      relatedTo: { type: "", name: "" },
    };
    
    // Add the new note to the beginning of the array
    setNotes([newNote, ...notes]);
    
    // Select the new note to open the drawer
    handleNoteSelect(newNote);
  };

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
          <ViewModeSelector viewMode={viewMode} onViewModeChange={setViewMode} />
          <Button size="sm" onClick={createNewNote}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>
      </div>

      {viewMode === "table" && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.map((note) => (
                  <TableRow 
                    key={note.id} 
                    className="cursor-pointer hover:bg-muted/50" 
                    onClick={() => handleNoteSelect(note)}
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
                        <span>{note.date || new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {note.lastModified || 
                        (note.updatedAt && new Date(note.updatedAt).toLocaleDateString())}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{note.author}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {note.tags?.slice(0, 2).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {note.tags?.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{note.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                            <DotsHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleNoteSelect(note);
                          }}>
                            View
                          </DropdownMenuItem>
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
      )}

      {viewMode === "list" && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {notes.map((note) => (
                <div 
                  key={note.id} 
                  className="flex items-center justify-between border-b pb-4 cursor-pointer hover:bg-muted/50 rounded-md p-2"
                  onClick={() => handleNoteSelect(note)}
                >
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium">{note.title}</h4>
                      <div className="text-xs text-muted-foreground">
                        {note.date || new Date(note.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{note.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {note.tags?.map((tag: string, index: number) => index < 3 && (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {note.tags?.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{note.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <UserIcon className="h-3 w-3 text-muted-foreground" />
                          <span>{note.author}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                              <DotsHorizontalIcon className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleNoteSelect(note);
                            }}>
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <Card key={note.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleNoteSelect(note)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-base">{note.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">{note.content}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags?.map((tag: string, index: number) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{note.date || new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{note.author}</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleNoteSelect(note);
                      }}>
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
