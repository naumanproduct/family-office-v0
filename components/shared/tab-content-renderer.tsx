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
import { MoreVerticalIcon, PlusIcon, MailIcon, FileTextIcon, FileIcon, CalendarIcon, FolderIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { UnifiedTaskTable } from "./unified-task-table"
import { RecordCard } from "./record-card"
import { RecordListItem } from "./record-list-item"

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
                <TableHead className="w-12"></TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>From</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </>
            )}
            {activeTab === "notes" && (
              <>
                <TableHead className="w-12"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </>
            )}
            {activeTab === "meetings" && (
              <>
                <TableHead className="w-12"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead className="w-12"></TableHead>
              </>
            )}
            {activeTab === "files" && (
              <>
                <TableHead className="w-12"></TableHead>
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
              className={`group ${
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
                  <TableCell className="w-12">
                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="font-medium text-sm">{item.subject}</TableCell>
                  <TableCell className="text-sm">{item.from}</TableCell>
                  <TableCell className="text-sm">{item.date}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Unread" ? "default" : "outline"}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
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
                  <TableCell className="w-12">
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="font-medium text-sm">{item.title}</TableCell>
                  <TableCell className="text-sm">{item.author}</TableCell>
                  <TableCell className="text-sm">{item.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
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
                  <TableCell className="w-12">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="font-medium text-sm">{item.title}</TableCell>
                  <TableCell className="text-sm">{item.date} {item.time && `• ${item.time}`}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{typeof item.attendees === 'number' ? `${item.attendees} people` : item.attendees?.join(', ') || '-'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
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
                  <TableCell className="w-12">
                    <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="font-medium text-sm">{item.name}</TableCell>
                  <TableCell className="text-sm">{item.uploadedBy}</TableCell>
                  <TableCell className="text-sm">{item.uploadedDate}</TableCell>
                  <TableCell className="text-sm">{item.size}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
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
                  <TableCell className="font-medium text-sm">{item.name}</TableCell>
                  <TableCell className="text-sm">{item.role}</TableCell>
                  <TableCell className="text-sm">{item.email}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
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
      {data.map((item) => {
        // Common action items for dropdown menu
        const commonActions = [
          { label: "View", onClick: () => {} },
          { label: "Edit", onClick: () => {} },
          { label: "Delete", onClick: () => {}, variant: "destructive" as const },
        ];
        
        // Content-specific configurations
        if (activeTab === "notes") {
          return (
            <RecordCard
          key={item.id}
              title={item.title}
              primaryMetadata={item.tags ? item.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              )) : []}
              secondaryMetadata={{
                left: item.author || "",
                right: item.date || ""
              }}
              onClick={() => onNoteClick?.(item)}
              actions={commonActions}
              leadingElement={<FileIcon className="h-4 w-4 text-muted-foreground" />}
            />
          );
        }
        
        if (activeTab === "emails") {
          return (
            <RecordCard
              key={item.id}
              title={item.subject}
              primaryMetadata={[
                <Badge key="status" variant={item.status === "Unread" ? "default" : "outline"}>
                      {item.status}
                    </Badge>
              ]}
              secondaryMetadata={{
                left: item.from,
                right: item.date
              }}
              onClick={() => onEmailClick?.(item)}
              actions={[
                { label: "View", onClick: () => {} },
                { label: "Reply", onClick: () => {} },
                { label: "Forward", onClick: () => {} },
                { label: "Delete", onClick: () => {}, variant: "destructive" as const },
              ]}
              leadingElement={<MailIcon className="h-4 w-4 text-muted-foreground" />}
            />
          );
        }
        
        if (activeTab === "meetings") {
          return (
            <RecordCard
              key={item.id}
              title={item.title}
              primaryMetadata={[
                <Badge key="status" variant="outline">
                            {item.status}
                          </Badge>
              ]}
              secondaryMetadata={{
                left: typeof item.attendees === 'number' 
                  ? `${item.attendees} people` 
                  : item.attendees?.join(', ') || '-',
                right: `${item.date}${item.time ? ` • ${item.time}` : ""}`
              }}
              onClick={() => onMeetingClick?.(item)}
              actions={commonActions}
              leadingElement={<CalendarIcon className="h-4 w-4 text-muted-foreground" />}
            />
          );
        }
        
        if (activeTab === "files") {
          return (
            <RecordCard
              key={item.id}
              title={item.name}
              primaryMetadata={[
                <Badge key="size" variant="outline">
                            {item.size}
                          </Badge>
              ]}
              secondaryMetadata={{
                left: item.uploadedBy,
                right: item.uploadedDate
              }}
              onClick={() => {}}
              actions={[
                { label: "View", onClick: () => {} },
                { label: "Download", onClick: () => {} },
                { label: "Delete", onClick: () => {}, variant: "destructive" as const },
              ]}
              leadingElement={<FileTextIcon className="h-4 w-4 text-muted-foreground" />}
            />
          );
        }
        
        if (activeTab === "team") {
          return (
            <RecordCard
              key={item.id}
              title={item.name}
              primaryMetadata={[]}
              secondaryMetadata={{
                left: item.role || "",
                right: item.email || ""
              }}
              onClick={() => {}}
              actions={[
                { label: "View Profile", onClick: () => {} },
                { label: "Send Message", onClick: () => {} },
                { label: "Schedule Meeting", onClick: () => {} },
              ]}
            />
          );
        }
        
        // Default fallback (should not happen if all content types are handled)
        return (
          <RecordCard
            key={item.id}
            title={item.title || item.name || "Untitled"}
            primaryMetadata={[]}
            secondaryMetadata={{
              left: "",
              right: ""
            }}
            onClick={() => {}}
            actions={commonActions}
          />
        );
      })}
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
      {data.map((item) => {
        // Common action items for dropdown menu
        const commonActions = [
          { label: "View", onClick: () => {} },
          { label: "Edit", onClick: () => {} },
          { label: "Delete", onClick: () => {}, variant: "destructive" as const },
        ];
        
        // Content-specific configurations
        if (activeTab === "notes") {
          return (
            <RecordListItem
          key={item.id}
              title={item.title}
              primaryMetadata={item.tags ? item.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              )) : []}
              secondaryMetadata={{
                left: item.author || "",
                right: item.date || ""
              }}
              onClick={() => onNoteClick?.(item)}
              actions={commonActions}
              leadingElement={<FileIcon className="h-4 w-4 text-muted-foreground" />}
            />
          );
        }
        
        if (activeTab === "emails") {
          return (
            <RecordListItem
              key={item.id}
              title={item.subject}
              primaryMetadata={[
                <Badge key="status" variant={item.status === "Unread" ? "default" : "outline"}>
                  {item.status}
                </Badge>
              ]}
              secondaryMetadata={{
                left: item.from,
                right: item.date
              }}
              onClick={() => onEmailClick?.(item)}
              actions={[
                { label: "View", onClick: () => {} },
                { label: "Reply", onClick: () => {} },
                { label: "Forward", onClick: () => {} },
                { label: "Delete", onClick: () => {}, variant: "destructive" as const },
              ]}
              leadingElement={<MailIcon className="h-4 w-4 text-muted-foreground" />}
            />
          );
        }
        
        if (activeTab === "meetings") {
          return (
            <RecordListItem
              key={item.id}
              title={item.title}
              primaryMetadata={[
                <Badge key="status" variant="outline">
                    {item.status}
                  </Badge>
              ]}
              secondaryMetadata={{
                left: typeof item.attendees === 'number' 
                  ? `${item.attendees} people` 
                  : item.attendees?.join(', ') || '-',
                right: `${item.date}${item.time ? ` • ${item.time}` : ""}`
              }}
              onClick={() => onMeetingClick?.(item)}
              actions={commonActions}
              leadingElement={<CalendarIcon className="h-4 w-4 text-muted-foreground" />}
            />
          );
        }
        
        if (activeTab === "files") {
          return (
            <RecordListItem
              key={item.id}
              title={item.name}
              primaryMetadata={[
                <Badge key="size" variant="outline">
                  {item.size}
                </Badge>
              ]}
              secondaryMetadata={{
                left: item.uploadedBy,
                right: item.uploadedDate
              }}
              onClick={() => {}}
              actions={[
                { label: "View", onClick: () => {} },
                { label: "Download", onClick: () => {} },
                { label: "Delete", onClick: () => {}, variant: "destructive" as const },
              ]}
              leadingElement={<FileTextIcon className="h-4 w-4 text-muted-foreground" />}
            />
          );
        }
        
        if (activeTab === "team") {
          return (
            <RecordListItem
              key={item.id}
              title={item.name}
              primaryMetadata={[]}
              secondaryMetadata={{
                left: item.role || "",
                right: item.email || ""
              }}
              onClick={() => {}}
              actions={[
                { label: "View Profile", onClick: () => {} },
                { label: "Send Message", onClick: () => {} },
                { label: "Schedule Meeting", onClick: () => {} },
              ]}
            />
          );
        }
        
        // Default fallback (should not happen if all content types are handled)
        return (
          <RecordListItem
            key={item.id}
            title={item.title || item.name || "Untitled"}
            primaryMetadata={[]}
            secondaryMetadata={{
              left: "",
              right: ""
            }}
            onClick={() => {}}
            actions={commonActions}
          />
        );
      })}
    </div>
  )
}
