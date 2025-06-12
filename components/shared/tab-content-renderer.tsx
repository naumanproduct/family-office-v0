import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { MoreVerticalIcon, PlusIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { UnifiedTaskTable } from "./unified-task-table"

// Define the types of handlers for different item types
interface TabContentRendererHandlers {
  onTaskClick?: (task: any) => void
  onNoteClick?: (note: any) => void
  onMeetingClick?: (meeting: any) => void
  onEmailClick?: (email: any) => void
  onAdd?: () => void
}

// Define the interface for custom tab renderers
interface CustomTabRenderers {
  [tabId: string]: (isFullScreen?: boolean) => React.ReactNode
}

interface TabContentRendererProps extends TabContentRendererHandlers {
  activeTab: string
  viewMode: "card" | "list" | "table"
  data: any[]
  customTabRenderers?: CustomTabRenderers
}

/**
 * A shared component for rendering tab content across all entity types.
 * 
 * This component handles the common pattern of rendering different views
 * (table, card, list) for standard tabs, while allowing custom renderers
 * for special tabs like "details", "company", etc.
 */
export function TabContentRenderer({
  activeTab,
  viewMode,
  data,
  customTabRenderers = {},
  onTaskClick,
  onNoteClick,
  onMeetingClick,
  onEmailClick,
  onAdd,
  isFullScreen = false,
}: TabContentRendererProps & { isFullScreen?: boolean }) {
  // Check if there's a custom renderer for this tab
  if (customTabRenderers[activeTab]) {
    return customTabRenderers[activeTab](isFullScreen)
  }

  // Otherwise, use the standard view based on viewMode
  if (viewMode === "table") {
    return (
      <TableView
        data={data}
        activeTab={activeTab}
        onTaskClick={onTaskClick}
        onNoteClick={onNoteClick}
        onMeetingClick={onMeetingClick}
        onEmailClick={onEmailClick}
        onAdd={onAdd}
      />
    )
  }

  if (viewMode === "card") {
    return (
      <CardView
        data={data}
        activeTab={activeTab}
        onTaskClick={onTaskClick}
        onNoteClick={onNoteClick}
        onMeetingClick={onMeetingClick}
        onEmailClick={onEmailClick}
        onAdd={onAdd}
      />
    )
  }

  // Default to list view
  return (
    <ListView
      data={data}
      activeTab={activeTab}
      onTaskClick={onTaskClick}
      onNoteClick={onNoteClick}
      onMeetingClick={onMeetingClick}
      onEmailClick={onEmailClick}
      onAdd={onAdd}
    />
  )
}

// Shared Empty State component
function EmptyState({ activeTab, onAdd }: { activeTab: string; onAdd?: () => void }) {
  // Convert tab name (e.g. "tasks") to singular form (e.g. "task")
  const singularForm = activeTab.endsWith('s') ? activeTab.slice(0, -1) : activeTab;
  
  return (
    <div className="text-center py-12 border-2 border-dashed rounded-lg">
      <p className="text-sm text-muted-foreground mb-4">No {activeTab} found</p>
      <Button variant="outline" size="sm" onClick={onAdd}>
        <PlusIcon className="h-4 w-4 mr-2" />
        Add {singularForm}
      </Button>
    </div>
  )
}

// Standard TableView component
function TableView({
  data,
  activeTab,
  onTaskClick,
  onNoteClick,
  onMeetingClick,
  onEmailClick,
  onAdd,
}: {
  data: any[]
  activeTab: string
} & TabContentRendererHandlers) {
  if (data.length === 0) {
    return <EmptyState activeTab={activeTab} onAdd={onAdd} />
  }

  // If this is the tasks tab, use our unified task table component
  if (activeTab === "tasks") {
    return <UnifiedTaskTable data={data} onTaskClick={onTaskClick} viewMode="table" />
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {activeTab === "emails" && (
              <>
                <TableHead>Subject</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </>
            )}
            {activeTab === "notes" && (
              <>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </>
            )}
            {activeTab === "meetings" && (
              <>
                <TableHead>Title</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead className="w-12"></TableHead>
              </>
            )}
            {activeTab === "files" && (
              <>
                <TableHead>Name</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="w-12"></TableHead>
              </>
            )}
            {activeTab === "team" && (
              <>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              className={`${
                (activeTab === "tasks" && onTaskClick) ||
                (activeTab === "notes" && onNoteClick) ||
                (activeTab === "meetings" && onMeetingClick) ||
                (activeTab === "emails" && onEmailClick)
                  ? "cursor-pointer hover:bg-muted/50"
                  : ""
              }`}
              onClick={() => {
                if (activeTab === "tasks" && onTaskClick) {
                  onTaskClick(item)
                } else if (activeTab === "notes" && onNoteClick) {
                  onNoteClick(item)
                } else if (activeTab === "meetings" && onMeetingClick) {
                  onMeetingClick(item)
                } else if (activeTab === "emails" && onEmailClick) {
                  onEmailClick(item)
                }
              }}
            >
              {activeTab === "emails" && (
                <>
                  <TableCell className="font-medium">{item.subject}</TableCell>
                  <TableCell>{item.from}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Unread" ? "default" : "outline"}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Reply</DropdownMenuItem>
                        <DropdownMenuItem>Forward</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </>
              )}
              {activeTab === "notes" && (
                <>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </>
              )}
              {activeTab === "meetings" && (
                <>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.date} {item.time && `• ${item.time}`}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status}</Badge>
                  </TableCell>
                  <TableCell>{typeof item.attendees === 'number' ? `${item.attendees} people` : item.attendees?.join(', ') || '-'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </>
              )}
              {activeTab === "files" && (
                <>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.uploadedBy}</TableCell>
                  <TableCell>{item.uploadedDate}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </>
              )}
              {activeTab === "team" && (
                <>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </>
              )}
              {/* Add implementations for other tab types as needed */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// Standard CardView component
function CardView({
  data,
  activeTab,
  onTaskClick,
  onNoteClick,
  onMeetingClick,
  onEmailClick,
  onAdd,
}: {
  data: any[]
  activeTab: string
} & TabContentRendererHandlers) {
  if (data.length === 0) {
    return <EmptyState activeTab={activeTab} onAdd={onAdd} />
  }
  
  // If this is the tasks tab, use our unified task table component
  if (activeTab === "tasks") {
    return <UnifiedTaskTable data={data} onTaskClick={onTaskClick} viewMode="card" />
  }
  
  // Function to handle task completion toggle
  const handleTaskStatusToggle = (e: React.MouseEvent, task: any) => {
    e.stopPropagation();
    // Toggle the status between "completed" and "pending"
    const newStatus = task.status.toLowerCase() === "completed" ? "pending" : "completed";
    // Update the task (in a real app, this would call an API or update global state)
    task.status = newStatus;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((item) => (
        <Card
          key={item.id}
          className={`${
            (activeTab === "tasks" && onTaskClick) ||
            (activeTab === "notes" && onNoteClick) ||
            (activeTab === "meetings" && onMeetingClick) ||
            (activeTab === "emails" && onEmailClick)
              ? "cursor-pointer hover:bg-muted/50"
              : ""
          }`}
          onClick={() => {
            if (activeTab === "tasks" && onTaskClick) {
              onTaskClick(item)
            } else if (activeTab === "notes" && onNoteClick) {
              onNoteClick(item)
            } else if (activeTab === "meetings" && onMeetingClick) {
              onMeetingClick(item)
            } else if (activeTab === "emails" && onEmailClick) {
              onEmailClick(item)
            }
          }}
        >
          <CardContent className="p-4">
            {activeTab === "tasks" && (
              <div className="flex gap-4">
                <div onClick={(e) => e.stopPropagation()} className="mt-1">
                  <div className="group relative flex items-center justify-center">
                    <Checkbox 
                      className="h-4 w-4 rounded-full border-2 group-hover:border-primary/70 transition-colors"
                      checked={item.status.toLowerCase() === "completed"} 
                      onCheckedChange={() => handleTaskStatusToggle(window.event as unknown as React.MouseEvent, item)}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className={`font-medium ${item.status.toLowerCase() === "completed" ? "line-through text-muted-foreground" : ""}`}>{item.title}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskStatusToggle(e, item);
                          }}
                        >
                          {item.status.toLowerCase() === "completed" ? "Mark as Pending" : "Mark as Completed"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        item.priority === "High" ? "destructive" : item.priority === "Medium" ? "default" : "secondary"
                      }
                      className="mr-1"
                    >
                      {item.priority}
                    </Badge>
                    <Badge variant={item.status.toLowerCase() === "completed" ? "secondary" : "outline"}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                    <span>{item.assignee}</span>
                    <span>{item.dueDate}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <>
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{item.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{item.date}</p>
              </>
            )}

            {activeTab === "emails" && (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.subject}</p>
                        <p className="text-xs text-muted-foreground">From: {item.from}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                        <div className="mt-1">
                          <Badge variant={item.status === "Unread" ? "default" : "outline"} className="text-xs">
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{item.preview}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Reply</DropdownMenuItem>
                      <DropdownMenuItem>Forward</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}

            {activeTab === "meetings" && (
              <>
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{item.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{item.date} {item.time && `• ${item.time}`}</p>
              </>
            )}

            {activeTab === "files" && (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Uploaded by: {item.uploadedBy}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{item.uploadedDate}</p>
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.size}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{item.description || item.preview || item.content}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Download</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}

            {activeTab === "team" && (
              <>
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{item.name}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{item.role}</p>
                <p className="mt-2 text-xs text-muted-foreground">{item.email}</p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Standard ListView component
function ListView({
  data,
  activeTab,
  onTaskClick,
  onNoteClick,
  onMeetingClick,
  onEmailClick,
  onAdd,
}: {
  data: any[]
  activeTab: string
} & TabContentRendererHandlers) {
  if (data.length === 0) {
    return <EmptyState activeTab={activeTab} onAdd={onAdd} />
  }
  
  // If this is the tasks tab, use our unified task table component
  if (activeTab === "tasks") {
    return <UnifiedTaskTable data={data} onTaskClick={onTaskClick} viewMode="list" />
  }
  
  // Function to handle task completion toggle
  const handleTaskStatusToggle = (e: React.MouseEvent, task: any) => {
    e.stopPropagation();
    // Toggle the status between "completed" and "pending"
    const newStatus = task.status.toLowerCase() === "completed" ? "pending" : "completed";
    // Update the task (in a real app, this would call an API or update global state)
    task.status = newStatus;
  }

  return (
    <div className="divide-y">
      {data.map((item) => (
        <div
          key={item.id}
          className={`py-4 ${
            (activeTab === "tasks" && onTaskClick) ||
            (activeTab === "notes" && onNoteClick) ||
            (activeTab === "meetings" && onMeetingClick) ||
            (activeTab === "emails" && onEmailClick)
              ? "cursor-pointer hover:bg-muted/50"
              : ""
          }`}
          onClick={() => {
            if (activeTab === "tasks" && onTaskClick) {
              onTaskClick(item)
            } else if (activeTab === "notes" && onNoteClick) {
              onNoteClick(item)
            } else if (activeTab === "meetings" && onMeetingClick) {
              onMeetingClick(item)
            } else if (activeTab === "emails" && onEmailClick) {
              onEmailClick(item)
            }
          }}
        >
          {activeTab === "tasks" && (
            <div className="flex items-start">
              <div onClick={(e) => e.stopPropagation()} className="mt-1 mr-4">
                <div className="group relative flex items-center justify-center">
                  <Checkbox 
                    className="h-4 w-4 rounded-full border-2 group-hover:border-primary/70 transition-colors"
                    checked={item.status.toLowerCase() === "completed"} 
                    onCheckedChange={() => handleTaskStatusToggle(window.event as unknown as React.MouseEvent, item)}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className={`font-medium ${item.status.toLowerCase() === "completed" ? "line-through text-muted-foreground" : ""}`}>{item.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskStatusToggle(e, item);
                        }}
                      >
                        {item.status.toLowerCase() === "completed" ? "Mark as Pending" : "Mark as Completed"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={
                      item.priority === "High" ? "destructive" : item.priority === "Medium" ? "default" : "secondary"
                    }
                    className="mr-1"
                  >
                    {item.priority}
                  </Badge>
                  <Badge variant={item.status.toLowerCase() === "completed" ? "secondary" : "outline"}>
                    {item.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                  <span>{item.assignee}</span>
                  <span>{item.dueDate}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.date}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {activeTab === "meetings" && (
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <div className="flex gap-2 mt-1">
                  <p className="text-sm text-muted-foreground">{item.date} {item.time && `• ${item.time}`}</p>
                  <Badge variant="outline">{item.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {typeof item.attendees === 'number' ? `${item.attendees} people` : item.attendees?.join(', ') || '-'}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          
          {activeTab === "emails" && (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium">{item.subject}</h3>
                <p className="text-sm text-muted-foreground mt-1">From: {item.from}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                  <Badge variant={item.status === "Unread" ? "default" : "outline"}>{item.status}</Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View</DropdownMenuItem>
                  <DropdownMenuItem>Reply</DropdownMenuItem>
                  <DropdownMenuItem>Forward</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          
          {activeTab === "files" && (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-muted-foreground">Uploaded by: {item.uploadedBy}</p>
                  <p className="text-sm text-muted-foreground">{item.uploadedDate}</p>
                  <Badge variant="outline">{item.size}</Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View</DropdownMenuItem>
                  <DropdownMenuItem>Download</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          
          {activeTab === "team" && (
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.role}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Send Message</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
