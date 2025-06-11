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
    return <EmptyState activeTab={activeTab} />
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
            {activeTab === "tasks" && (
              <>
                <TableHead>Title</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
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
                <TableHead className="w-12"></TableHead>
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
              {activeTab === "tasks" && (
                <>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.dueDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.priority === "High" ? "destructive" : item.priority === "Medium" ? "default" : "secondary"
                      }
                    >
                      {item.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.assignee}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status}</Badge>
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
                        <DropdownMenuItem>Edit</DropdownMenuItem>
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item) => (
        <div
          key={item.id}
          className={`rounded-lg border p-4 ${
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
          {/* Implement card views for different tab types */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{item.title || item.subject || item.name}</h3>
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
            <div className="text-sm text-muted-foreground flex-1">
              {item.description || item.preview || item.content}
            </div>
            <div className="mt-2 pt-2 border-t flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {item.date || item.dueDate || (item.createdAt && new Date(item.createdAt).toLocaleDateString())}
              </div>
              {item.status && (
                <Badge variant="outline" className="text-xs">
                  {item.status}
                </Badge>
              )}
            </div>
          </div>
        </div>
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

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div
          key={item.id}
          className={`rounded-lg border p-4 ${
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
          {/* Email List Item */}
          {activeTab === "emails" && (
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
          )}

          {/* Task List Item */}
          {activeTab === "tasks" && (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">Assigned to: {item.assignee}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Due: {item.dueDate}</p>
                    <div className="mt-1 flex items-center gap-1 justify-end">
                      <Badge
                        variant={
                          item.priority === "High"
                            ? "destructive"
                            : item.priority === "Medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {item.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
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

          {/* Generic list item for other types */}
          {activeTab !== "emails" && activeTab !== "tasks" && (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title || item.name || item.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.date || 
                       item.dueDate || 
                       (item.createdAt && new Date(item.createdAt).toLocaleDateString())}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                  {item.description || item.content || item.preview}
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
        </div>
      ))}
    </div>
  )
}
