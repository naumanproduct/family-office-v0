"use client"

import { Button } from "@/components/ui/button"
import { FileIcon, FileTextIcon, ActivityIcon, ListTodoIcon, FileTextIcon as NoteIcon, FileIcon as DocumentIcon } from "lucide-react"
import { MasterDrawer } from "@/components/master-drawer"
import { FileDetailsView } from "./file-details-view"

// Helper function to get file icon based on type
const getFileIcon = (fileType: string) => {
  switch (fileType?.toUpperCase()) {
    case "PDF":
      return <FileTextIcon className="h-4 w-4 text-red-500" />
    case "DOCX":
    case "DOC":
      return <FileTextIcon className="h-4 w-4 text-blue-500" />
    case "XLSX":
    case "XLS":
      return <FileTextIcon className="h-4 w-4 text-green-500" />
    case "PPTX":
    case "PPT":
      return <FileTextIcon className="h-4 w-4 text-orange-500" />
    default:
      return <FileIcon className="h-4 w-4 text-gray-500" />
  }
}

export function FileNameCell({ file }: { file: any }) {
  // Define the tabs for the master drawer
  const tabs = [
    { id: "details", label: "Details", count: null, icon: DocumentIcon },
    { id: "activity", label: "Activity", count: null, icon: ActivityIcon },
    { id: "tasks", label: "Tasks", count: null, icon: ListTodoIcon },
    { id: "notes", label: "Notes", count: null, icon: NoteIcon },
  ]

  // Function to render the content for each tab
  const renderTabContent = (
    activeTab: string,
    viewMode: "card" | "list" | "table",
    setSelectedTask?: (task: any) => void,
    setSelectedNote?: (note: any) => void,
    setSelectedMeeting?: (meeting: any) => void,
    setSelectedEmail?: (email: any) => void,
  ) => {
    const mockTasks = [
      {
        id: 1,
        title: "Review file permissions",
        priority: "Medium",
        status: "pending",
        assignee: "You",
        dueDate: "Tomorrow",
        description: "Review access permissions and update if necessary.",
      },
      {
        id: 2,
        title: "Update file metadata",
        priority: "Low",
        status: "completed",
        assignee: "You",
        dueDate: "Yesterday",
        description: "Update file tags and categorization.",
      },
    ]

    const mockNotes = [
      {
        id: 1,
        title: "File review notes",
        date: "2 days ago",
        content: `This file contains important information regarding ${file.title || file.name}.`,
        tags: ["File", "Review"],
      },
    ]

    const mockActivity = [
      {
        id: 1,
        type: "upload",
        user: file.uploadedBy,
        date: file.uploadedDate || new Date(file.uploadedAt).toLocaleDateString(),
        description: `Uploaded file "${file.title || file.name}"`,
      },
      {
        id: 2,
        type: "view",
        user: "You",
        date: "Today",
        description: `Viewed file "${file.title || file.name}"`,
      },
    ]

    switch (activeTab) {
      case "details":
        return (
          <div className="p-6">
            <FileDetailsView file={file} />
          </div>
        )
      case "activity":
        return (
          <div className="divide-y">
            {mockActivity.map((activity) => (
              <div key={activity.id} className="p-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs">{activity.user.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      case "tasks":
        return (
          <div className="divide-y">
            {mockTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedTask?.(task)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.priority} • Due {task.dueDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      case "notes":
        return (
          <div className="divide-y">
            {mockNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedNote?.(note)}
              >
                <div>
                  <p className="font-medium text-sm">{note.title}</p>
                  <p className="text-xs text-muted-foreground">{note.date}</p>
                  <p className="mt-2 text-sm line-clamp-2">{note.content}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {note.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-muted rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      default:
        return <div className="p-6">No content available</div>
    }
  }

  // Function to render the details panel
  const renderDetailsPanel = (isFullScreen = false) => {
    return <FileDetailsView file={file} isFullScreen={isFullScreen} />
  }

  // Custom actions for the master drawer
  const customActions: React.ReactNode[] = []

  return (
    <MasterDrawer
      trigger={
        <Button variant="link" className="w-fit px-0 text-left text-foreground h-auto">
          <div className="flex items-center gap-2">
            {getFileIcon(file.fileType || file.type)}
            <span className="font-medium">{file.title || file.name}</span>
          </div>
        </Button>
      }
      title={file.title || file.name}
      recordType="File"
      subtitle={`${(file.fileType || file.type || "FILE").toUpperCase()} • ${file.fileSize || file.size}`}
      tabs={tabs}
      detailsPanel={renderDetailsPanel}
      customActions={customActions}
    >
      {renderTabContent}
    </MasterDrawer>
  )
} 