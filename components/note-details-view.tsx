"use client"

import * as React from "react"
import {
  FileTextIcon,
  StickyNoteIcon,
  BuildingIcon,
  UsersIcon,
  LayoutIcon,
  DollarSignIcon,
  TrendingUpIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TypableArea } from "@/components/typable-area"
import { FileContent } from "@/components/shared/file-content"
import { UnifiedDetailsPanel, type DetailSection } from "@/components/shared/unified-details-panel"
import { UnifiedActivitySection, type ActivityItem } from "@/components/shared/unified-activity-section"

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
    content: note?.content || "",
    priority: note?.priority || "Normal",
    author: note?.author || "",
    createdAt: note?.createdAt || new Date().toISOString(),
    updatedAt: note?.updatedAt || new Date().toISOString(),
    tags: note?.tags || [],
    relatedTo: note?.relatedTo || { type: "", name: "" },
  })

  const [noteText, setNoteText] = React.useState("")
  const [expandedActivity, setExpandedActivity] = React.useState<number | null>(null)

  const tabs = [
    { id: "details", label: "Details", icon: FileTextIcon },
    { id: "files", label: "Files", icon: FileTextIcon },
  ]

  // Mock data for related entities
  const relatedData = {
    companies: [
      { id: 1, name: "Acme Corp", type: "Portfolio Company" },
      { id: 2, name: "TechFlow Inc.", type: "Investment Target" },
    ],
    people: [
      { id: 1, name: "Sarah Johnson", role: "CEO" },
      { id: 2, name: "Michael Chen", role: "Investment Manager" },
    ],
    entities: [
      { id: 1, name: "Family Trust #1231", type: "Family Trust" },
      { id: 2, name: "Offshore Holdings LLC", type: "Holding Company" },
    ],
    investments: [
      { id: 1, name: "Series B Round", amount: "$5M" },
      { id: 2, name: "Real Estate Venture", amount: "$3.2M" },
    ],
    opportunities: [
      { id: 1, name: "Green Energy Fund", status: "In Discussion" },
      { id: 2, name: "Tech Startup Acquisition", status: "Due Diligence" },
    ],
  }

  // Mock activities for activity section
  const activities: ActivityItem[] = [
    {
      id: 1,
      type: "update",
      actor: "Sarah Johnson",
      action: "updated",
      target: "note contents",
      timestamp: "2 days ago",
      date: "2025-01-28",
      details: {
        previousContent: "Initial draft of investment thesis",
        newContent: "Updated investment thesis with market analysis",
        reason: "Incorporated new market research findings",
      },
    },
    {
      id: 2,
      type: "meeting",
      actor: "Investment Team",
      action: "referenced this note in",
      target: "quarterly planning meeting",
      timestamp: "1 week ago",
      date: "2025-01-23",
      details: {
        meetingTitle: "Q1 Investment Strategy",
        relevance: "Key document for understanding target market",
        participants: ["Sarah Johnson", "Michael Chen", "David Williams"],
      },
    },
    {
      id: 3,
      type: "creation",
      actor: "Michael Chen",
      action: "created",
      target: "this note",
      timestamp: "1 month ago",
      date: "2024-12-28",
      details: {
        purpose: "Document investment thesis for upcoming opportunities",
        initialTags: ["Investment", "Strategy", "Research"],
      },
    },
  ]

  const getPriorityColor = (priority: string | undefined | null) => {
    if (!priority) return "bg-gray-100 text-gray-800"

    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleFieldEdit = (field: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }))
    setEditingField(null)
  }

  // Mock navigation handler for related records
  const navigateToRecord = (recordType: string, id: number) => {
    console.log(`Navigate to ${recordType} record with ID: ${id}`)
    // This would be implemented to navigate to the record
  }

  // Mock handler for adding a linked record
  const handleAddRecord = (sectionId: string) => {
    console.log(`Add new ${sectionId} record for ${note.title}`)
    // This would open the appropriate creation dialog
  }

  // Mock handler for removing a linked record
  const handleUnlinkRecord = (sectionId: string, id: number) => {
    console.log(`Unlink ${sectionId} record with ID ${id} from ${note.title}`)
    // This would handle removal of the relationship
  }

  // Custom note input component
  const renderNoteInput = () => {
    if (hideAddNotes) return null

    return <TypableArea value={noteText} onChange={setNoteText} placeholder="Add notes..." showButtons={false} />
  }

  // Activity content component
  const NoteActivityContent = () => {
    return <UnifiedActivitySection activities={activities} />
  }

  // Define all sections for the details panel
  const sections: DetailSection[] = [
    {
      id: "details",
      title: "Note Details",
      icon: <FileTextIcon className="h-4 w-4 text-muted-foreground" />,
      fields: [
        {
          label: "Content",
          value: fieldValues.content,
        },
        {
          label: "Priority",
          value: <Badge className={getPriorityColor(fieldValues.priority)}>{fieldValues.priority}</Badge>,
        },
        {
          label: "Author",
          value: fieldValues.author,
        },
        {
          label: "Created",
          value: new Date(fieldValues.createdAt).toLocaleDateString(),
        },
        {
          label: "Updated",
          value: new Date(fieldValues.updatedAt).toLocaleDateString(),
        },
        {
          label: "Tags",
          value: (
            <div className="flex flex-wrap gap-1">
              {Array.isArray(fieldValues.tags) ? (
                fieldValues.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary" className="text-xs">
                  {fieldValues.tags}
                </Badge>
              )}
            </div>
          ),
        },
        {
          label: "Related to",
          value: (
            <div className="flex items-center gap-2">
              <span className="text-sm">{fieldValues.relatedTo?.type || "N/A"}</span>
              <span className="text-sm font-medium">{fieldValues.relatedTo?.name || "N/A"}</span>
            </div>
          ),
        },
      ],
    },
    {
      id: "companies",
      title: "Companies",
      icon: <BuildingIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.companies,
      },
    },
    {
      id: "people",
      title: "People",
      icon: <UsersIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.people,
      },
    },
    {
      id: "entities",
      title: "Entities",
      icon: <LayoutIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.entities,
      },
    },
    {
      id: "investments",
      title: "Investments",
      icon: <DollarSignIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.investments,
      },
    },
    {
      id: "opportunities",
      title: "Opportunities",
      icon: <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />,
      sectionData: {
        items: relatedData.opportunities,
      },
    },
  ]

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
              <p className="text-sm text-muted-foreground">Note • {note.id}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs - Only show when not in fullscreen mode */}
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
          onNavigateToRecord={navigateToRecord}
          onAddRecord={handleAddRecord}
          onUnlinkRecord={handleUnlinkRecord}
          activityContent={<NoteActivityContent />}
          additionalContent={renderNoteInput()}
        />
      ) : (
        <div className={`${isFullScreen ? "px-6 py-6" : "p-6"}`}>
          <FileContent />
        </div>
      )}
    </div>
  )
}
