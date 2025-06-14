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
}

export function NoteContent({ 
  data = defaultNotes, 
  viewMode: initialViewMode = "table", 
  onNoteSelect,
  title = "Notes" 
}: NoteContentProps) {
  const [notes, setNotes] = useState<any[]>(data);
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
