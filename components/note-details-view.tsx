"use client"

import * as React from "react"
import {
  FileTextIcon,
  StickyNoteIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  EditIcon,
  FolderIcon,
  CheckSquareIcon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { TypableArea } from "@/components/typable-area"
import { FileContent, getContextualFiles } from "@/components/shared/file-content"
import { UnifiedActivitySection, ActivityItem } from "@/components/shared/unified-activity-section"
import { generateNoteActivities } from "@/components/shared/activity-generators"
import { UnifiedTaskTable } from "@/components/shared/unified-task-table"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { ViewModeSelector } from "@/components/shared/view-mode-selector"

interface NoteDetailsViewProps {
  note: any
  onBack: () => void
  hideAddNotes?: boolean
  isFullScreen?: boolean
}

export function NoteDetailsView({ note, onBack, hideAddNotes = false, isFullScreen = false }: NoteDetailsViewProps) {
  const [noteTitle, setNoteTitle] = React.useState(note.title || "")
  const [isEditingTitle, setIsEditingTitle] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("details")
  const [editingField, setEditingField] = React.useState<string | null>(null)
  const [fieldValues, setFieldValues] = React.useState({
    title: note?.title || "Untitled Note",
    topic: note?.topic || "",
    author: note?.author || "Unknown Author",
    createdAt: note?.createdAt || new Date().toISOString(),
    updatedAt: note?.updatedAt || new Date().toISOString(),
  })

  const [noteText, setNoteText] = React.useState(note?.content || "")
  const [expandedActivity, setExpandedActivity] = React.useState<number | null>(null)
  const [filesViewMode, setFilesViewMode] = React.useState<"table" | "card" | "list">("table")
  const [tasksViewMode, setTasksViewMode] = React.useState<"table" | "card" | "list">(isFullScreen ? "table" : "list")

  // State for which sections are open
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    details: true,
    addNotes: true,
  })

  // Toggle section open/closed
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const tabs = [
    { id: "details", label: "Details", icon: FileTextIcon },
    { id: "tasks", label: "Tasks", icon: CheckSquareIcon },
    { id: "files", label: "Files", icon: FolderIcon }
  ]

  // Mock activities for activity section
  const activities = generateNoteActivities()

  // Mock data for tasks related to this note
  const mockTasks = [
    {
      id: 1,
      title: "Review note content for accuracy",
      status: "In Progress",
      priority: "High",
      assignee: "John Smith",
      dueDate: "2023-06-15",
      description: "Verify all information in the note is accurate and up-to-date."
    },
    {
      id: 2,
      title: "Follow up on action items from note",
      status: "To Do",
      priority: "Medium",
      assignee: "Sarah Johnson",
      dueDate: "2023-06-20",
      description: "Address all action items mentioned in the note."
    },
    {
      id: 3,
      title: "Share note with stakeholders",
      status: "Completed",
      priority: "Low",
      assignee: "Michael Brown",
      dueDate: "2023-06-10",
      description: "Distribute note to all relevant team members."
    },
    {
      id: 4,
      title: "Update note with feedback",
      status: "To Do",
      priority: "Medium",
      assignee: "John Smith",
      dueDate: "2023-06-25",
      description: "Incorporate feedback from stakeholders into the note."
    }
  ]

  const handleFieldEdit = (field: string, value: any) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }))
    setEditingField(null)
  }

  // Activity content component
  const NoteActivityContent = () => {
    return <UnifiedActivitySection activities={activities} />;
  };

  // Custom content for tabs other than details
  const getTabContent = () => {
    if (activeTab === "tasks") {
      return (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Tasks</h3>
            <div className="flex items-center gap-2">
              <ViewModeSelector viewMode={tasksViewMode} onViewModeChange={setTasksViewMode} />
              <Button variant="outline" size="sm" onClick={() => console.log("Add task")}>
                <PlusIcon className="h-4 w-4" />
                Add task
              </Button>
            </div>
          </div>
          <UnifiedTaskTable data={mockTasks} viewMode={tasksViewMode} isInDrawer={!isFullScreen} />
        </>
      );
    } else if (activeTab === "files") {
      // Get contextual files
      const files = getContextualFiles(note?.title);
      
      // Transform files to match TabContentRenderer format
      const transformedFiles = files.map(file => ({
        ...file,
        name: file.name || file.fileName || file.title,
        uploadedBy: file.uploadedBy || "Unknown",
        uploadedDate: file.uploadedDate || (file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : "Unknown"),
        size: file.size || file.fileSize || "Unknown",
      }));
      
      return (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Files</h3>
            <div className="flex items-center gap-2">
              <ViewModeSelector viewMode={filesViewMode} onViewModeChange={setFilesViewMode} />
              <Button variant="outline" size="sm" onClick={() => console.log("Add file")}>
                <PlusIcon className="h-4 w-4" />
                Add file
              </Button>
            </div>
          </div>
          <TabContentRenderer
            activeTab="files"
            viewMode={filesViewMode}
            data={transformedFiles}
          />
        </>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Note Header - Only show when not in fullscreen mode */}
      {!isFullScreen && (
        <div className="border-b bg-background px-6 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <StickyNoteIcon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              {isEditingTitle ? (
                <Input
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsEditingTitle(false)
                    }
                    if (e.key === "Escape") {
                      setNoteTitle(note.title || "")
                      setIsEditingTitle(false)
                    }
                  }}
                  className="text-lg font-semibold border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
              ) : (
                <h2
                  className="text-lg font-semibold cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded -ml-1"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {noteTitle || "Untitled"}
                </h2>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs - hide in fullscreen to avoid duplication */}
      {!isFullScreen && (
        <div className="border-b bg-background px-6 py-1">
          <div className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 whitespace-nowrap py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary rounded-full"></span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "details" ? (
        <div className="flex flex-col flex-1">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 pt-2 pb-6">
              <div className="space-y-5">
                {/* Note Details Card */}
                <div className="rounded-lg border border-muted overflow-hidden">
                  {/* Note Details Section */}
                  <div className="group">
                    <button 
                      onClick={() => toggleSection('details')}
                      className={`w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors ${openSections.details ? 'bg-muted/20' : ''}`}
                    >
                      <div className="flex items-center">
                        {openSections.details ? (
                          <ChevronDownIcon className="h-4 w-4 text-muted-foreground mr-2" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4 text-muted-foreground mr-2" /> 
                        )}
                        <div className="flex items-center gap-2">
                          <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">Note Details</span>
                        </div>
                      </div>
                    </button>

                    {/* Section Content */}
                    {openSections.details && (
                      <div className="px-3 pb-3 pt-2">
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Label className="text-xs text-muted-foreground w-28 shrink-0 ml-2">Topic</Label>
                            <p className="text-sm flex-1">{fieldValues.topic}</p>
                          </div>
                          <div className="flex items-center">
                            <Label className="text-xs text-muted-foreground w-28 shrink-0 ml-2">Author</Label>
                            <p className="text-sm flex-1">{fieldValues.author}</p>
                          </div>
                          <div className="flex items-center">
                            <Label className="text-xs text-muted-foreground w-28 shrink-0 ml-2">Created</Label>
                            <p className="text-sm flex-1">{new Date(fieldValues.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center">
                            <Label className="text-xs text-muted-foreground w-28 shrink-0 ml-2">Updated</Label>
                            <p className="text-sm flex-1">{new Date(fieldValues.updatedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Notes Card - Separate */}
                {!hideAddNotes && (
                  <div className="rounded-lg border border-muted overflow-hidden">
                    <div className="group">
                      <button 
                        onClick={() => toggleSection('addNotes')}
                        className={`w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors ${openSections.addNotes ? 'bg-muted/20' : ''}`}
                      >
                        <div className="flex items-center">
                          {openSections.addNotes ? (
                            <ChevronDownIcon className="h-4 w-4 text-muted-foreground mr-2" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4 text-muted-foreground mr-2" /> 
                          )}
                          <div className="flex items-center gap-2">
                            <EditIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">Notes</span>
                          </div>
                        </div>
                      </button>

                      {/* Section Content */}
                      {openSections.addNotes && (
                        <div className="px-5 pb-3 pt-2">
                          <TypableArea 
                            value={noteText} 
                            onChange={setNoteText} 
                            placeholder="Start typing to add your thoughts..." 
                            showButtons={false} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Section - Fixed at bottom */}
          {!isFullScreen && (
            <div className="border-t bg-background">
              <div className="px-6 py-4">
                <NoteActivityContent />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={`${isFullScreen ? 'px-6 py-6' : 'p-6'}`}>
          {getTabContent()}
        </div>
      )}
    </div>
  )
}
