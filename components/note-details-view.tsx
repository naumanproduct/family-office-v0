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
  CheckSquareIcon,
  TagIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon
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
import { UnifiedDetailsPanel, type DetailSection } from "@/components/shared/unified-details-panel"
import { ComboboxOption } from "@/components/ui/combobox"

interface NoteDetailsViewProps {
  note: any
  onBack: () => void
  hideAddNotes?: boolean
  isFullScreen?: boolean
}

// Note category options
const categoryOptions: ComboboxOption[] = [
  { value: "meeting", label: "Meeting Notes" },
  { value: "research", label: "Research" },
  { value: "idea", label: "Ideas" },
  { value: "personal", label: "Personal" },
  { value: "project", label: "Project Notes" },
  { value: "general", label: "General" },
]

// Note type options
const typeOptions: ComboboxOption[] = [
  { value: "summary", label: "Summary" },
  { value: "detailed", label: "Detailed Notes" },
  { value: "action-items", label: "Action Items" },
  { value: "reference", label: "Reference" },
  { value: "draft", label: "Draft" },
]

// Visibility options
const visibilityOptions: ComboboxOption[] = [
  { value: "private", label: "Private" },
  { value: "team", label: "Team" },
  { value: "public", label: "Public" },
]

export function NoteDetailsView({ note, onBack, hideAddNotes = false, isFullScreen = false }: NoteDetailsViewProps) {
  const [noteTitle, setNoteTitle] = React.useState(note.title || "")
  const [isEditingTitle, setIsEditingTitle] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("details")
  const [fieldValues, setFieldValues] = React.useState({
    title: note?.title || "Untitled Note",
    topic: note?.topic || "",
    author: note?.author || "Unknown Author",
    category: note?.category || "general",
    type: note?.type || "detailed",
    visibility: note?.visibility || "private",
    tags: note?.tags || "",
    createdAt: note?.createdAt || new Date().toISOString(),
    updatedAt: note?.updatedAt || new Date().toISOString(),
  })

  const [noteText, setNoteText] = React.useState(note?.content || "")
  const [filesViewMode, setFilesViewMode] = React.useState<"table" | "card" | "list">("table")
  const [tasksViewMode, setTasksViewMode] = React.useState<"table" | "card" | "list">(isFullScreen ? "table" : "list")

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
    // Here you would typically make an API call to save the change
    console.log(`Updated ${field} to:`, value)
  }

  // Define sections for the details panel
  const sections: DetailSection[] = [
    {
      id: "details",
      title: "Note Details",
      icon: <FileTextIcon className="h-4 w-4 text-muted-foreground" />,
      fields: [
        {
          label: "Topic",
          value: fieldValues.topic,
          editable: true,
          fieldType: "text",
          onChange: (value) => handleFieldEdit("topic", value),
        },
        {
          label: "Category",
          value: fieldValues.category,
          editable: true,
          fieldType: "combobox",
          options: categoryOptions,
          onChange: (value) => handleFieldEdit("category", value),
          formatDisplay: (value) => {
            const option = categoryOptions.find(opt => opt.value === value)
            return option?.label || value
          }
        },
        {
          label: "Type",
          value: fieldValues.type,
          editable: true,
          fieldType: "combobox",
          options: typeOptions,
          onChange: (value) => handleFieldEdit("type", value),
          formatDisplay: (value) => {
            const option = typeOptions.find(opt => opt.value === value)
            return option?.label || value
          }
        },
        {
          label: "Author",
          value: fieldValues.author,
          editable: true,
          fieldType: "text",
          onChange: (value) => handleFieldEdit("author", value),
        },
        {
          label: "Tags",
          value: fieldValues.tags,
          editable: true,
          fieldType: "text",
          onChange: (value) => handleFieldEdit("tags", value),
          formatDisplay: (value) => {
            if (!value) return <span className="text-muted-foreground">No tags</span>
            const tags = value.split(',').map((tag: string) => tag.trim()).filter(Boolean)
            return (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag: string, index: number) => (
                  <span key={index} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-muted">
                    <TagIcon className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )
          }
        },
        {
          label: "Visibility",
          value: fieldValues.visibility,
          editable: true,
          fieldType: "combobox",
          options: visibilityOptions,
          onChange: (value) => handleFieldEdit("visibility", value),
          formatDisplay: (value) => {
            const option = visibilityOptions.find(opt => opt.value === value)
            return option?.label || value
          }
        },
        {
          label: "Created",
          value: fieldValues.createdAt,
          formatDisplay: (value) => new Date(value).toLocaleDateString(),
        },
        {
          label: "Updated",
          value: fieldValues.updatedAt,
          editable: true,
          fieldType: "date",
          onChange: (value) => handleFieldEdit("updatedAt", value),
        },
      ],
    },
  ];

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
        <UnifiedDetailsPanel
          sections={sections}
          isFullScreen={isFullScreen}
          activityContent={!isFullScreen && <NoteActivityContent />}
          additionalContent={
            !hideAddNotes && (
              <div className="rounded-lg border border-muted overflow-hidden">
                <div className="group">
                  <button 
                    className={`w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors bg-muted/20`}
                  >
                    <div className="flex items-center">
                      <ChevronDownIcon className="h-4 w-4 text-muted-foreground mr-2" />
                      <div className="flex items-center gap-2">
                        <EditIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Notes</span>
                      </div>
                    </div>
                  </button>

                  {/* Section Content */}
                  <div className="px-5 pb-3 pt-2">
                    <TypableArea 
                      value={noteText} 
                      onChange={setNoteText} 
                      placeholder="Start typing to add your thoughts..." 
                      showButtons={false} 
                    />
                  </div>
                </div>
              </div>
            )
          }
        />
      ) : (
        <div className={`${isFullScreen ? 'px-6 py-6' : 'p-6'}`}>
          {getTabContent()}
        </div>
      )}
    </div>
  )
}
