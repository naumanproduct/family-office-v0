"use client"

import * as React from "react"
import {
  FileTextIcon,
  FileIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  EditIcon,
  FolderIcon,
  CheckSquareIcon,
  ChevronDown,
  ChevronRight
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
import { formatDate } from "@/lib/utils"
import { UnifiedDetailsPanel } from "@/components/shared/unified-details-panel"
import { buildStandardDetailSections } from "@/components/shared/detail-section-builder"

interface NoteDetailsViewProps {
  note: any
  onBack: () => void
  hideAddNotes?: boolean
  isFullScreen?: boolean
  onTabChange?: (tab: string) => void
}

export function NoteDetailsView({ note, onBack, hideAddNotes = false, isFullScreen = false, onTabChange }: NoteDetailsViewProps) {
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
    notes: true,
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
    { id: "files", label: "Files", icon: FolderIcon },
    { id: "tasks", label: "Tasks", icon: CheckSquareIcon }
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
        uploadedDate: file.uploadedDate || (file.uploadedAt ? formatDate(new Date(file.uploadedAt)) : "Unknown"),
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

  // Call onTabChange when tab changes
  React.useEffect(() => {
    if (onTabChange) {
      onTabChange(activeTab)
    }
  }, [activeTab, onTabChange])

  return (
    <div className="flex flex-col flex-1">
      {/* Note Header - Only show when not in fullscreen mode */}
      {!isFullScreen && (
        <div className="border-b bg-background px-6 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <FileIcon className="h-4 w-4" />
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
          {/* Use UnifiedDetailsPanel to show all related sections */}
          <UnifiedDetailsPanel
            sections={buildStandardDetailSections({
              infoTitle: "Note Details",
              infoIcon: <FileTextIcon className="h-4 w-4 text-muted-foreground" />,
              infoFields: [
                { label: "Topic", value: fieldValues.topic },
                { label: "Author", value: fieldValues.author },
                { label: "Created", value: formatDate(new Date(fieldValues.createdAt)) },
                { label: "Updated", value: formatDate(new Date(fieldValues.updatedAt)) }
              ],
              // Remove all related sections for notes
              companies: [],
              people: [],
              entities: [],
              investments: [],
              opportunities: [],
              hideWhenEmpty: true
            })}
            activityContent={<NoteActivityContent />}
            isFullScreen={isFullScreen}
            additionalContent={
              // Add Notes section as additional content - only show when not in full screen
              !isFullScreen ? (
                <div className="rounded-lg border border-muted overflow-hidden">
                  <button
                    onClick={() => toggleSection('notes')}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                  >
                    {openSections.notes ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Notes</span>
                  </button>
                  
                  {openSections.notes && (
                    <div className="px-4 pb-4 pt-1">
                      <TypableArea
                        value={noteText}
                        onChange={setNoteText}
                        placeholder="Add notes..."
                        showButtons={false}
                      />
                    </div>
                  )}
                </div>
              ) : null
            }
          />
        </div>
      ) : (
        <div className={`${isFullScreen ? 'px-6 py-6' : 'p-6'}`}>
          {getTabContent()}
        </div>
      )}
    </div>
  )
}
