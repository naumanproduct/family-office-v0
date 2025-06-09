"use client"

import * as React from "react"
import {
  CalendarIcon,
  UserIcon,
  AlertTriangleIcon,
  FileTextIcon,
  StickyNoteIcon,
  InfoIcon,
  TagIcon,
  BuildingIcon,
  PlusIcon,
  ChevronDownIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TypableArea } from "@/components/typable-area"

interface NoteDetailsViewProps {
  note: any
  onBack: () => void
  isFullScreen?: boolean
}

export function NoteDetailsView({ note, onBack, isFullScreen = false }: NoteDetailsViewProps) {
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

  // Use a different tabs list when in full screen mode (exclude details tab)
  const tabs = isFullScreen 
    ? [] // No tabs needed in full screen mode as details are shown on the left
    : [{ id: "details", label: "Details", icon: FileTextIcon }]

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

  const renderEditableField = (
    field: string,
    value: string,
    icon: React.ReactNode,
    label: string,
    isBadge = false,
    isTextarea = false,
  ) => {
    const isEditing = editingField === field

    return (
      <div className="flex items-start gap-2">
        <div className="mt-1">{icon}</div>
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <Label className="text-xs text-muted-foreground mt-1">{label}</Label>
            {isEditing ? (
              isTextarea ? (
                <Textarea
                  value={value}
                  onChange={(e) => setFieldValues((prev) => ({ ...prev, [field]: e.target.value }))}
                  onBlur={() => handleFieldEdit(field, value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setEditingField(null)
                    }
                  }}
                  className="text-sm min-h-[80px]"
                  autoFocus
                />
              ) : (
                <Input
                  value={value}
                  onChange={(e) => setFieldValues((prev) => ({ ...prev, [field]: e.target.value }))}
                  onBlur={() => handleFieldEdit(field, value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFieldEdit(field, value)
                    }
                    if (e.key === "Escape") {
                      setEditingField(null)
                    }
                  }}
                  className="h-6 text-sm w-32"
                  autoFocus
                />
              )
            ) : (
              <div className="flex-1">
                {isBadge ? (
                  <Badge className={`text-xs ${getPriorityColor(value as string)}`}>{value}</Badge>
                ) : Array.isArray(value) ? (
                  <div className="flex flex-wrap gap-1">
                    {value.length === 0 ? (
                      <span className="text-sm text-muted-foreground">No tags</span>
                    ) : (
                      value.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))
                    )}
                  </div>
                ) : (
                  <p className="text-sm">{value}</p>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              onClick={() => setEditingField(field)}
            >
              <InfoIcon className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Note Header - Same placement as task header */}
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

      {/* Tabs - Same styling as task tabs */}
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

      {/* Tab Content */}
      <div className="p-6 space-y-6">
        {activeTab === "details" && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Note Details</h4>

            <div className="rounded-lg border border-muted bg-muted/10 p-4">
              <div className="space-y-4">
                {renderEditableField(
                  "content",
                  fieldValues.content,
                  <FileTextIcon className="h-4 w-4 text-muted-foreground" />,
                  "Content",
                  false,
                  true,
                )}

                {renderEditableField(
                  "priority",
                  fieldValues.priority,
                  <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />,
                  "Priority",
                  true,
                )}

                {renderEditableField(
                  "author",
                  fieldValues.author,
                  <UserIcon className="h-4 w-4 text-muted-foreground" />,
                  "Author",
                )}

                {renderEditableField(
                  "createdAt",
                  fieldValues.createdAt,
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />,
                  "Created",
                )}

                {renderEditableField(
                  "updatedAt",
                  fieldValues.updatedAt,
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />,
                  "Updated",
                )}

                {renderEditableField(
                  "tags",
                  fieldValues.tags,
                  <TagIcon className="h-4 w-4 text-muted-foreground" />,
                  "Tags",
                )}

                <div className="flex items-center gap-2">
                  <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <Label className="text-xs text-muted-foreground">Related to</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{fieldValues.relatedTo?.type || "N/A"}</span>
                        <span className="text-sm font-medium">{fieldValues.relatedTo?.name || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
              Show all values
            </Button>

            {/* Activity Section */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-medium">Activity</h4>
                <Button variant="outline" size="sm">
                  <PlusIcon className="h-4 w-4" />
                  Add activity
                </Button>
              </div>
              <NoteActivityContent note={note} />
            </div>

            {/* Typable Area */}
            <TypableArea value={noteText} onChange={setNoteText} placeholder="Add notes..." showButtons={false} />
          </div>
        )}
      </div>
    </div>
  )
}

// Note Activity Component
function NoteActivityContent({ note }: { note: any }) {
  const [expandedActivity, setExpandedActivity] = React.useState<number | null>(null);

  const activities = [
    {
      id: 1,
      type: "create",
      actor: note.author || "John Doe",
      action: "created",
      target: "this note",
      timestamp: "3 days ago",
      date: "2023-01-15",
      details: {
        noteTitle: note.title || "Untitled",
        initialTags: note.tags || [],
        classification: "Meeting Notes",
        relatedItems: ["Deal #1234", "Contact: Jane Smith"],
      },
    },
    {
      id: 2,
      type: "edit",
      actor: "Maria Garcia",
      action: "edited",
      target: "content",
      timestamp: "2 days ago",
      date: "2023-01-16",
      details: {
        changedSections: ["Introduction", "Key Points"],
        addedContent: "Added next steps and action items",
        removedContent: "Removed outdated timeline information",
        length: "+232 chars",
      },
    },
    {
      id: 3,
      type: "tag",
      actor: "David Wilson",
      action: "added tags to",
      target: "this note",
      timestamp: "1 day ago",
      date: "2023-01-17",
      details: {
        previousTags: ["Meeting"],
        addedTags: ["Important", "Follow-up"],
        currentTags: ["Meeting", "Important", "Follow-up"],
      },
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "create":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case "edit":
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
      case "tag":
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>;
      case "share":
        return <div className="h-2 w-2 rounded-full bg-amber-500"></div>;
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>;
    }
  };

  const formatActivityText = (activity: any) => {
    return (
      <span>
        <span className="font-medium">{activity.actor}</span> {activity.action}{" "}
        <span className="font-medium">{activity.target}</span>
      </span>
    );
  };

  const renderExpandedDetails = (activity: any) => {
    switch (activity.type) {
      case "create":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Creation Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Title:</span>{" "}
                  <span>{activity.details.noteTitle}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Classification:</span>{" "}
                  <span>{activity.details.classification}</span>
                </div>
              </div>
            </div>
            {activity.details.initialTags.length > 0 && (
              <div>
                <h5 className="text-sm font-medium mb-1">Initial Tags</h5>
                <div className="flex flex-wrap gap-1">
                  {activity.details.initialTags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {activity.details.relatedItems.length > 0 && (
              <div>
                <h5 className="text-sm font-medium mb-1">Related Items</h5>
                <div className="space-y-1">
                  {activity.details.relatedItems.map((item: string, index: number) => (
                    <p key={index} className="text-sm text-blue-600">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case "edit":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Edit Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Changed Sections:</span>{" "}
                  <span>{activity.details.changedSections.join(", ")}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Length Change:</span>{" "}
                  <span>{activity.details.length}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Added Content</h5>
              <p className="text-sm text-muted-foreground">{activity.details.addedContent}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Removed Content</h5>
              <p className="text-sm text-muted-foreground">{activity.details.removedContent}</p>
            </div>
          </div>
        );
      case "tag":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Tag Changes</h5>
              <div>
                <h6 className="text-xs text-muted-foreground mb-1">Previous Tags</h6>
                <div className="flex flex-wrap gap-1 mb-3">
                  {activity.details.previousTags.length === 0 ? (
                    <span className="text-sm text-muted-foreground">No tags</span>
                  ) : (
                    activity.details.previousTags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))
                  )}
                </div>
                <h6 className="text-xs text-muted-foreground mb-1">Added Tags</h6>
                <div className="flex flex-wrap gap-1 mb-3">
                  {activity.details.addedTags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-green-100">
                      +{tag}
                    </Badge>
                  ))}
                </div>
                <h6 className="text-xs text-muted-foreground mb-1">Current Tags</h6>
                <div className="flex flex-wrap gap-1">
                  {activity.details.currentTags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id}>
          <button
            onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
            className="flex items-start gap-3 w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="mt-1">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm">{formatActivityText(activity)}</div>
              <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
            </div>
            <ChevronDownIcon
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                expandedActivity === activity.id ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedActivity === activity.id && (
            <div className="ml-6 pl-3 border-l-2 border-muted">{renderExpandedDetails(activity)}</div>
          )}
        </div>
      ))}
    </div>
  );
}
