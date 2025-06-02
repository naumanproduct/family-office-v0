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
}

export function NoteDetailsView({ note, onBack }: NoteDetailsViewProps) {
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

  const tabs = [{ id: "details", label: "Details", icon: InfoIcon }]

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
              <div
                className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded text-sm"
                onClick={() => setEditingField(field)}
              >
                {isBadge ? (
                  <Badge className={`text-xs ${getPriorityColor(value)}`}>{value}</Badge>
                ) : field === "tags" ? (
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(value) ? (
                      value.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {value}
                      </Badge>
                    )}
                  </div>
                ) : field === "createdAt" || field === "updatedAt" ? (
                  new Date(value).toLocaleDateString()
                ) : (
                  value
                )}
              </div>
            )}
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

            {/* Typable Area */}
            <TypableArea value={noteText} onChange={setNoteText} placeholder="Add notes..." showButtons={false} />
          </div>
        )}
      </div>
    </div>
  )
}
