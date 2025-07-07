"use client"

import * as React from "react"
import {
  Settings2Icon,
  GripVerticalIcon,
  PlusIcon,
  XIcon,
  EditIcon,
  CheckIcon,
  DollarSignIcon,
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LayoutIcon,
  ListIcon,
  BuildingIcon,
  Zap,
  CheckCircle2,
  FileUp,
  Mail,
  Clock,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  ChevronLeftIcon,
  FolderOpen,
  Cloud,
  Globe,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { UnifiedDetailsPanel } from "@/components/shared/unified-details-panel"
import { UnifiedActivitySection } from "@/components/shared/unified-activity-section"
import { generateWorkflowActivities } from "@/components/shared/activity-generators"

interface WorkflowAttribute {
  id: string
  name: string
  type: string
  isCustom?: boolean
}

interface WorkflowStage {
  id: string
  name: string
  color: string
}

interface WorkflowConfig {
  name: string
  description: string
  objectType: string
  attributes: WorkflowAttribute[]
  stages: WorkflowStage[]
}

interface WorkflowHeaderProps {
  workflowName: string
  workflowConfig: WorkflowConfig
  onSave: (config: WorkflowConfig) => void
}

// AutomationRule type (adapted from settings/automations-management)
type AutomationRule = {
  id: string
  name: string
  description: string
  status: "active" | "inactive" | "draft"
  triggerType: string
  triggerIcon: any
  conditions: string[]
  actions: string[]
  executionCount: number
  lastExecuted?: string
}

// Mock: 1 automation per workflow
const getWorkflowAutomation = (workflowName: string): AutomationRule[] => [
  {
    id: "1",
    name: `${workflowName} Automation`,
    description: `Automatically run actions for ${workflowName}`,
    status: "active",
    triggerType: "File Upload",
    triggerIcon: FileUp,
    conditions: [
      `File name contains '${workflowName}'`,
      "File is linked to this workflow"
    ],
    actions: [
      `Create a Task for ${workflowName}`,
      "Notify team"
    ],
    executionCount: 5,
    lastExecuted: "2024-06-30T12:00:00Z"
  }
]

// Sortable attribute item component for selected fields
function SelectedAttributeItem({
  attribute,
  onEdit,
  onDelete,
}: {
  attribute: WorkflowAttribute
  onEdit: (id: string, name: string, type: string) => void
  onDelete: (id: string) => void
}) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editName, setEditName] = React.useState(attribute.name)
  const [editType, setEditType] = React.useState(attribute.type)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: attribute.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleSaveEdit = () => {
    onEdit(attribute.id, editName, editType)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditName(attribute.name)
    setEditType(attribute.type)
    setIsEditing(false)
  }

  const Icon = getAttributeIcon(attribute.type)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center space-x-3 rounded-lg border border-border bg-card p-4 hover:shadow-sm transition-all duration-200"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
      >
        <GripVerticalIcon className="h-4 w-4" />
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />

        {isEditing ? (
          <div className="space-y-2 flex-1" onClick={(e) => e.stopPropagation()}>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-8 text-sm"
              placeholder="Field name"
            />
            <Select value={editType} onValueChange={setEditType}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="currency">Currency</SelectItem>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="relation">Relation</SelectItem>
                <SelectItem value="tags">Tags</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-card-foreground">{attribute.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{attribute.type}</div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {isEditing ? (
          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleSaveEdit}>
              <CheckIcon className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCancelEdit}>
              <XIcon className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {attribute.isCustom && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
              >
                <EditIcon className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(attribute.id)
              }}
            >
              <XIcon className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Sortable stage item component
function SortableStageItem({
  stage,
  onEdit,
  onDelete,
  canDelete,
}: {
  stage: WorkflowStage
  onEdit: (id: string, name: string, color: string) => void
  onDelete: (id: string) => void
  canDelete: boolean
}) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editName, setEditName] = React.useState(stage.name)
  const [editColor, setEditColor] = React.useState(stage.color)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stage.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleSaveEdit = () => {
    onEdit(stage.id, editName, editColor)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditName(stage.name)
    setEditColor(stage.color)
    setIsEditing(false)
  }

  const colorOptions = [
    { value: "bg-gray-100", label: "Gray", color: "bg-gray-100" },
    { value: "bg-blue-100", label: "Blue", color: "bg-blue-100" },
    { value: "bg-green-100", label: "Green", color: "bg-green-100" },
    { value: "bg-yellow-100", label: "Yellow", color: "bg-yellow-100" },
    { value: "bg-purple-100", label: "Purple", color: "bg-purple-100" },
    { value: "bg-red-100", label: "Red", color: "bg-red-100" },
    { value: "bg-orange-100", label: "Orange", color: "bg-orange-100" },
    { value: "bg-pink-100", label: "Pink", color: "bg-pink-100" },
  ]

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center space-x-3 rounded-lg border border-border bg-card p-4 hover:shadow-sm transition-all duration-200"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
      >
        <GripVerticalIcon className="h-4 w-4" />
      </div>

      <div className={`w-6 h-6 rounded-md ${stage.color} border border-border flex-shrink-0`} />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-8 text-sm"
              placeholder="Stage name"
            />
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((option) => (
                <div
                  key={option.value}
                  className={`h-8 rounded-md cursor-pointer ${option.color} border-2 transition-all ${
                    editColor === option.value
                      ? "border-primary scale-105"
                      : "border-border hover:border-muted-foreground"
                  }`}
                  onClick={() => setEditColor(option.value)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="font-medium text-sm text-card-foreground">{stage.name}</div>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {isEditing ? (
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleSaveEdit}>
              <CheckIcon className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCancelEdit}>
              <XIcon className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditing(true)}>
              <EditIcon className="h-3 w-3" />
            </Button>
            {canDelete && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(stage.id)}>
                <XIcon className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to get attributes based on object type
function getAttributesForObjectType(objectType: string): WorkflowAttribute[] {
  switch (objectType) {
    case "task":
      return [
        { id: "title", name: "Title", type: "text" },
        { id: "description", name: "Description", type: "text" },
        { id: "status", name: "Status", type: "select" },
        { id: "priority", name: "Priority", type: "select" },
        { id: "assignee", name: "Assignee", type: "user" },
        { id: "dueDate", name: "Due Date", type: "date" },
        { id: "createdAt", name: "Created At", type: "date" },
        { id: "updatedAt", name: "Updated At", type: "date" },
        { id: "tags", name: "Tags", type: "tags" },
      ]
    case "opportunity":
      return [
        { id: "name", name: "Name", type: "text" },
        { id: "company", name: "Company", type: "relation" },
        { id: "amount", name: "Amount", type: "currency" },
        { id: "stage", name: "Stage", type: "select" },
        { id: "owner", name: "Owner", type: "user" },
        { id: "probability", name: "Probability", type: "number" },
        { id: "expectedClose", name: "Expected Close", type: "date" },
        { id: "source", name: "Source", type: "select" },
        { id: "description", name: "Description", type: "text" },
        { id: "lastContact", name: "Last Contact", type: "date" },
        { id: "nextStep", name: "Next Step", type: "text" },
      ]
    case "capital-call":
      return [
        { id: "fundName", name: "Fund Name", type: "text" },
        { id: "callNumber", name: "Call Number", type: "text" },
        { id: "callAmount", name: "Call Amount", type: "currency" },
        { id: "commitmentAmount", name: "Commitment Amount", type: "currency" },
        { id: "dueDate", name: "Due Date", type: "date" },
        { id: "noticeDate", name: "Notice Date", type: "date" },
        { id: "investor", name: "Investor", type: "relation" },
        { id: "fundManager", name: "Fund Manager", type: "text" },
        { id: "purpose", name: "Purpose", type: "text" },
        { id: "remainingCommitment", name: "Remaining Commitment", type: "currency" },
      ]
    case "document":
      return [
        { id: "name", name: "Name", type: "text" },
        { id: "type", name: "Type", type: "select" },
        { id: "status", name: "Status", type: "select" },
        { id: "owner", name: "Owner", type: "user" },
        { id: "createdAt", name: "Created At", type: "date" },
        { id: "updatedAt", name: "Updated At", type: "date" },
        { id: "size", name: "Size", type: "number" },
        { id: "tags", name: "Tags", type: "tags" },
      ]
    default:
      return []
  }
}

const getAttributeIcon = (type: string) => {
  switch (type) {
    case "currency":
      return DollarSignIcon
    case "date":
      return CalendarIcon
    case "user":
    case "relation":
      return UserIcon
    case "text":
    default:
      return FileTextIcon
  }
}

export function WorkflowHeader({ workflowName, workflowConfig, onSave }: WorkflowHeaderProps) {
  const [config, setConfig] = React.useState<WorkflowConfig>(workflowConfig)
  const [activeTab, setActiveTab] = React.useState("details")
  const [showAddFields, setShowAddFields] = React.useState(false)
  const [showCustomField, setShowCustomField] = React.useState(false)
  const [customName, setCustomName] = React.useState("")
  const [customType, setCustomType] = React.useState("text")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedAutomation, setSelectedAutomation] = React.useState<AutomationRule | null>(null)
  const [isEditingAutomation, setIsEditingAutomation] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState<'when' | 'check-if' | 'do-this' | null>(null)
  const [droppedItems, setDroppedItems] = React.useState<{
    when: any[],
    checkIf: any[],
    doThis: any[]
  }>({
    when: [],
    checkIf: [],
    doThis: []
  })
  const [selectedBlock, setSelectedBlock] = React.useState<{
    section: 'when' | 'check-if' | 'do-this',
    index: number,
    item: any
  } | null>(null)
  const [isOpen, setIsOpen] = React.useState(false)
  
  // Initialize dropped items when selecting an automation
  React.useEffect(() => {
    if (selectedAutomation && isEditingAutomation) {
      // Initialize with existing data if needed
      setDroppedItems({
        when: selectedAutomation.triggerType ? [{
          type: 'trigger',
          label: selectedAutomation.triggerType,
          description: 'Existing trigger',
          iconName: 'Zap'
        }] : [],
        checkIf: [],
        doThis: []
      })
    }
  }, [selectedAutomation, isEditingAutomation])

  // Reset activeTab to "details" when sheet opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab("details")
      setSelectedAutomation(null)
      setIsEditingAutomation(false)
    }
  }, [isOpen])

  const automations = getWorkflowAutomation(workflowName)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleSave = () => {
    onSave(config)
    // Close the sheet
    setIsOpen(false)
  }

  const handleAttributeDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = config.attributes.findIndex((attr) => attr.id === active.id)
      const newIndex = config.attributes.findIndex((attr) => attr.id === over.id)

      setConfig({
        ...config,
        attributes: arrayMove(config.attributes, oldIndex, newIndex),
      })
    }
  }

  const handleStageDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = config.stages.findIndex((stage) => stage.id === active.id)
      const newIndex = config.stages.findIndex((stage) => stage.id === over.id)

      setConfig({
        ...config,
        stages: arrayMove(config.stages, oldIndex, newIndex),
      })
    }
  }

  const addField = (field: WorkflowAttribute) => {
    setConfig({
      ...config,
      attributes: [...config.attributes, { ...field }],
    })
  }

  const createCustomField = () => {
    if (customName.trim()) {
      const newAttribute: WorkflowAttribute = {
        id: `custom-${Date.now()}`,
        name: customName,
        type: customType,
        isCustom: true,
      }
      setConfig({
        ...config,
        attributes: [...config.attributes, newAttribute],
      })
      setCustomName("")
      setCustomType("text")
      setShowCustomField(false)
    }
  }

  const editAttribute = (id: string, name: string, type: string) => {
    setConfig({
      ...config,
      attributes: config.attributes.map((attr) => (attr.id === id ? { ...attr, name, type } : attr)),
    })
  }

  const deleteAttribute = (id: string) => {
    setConfig({
      ...config,
      attributes: config.attributes.filter((attr) => attr.id !== id),
    })
  }

  const editStage = (id: string, name: string, color: string) => {
    setConfig({
      ...config,
      stages: config.stages.map((stage) => (stage.id === id ? { ...stage, name, color } : stage)),
    })
  }

  const deleteStage = (id: string) => {
    setConfig({
      ...config,
      stages: config.stages.filter((stage) => stage.id !== id),
    })
  }

  const addStage = () => {
    const newStage: WorkflowStage = {
      id: `stage-${Date.now()}`,
      name: "New Stage",
      color: "bg-gray-100",
    }
    setConfig({
      ...config,
      stages: [...config.stages, newStage],
    })
  }

  const getAvailableFields = () => {
    const allFields = getAttributesForObjectType(config.objectType)
    return allFields.filter((field) => !config.attributes.some((selected) => selected.id === field.id))
  }

  const filteredAvailableFields = getAvailableFields().filter((field) =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const tabs = [
    { id: "details", label: "Details", icon: FileTextIcon },
    { id: "attributes", label: "Card Attributes", icon: LayoutIcon },
    { id: "stages", label: "Stages", icon: ListIcon },
    { id: "automations", label: "Automations", icon: Zap },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2" title="Configure Workflow">
          <Settings2Icon className="h-4 w-4" />
          <span>Configure</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className={`flex w-full flex-col p-0 [&>button]:hidden overflow-hidden ${selectedAutomation && isEditingAutomation ? '!max-w-[calc(100%-2rem)] sm:!max-w-[calc(100%-2rem)] lg:!max-w-[calc(100%-2rem)]' : 'max-w-[30vw] sm:max-w-[30vw]'}`}>
        {/* Conditional Header based on selectedAutomation */}
        {!selectedAutomation ? (
          <>
            {/* Default Header - matches master-drawer pattern */}
            <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-background">
                  Workflow Configuration
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {/* Save button moved to footer for consistency */}
              </div>
            </div>

            {/* Record Header - matches master-drawer pattern */}
            <div className="border-b bg-background px-6 py-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {workflowName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{workflowName}</h2>
                  <p className="text-sm text-muted-foreground">Configure workflow settings</p>
                </div>
              </div>
            </div>

            {/* Tabs - matches master-drawer pattern */}
            <div className="border-b bg-background px-6">
              <div className="flex gap-8 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative whitespace-nowrap py-3 text-sm font-medium flex items-center gap-2 ${
                        activeTab === tab.id
                          ? "border-b-2 border-primary text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {tab.label}
                      {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Automation Detail Header */}
            <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setSelectedAutomation(null)
                    setIsEditingAutomation(false)
                    setActiveTab("details")
                  }}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Badge variant="outline" className="bg-background">
                  Automation
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {!isEditingAutomation ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditingAutomation(true)}>
                    <EditIcon className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditingAutomation(false)}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            {/* Automation Record Header */}
            <div className="border-b bg-background px-6 py-2">
              <div className="flex items-center gap-3">
                {React.createElement(selectedAutomation.triggerIcon, { 
                  className: "h-8 w-8 p-1.5 rounded-full bg-primary/10 text-primary" 
                })}
                <div>
                  <h2 className="text-lg font-semibold">{selectedAutomation.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedAutomation.description}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab Content */}
        <div className={`flex-1 ${selectedAutomation && isEditingAutomation ? 'flex' : ''} overflow-hidden flex flex-col`}>
          {!selectedAutomation ? (
            <>
            <div className="flex-1 overflow-y-auto">
              {activeTab === "details" && (
                <UnifiedDetailsPanel 
                  sections={[
                    {
                      id: "workflow-stats",
                      title: "Workflow Statistics",
                      icon: <LayoutIcon className="h-4 w-4 text-muted-foreground" />,
                      fields: [
                        { label: "Object Type", value: <span className="text-sm capitalize">{config.objectType}</span>, isEditable: false },
                        { label: "Card Fields", value: `${config.attributes.length} fields configured`, isEditable: false },
                        { label: "Stages", value: `${config.stages.length} stages configured`, isEditable: false },
                        { label: "Created", value: "January 15, 2024", isEditable: false },
                        { label: "Last Modified", value: "Today", isEditable: false },
                      ],
                    },
                    {
                      id: "workflow-info",
                      title: "Workflow Information",
                      icon: <FileTextIcon className="h-4 w-4 text-muted-foreground" />,
                      fields: [
                        { 
                          label: "Workflow Name", 
                          value: (
                            <Input
                              value={config.name}
                              onChange={(e) => setConfig({ ...config, name: e.target.value })}
                              className="mt-1 w-full"
                            />
                          )
                        },
                        { 
                          label: "Description", 
                          value: (
                            <Textarea
                              value={config.description}
                              onChange={(e) => setConfig({ ...config, description: e.target.value })}
                              className="resize-none mt-1 w-full"
                              rows={3}
                            />
                          )
                        },
                      ],
                    },
                  ]}
                />
              )}

              {activeTab === "activity" && (
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold">Workflow Activity</h3>
                    <p className="text-sm text-muted-foreground mt-1">Recent activity and changes to this workflow</p>
                  </div>
                  <UnifiedActivitySection activities={generateWorkflowActivities()} />
                </div>
              )}

              {activeTab === "attributes" && (
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Card Fields</h3>
                      <Badge variant="secondary">
                        {config.attributes.length} field{config.attributes.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {config.attributes.length > 0
                        ? "Drag to reorder how they appear on cards"
                        : "Add fields to display on your cards"}
                    </p>
                  </div>

                  {/* Selected Fields List */}
                  <div>
                    {config.attributes.length > 0 ? (
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleAttributeDragEnd}>
                        <SortableContext
                          items={config.attributes.map((attr) => attr.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-2">
                            {config.attributes.map((attribute) => (
                              <SelectedAttributeItem
                                key={attribute.id}
                                attribute={attribute}
                                onEdit={editAttribute}
                                onDelete={deleteAttribute}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    ) : (
                      <div className="text-center py-12 border border-dashed border-border rounded-lg bg-muted/50">
                        <div className="max-w-sm mx-auto">
                          <div className="text-muted-foreground mb-3">
                            <FileTextIcon className="h-8 w-8 mx-auto" />
                          </div>
                          <h4 className="text-sm font-medium mb-1">No fields selected</h4>
                          <p className="text-xs text-muted-foreground mb-4">
                            Choose which fields to display on your kanban cards
                          </p>
                          <Button size="sm" onClick={() => setShowAddFields(true)}>
                            <PlusIcon className="h-3 w-3 mr-1" />
                            Add Your First Field
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add Field Section - matches drawer pattern */}
                  <div className="mt-6">
                    <div
                      className={`p-3 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors ${
                        showAddFields ? "bg-muted/50" : ""
                      }`}
                      onClick={() => setShowAddFields(!showAddFields)}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <PlusIcon className="h-4 w-4" />
                        Add Field
                      </div>
                      <div>
                        {showAddFields ? (
                          <ChevronUpIcon className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {showAddFields && (
                      <div className="p-4 border-t bg-muted/50">
                        {/* Search and Custom Field Toggle */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative flex-1">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search fields..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-9 h-8 text-sm"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCustomField(!showCustomField)}
                            className="whitespace-nowrap h-8 text-xs"
                          >
                            {showCustomField ? "Cancel" : "Create Custom"}
                          </Button>
                        </div>

                        {/* Custom Field Creator */}
                        {showCustomField && (
                          <div className="mb-4 p-3 bg-background rounded-lg border shadow-sm">
                            <div className="space-y-3">
                              <div>
                                <Label htmlFor="customName" className="text-xs font-medium">
                                  Field Name
                                </Label>
                                <Input
                                  id="customName"
                                  placeholder="Enter field name"
                                  value={customName}
                                  onChange={(e) => setCustomName(e.target.value)}
                                  className="h-8 text-sm mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor="customType" className="text-xs font-medium">
                                  Field Type
                                </Label>
                                <Select value={customType} onValueChange={setCustomType}>
                                  <SelectTrigger id="customType" className="h-8 text-sm mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="number">Number</SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="currency">Currency</SelectItem>
                                    <SelectItem value="select">Select</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="relation">Relation</SelectItem>
                                    <SelectItem value="tags">Tags</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="pt-1">
                                <Button
                                  size="sm"
                                  onClick={createCustomField}
                                  disabled={!customName.trim()}
                                  className="w-full"
                                >
                                  Create Field
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Available Fields List */}
                        <div className="max-h-48 overflow-y-auto rounded-lg border bg-background">
                          {filteredAvailableFields.length > 0 ? (
                            <div className="divide-y divide-border">
                              {filteredAvailableFields.map((field) => {
                                const Icon = getAttributeIcon(field.type)
                                return (
                                  <div
                                    key={field.id}
                                    className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                                    onClick={() => addField(field)}
                                  >
                                    <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium">{field.name}</div>
                                      <div className="text-xs text-muted-foreground capitalize">{field.type}</div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full">
                                      <PlusIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-sm text-muted-foreground">
                              {searchQuery ? "No fields match your search" : "All available fields have been added"}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "stages" && (
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Workflow Stages</h3>
                        <p className="text-sm text-muted-foreground mt-1">Drag to reorder columns on your kanban board</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{config.stages.length} stages</Badge>
                        <Button variant="outline" size="sm" onClick={addStage}>
                          <PlusIcon className="h-3 w-3 mr-1" />
                          Add Stage
                        </Button>
                      </div>
                    </div>
                  </div>

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleStageDragEnd}>
                    <SortableContext
                      items={config.stages.map((stage) => stage.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {config.stages.map((stage) => (
                          <SortableStageItem
                            key={stage.id}
                            stage={stage}
                            onEdit={editStage}
                            onDelete={deleteStage}
                            canDelete={config.stages.length > 1}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              {activeTab === "automations" && (
                <div className="p-6">
                  <div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold">Automations</h3>
                      <p className="text-sm text-muted-foreground mt-1">Configure automated actions for this workflow</p>
                    </div>
                    <div className="space-y-2">
                      {automations.map((automation) => (
                        <div
                          key={automation.id}
                          className="group flex items-center space-x-3 rounded-lg border border-border bg-card p-4 hover:shadow-sm transition-all duration-200 cursor-pointer"
                          onClick={() => setSelectedAutomation(automation)}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {React.createElement(automation.triggerIcon, { className: "h-4 w-4 text-muted-foreground flex-shrink-0" })}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-card-foreground">{automation.name}</div>
                              <div className="text-xs text-muted-foreground">{automation.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs text-muted-foreground mr-2">{automation.executionCount} runs</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" title="View">
                              <Zap className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer with Save/Cancel buttons */}
            <div className="border-t bg-background p-4">
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Reset config to original
                    setConfig(workflowConfig)
                    // Close sheet
                    setIsOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
            </>
          ) : (
            <div className="flex flex-1 overflow-hidden">
              {/* Automation Detail/Edit View */}
              <div className={`flex-1 overflow-y-auto ${isEditingAutomation ? '' : ''}`}>
                <div className="py-6">
                  {/* Visual Rule Builder */}
                  <div className="max-w-3xl mx-auto px-6 space-y-6">
                    {/* When Section */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground">When</h3>
                      <div 
                        className={`border-2 rounded-lg p-4 min-h-[100px] transition-all cursor-pointer ${
                          isEditingAutomation 
                            ? activeSection === 'when' 
                              ? 'border-dashed border-blue-500 shadow-sm' 
                              : 'border-dashed border-muted-foreground/30 hover:border-muted-foreground/50'
                            : 'border-border'
                        } bg-background`}
                        onClick={() => isEditingAutomation && setActiveSection('when')}
                        onDragOver={(e) => {
                          if (isEditingAutomation && activeSection === 'when') {
                            e.preventDefault()
                            e.currentTarget.classList.add('bg-muted/50')
                          }
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.classList.remove('bg-muted/50')
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.currentTarget.classList.remove('ring-2', 'ring-primary')
                          
                          if (isEditingAutomation) {
                            try {
                              const data = JSON.parse(e.dataTransfer.getData('text/plain'))
                              if (data.type === 'trigger') {
                                const newItems = [...droppedItems.when, data]
                                setDroppedItems(prev => ({
                                  ...prev,
                                  when: newItems
                                }))
                                // Automatically select the newly dropped block
                                setSelectedBlock({
                                  section: 'when',
                                  index: newItems.length - 1,
                                  item: data
                                })
                              }
                            } catch (error) {
                              console.error('Failed to parse drag data:', error)
                            }
                          }
                        }}
                      >
                        {(isEditingAutomation && droppedItems.when.length > 0) || (!isEditingAutomation && selectedAutomation.triggerType) ? (
                          <div className="space-y-2">
                            {!isEditingAutomation && selectedAutomation.triggerType && (
                              <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                                <Zap className="h-4 w-4 text-foreground flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">{selectedAutomation.triggerType}</div>
                                  <div className="text-xs text-muted-foreground">Triggers when this event occurs</div>
                                </div>
                              </div>
                            )}
                            {(isEditingAutomation ? droppedItems.when : droppedItems.when.length > 0 ? droppedItems.when : []).map((item, index) => {
                              // Map icon names back to components
                              const iconMap: { [key: string]: any } = {
                                'FileUp': FileUp,
                                'Mail': Mail,
                                'Clock': Clock,
                                'AlertCircle': AlertCircle,
                                'Zap': Zap
                              }
                              const IconComponent = iconMap[item.iconName] || Zap
                              
                              return (
                                <div 
                                  key={index} 
                                  className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all ${
                                    selectedBlock?.section === 'when' && selectedBlock?.index === index
                                      ? 'ring-2 ring-blue-500/50'
                                      : 'bg-muted/50 hover:bg-muted/70'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (isEditingAutomation) {
                                      setSelectedBlock({
                                        section: 'when',
                                        index,
                                        item
                                      })
                                    }
                                  }}
                                >
                                  <IconComponent className="h-4 w-4 text-foreground flex-shrink-0" />
                                  <div className="flex-1">
                                    <div className="text-sm font-medium">{item.label}</div>
                                    {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                                  </div>
                                  {isEditingAutomation && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setDroppedItems(prev => ({
                                          ...prev,
                                          when: prev.when.filter((_, i) => i !== index)
                                        }))
                                        if (selectedBlock?.section === 'when' && selectedBlock?.index === index) {
                                          setSelectedBlock(null)
                                        }
                                      }}
                                    >
                                      <XIcon className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <Zap className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Click to select, then drag triggers here
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Check if Section */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground">Check if</h3>
                      <div 
                        className={`border-2 rounded-lg p-4 min-h-[120px] transition-all cursor-pointer ${
                          isEditingAutomation 
                            ? activeSection === 'check-if' 
                              ? 'border-dashed border-blue-500 shadow-sm' 
                              : 'border-dashed border-muted-foreground/30 hover:border-muted-foreground/50'
                            : 'border-border'
                        } bg-background`}
                        onClick={() => isEditingAutomation && setActiveSection('check-if')}
                        onDragOver={(e) => {
                          if (isEditingAutomation && activeSection === 'check-if') {
                            e.preventDefault()
                            e.currentTarget.classList.add('bg-muted/50')
                          }
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.classList.remove('bg-muted/50')
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.currentTarget.classList.remove('bg-muted/50')
                          
                          if (isEditingAutomation && activeSection === 'check-if') {
                            try {
                              const data = JSON.parse(e.dataTransfer.getData('text/plain'))
                              if (data.type === 'condition') {
                                const newItems = [...droppedItems.checkIf, data]
                                setDroppedItems(prev => ({
                                  ...prev,
                                  checkIf: newItems
                                }))
                                // Automatically select the newly dropped block
                                setSelectedBlock({
                                  section: 'check-if',
                                  index: newItems.length - 1,
                                  item: data
                                })
                              }
                            } catch (error) {
                              console.error('Failed to parse drag data:', error)
                            }
                          }
                        }}
                      >
                        {(droppedItems.checkIf.length > 0 || (!isEditingAutomation && selectedAutomation.conditions.length > 0)) ? (
                          <div className="space-y-2">
                            {!isEditingAutomation && selectedAutomation.conditions.map((condition, index) => (
                              <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                                <CheckCircle2 className="h-4 w-4 text-foreground flex-shrink-0" />
                                <span className="text-sm">{condition}</span>
                              </div>
                            ))}
                            {droppedItems.checkIf.map((item, index) => (
                              <div 
                                key={index} 
                                className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all ${
                                  selectedBlock?.section === 'check-if' && selectedBlock?.index === index
                                    ? 'ring-2 ring-blue-500/50'
                                    : 'bg-muted/50 hover:bg-muted/70'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (isEditingAutomation) {
                                    setSelectedBlock({
                                      section: 'check-if',
                                      index,
                                      item
                                    })
                                  }
                                }}
                              >
                                <CheckCircle2 className="h-4 w-4 text-foreground flex-shrink-0" />
                                <span className="text-sm flex-1">{item.label || item}</span>
                                {isEditingAutomation && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setDroppedItems(prev => ({
                                        ...prev,
                                        checkIf: prev.checkIf.filter((_, i) => i !== index)
                                      }))
                                      if (selectedBlock?.section === 'check-if' && selectedBlock?.index === index) {
                                        setSelectedBlock(null)
                                      }
                                    }}
                                  >
                                    <XIcon className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <CheckCircle2 className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              {isEditingAutomation ? "Click to select, then drag conditions here" : "No conditions defined"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Do this Section */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground">Do this</h3>
                      <div 
                        className={`border-2 rounded-lg p-4 min-h-[120px] transition-all cursor-pointer ${
                          isEditingAutomation 
                            ? activeSection === 'do-this' 
                              ? 'border-dashed border-blue-500 shadow-sm' 
                              : 'border-dashed border-muted-foreground/30 hover:border-muted-foreground/50'
                            : 'border-border'
                        } bg-background`}
                        onClick={() => isEditingAutomation && setActiveSection('do-this')}
                        onDragOver={(e) => {
                          if (isEditingAutomation && activeSection === 'do-this') {
                            e.preventDefault()
                            e.currentTarget.classList.add('bg-muted/50')
                          }
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.classList.remove('bg-muted/50')
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.currentTarget.classList.remove('bg-muted/50')
                          
                          if (isEditingAutomation && activeSection === 'do-this') {
                            try {
                              const data = JSON.parse(e.dataTransfer.getData('text/plain'))
                              if (data.type === 'action') {
                                const newItems = [...droppedItems.doThis, data]
                                setDroppedItems(prev => ({
                                  ...prev,
                                  doThis: newItems
                                }))
                                // Automatically select the newly dropped block
                                setSelectedBlock({
                                  section: 'do-this',
                                  index: newItems.length - 1,
                                  item: data
                                })
                              }
                            } catch (error) {
                              console.error('Failed to parse drag data:', error)
                            }
                          }
                        }}
                      >
                        {(droppedItems.doThis.length > 0 || (!isEditingAutomation && selectedAutomation.actions.length > 0)) ? (
                          <div className="space-y-2">
                            {!isEditingAutomation && selectedAutomation.actions.map((action, index) => (
                              <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                                <PlayCircle className="h-4 w-4 text-foreground flex-shrink-0" />
                                <span className="text-sm">{action}</span>
                              </div>
                            ))}
                            {droppedItems.doThis.map((item, index) => (
                              <div 
                                key={index} 
                                className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all ${
                                  selectedBlock?.section === 'do-this' && selectedBlock?.index === index
                                    ? 'ring-2 ring-blue-500/50'
                                    : 'bg-muted/50 hover:bg-muted/70'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (isEditingAutomation) {
                                    setSelectedBlock({
                                      section: 'do-this',
                                      index,
                                      item
                                    })
                                  }
                                }}
                              >
                                <PlayCircle className="h-4 w-4 text-foreground flex-shrink-0" />
                                <span className="text-sm flex-1">{item.label || item}</span>
                                {isEditingAutomation && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setDroppedItems(prev => ({
                                        ...prev,
                                        doThis: prev.doThis.filter((_, i) => i !== index)
                                      }))
                                      if (selectedBlock?.section === 'do-this' && selectedBlock?.index === index) {
                                        setSelectedBlock(null)
                                      }
                                    }}
                                  >
                                    <XIcon className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <PlayCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              {isEditingAutomation ? "Click to select, then drag actions here" : "No actions defined"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Execution Stats */}
                  <div className="max-w-3xl mx-auto px-6 mt-8">
                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last run: {selectedAutomation.lastExecuted ? new Date(selectedAutomation.lastExecuted).toLocaleString() : "Never"}
                    </div>
                    <div className="flex items-center gap-1">
                      <PlayCircle className="h-3 w-3" />
                      Total runs: {selectedAutomation.executionCount}
                    </div>
                    <Badge variant={selectedAutomation.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                      {selectedAutomation.status}
                    </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Mode Right Sidebar */}
              {isEditingAutomation && (
                <div className="w-96 border-l bg-muted/30 flex flex-col h-full">
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="mb-6">
                      <h3 className="font-semibold text-lg mb-2">Automation Builder</h3>
                    
                    {/* Instructions */}
                    <div className="p-4 bg-muted rounded-lg border border-border">
                      <p className="text-sm font-medium text-foreground mb-1">
                        {selectedBlock ? (
                          <>Configure: {selectedBlock.item.label}</>
                        ) : activeSection ? (
                          <>Building: {activeSection === 'when' ? 'Triggers' : activeSection === 'check-if' ? 'Conditions' : 'Actions'}</>
                        ) : (
                          <>Get Started</>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedBlock ? (
                          <>Set up the details for this {selectedBlock.section === 'when' ? 'trigger' : selectedBlock.section === 'check-if' ? 'condition' : 'action'}</>
                        ) : activeSection ? (
                          <>Drag and drop blocks below into the "{activeSection === 'when' ? 'When' : activeSection === 'check-if' ? 'Check if' : 'Do this'}" section</>
                        ) : (
                          <>Click on a section in the workflow to see available blocks</>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {/* Show configuration when block is selected */}
                  {selectedBlock ? (
                    <>
                      <div className="space-y-6">
                      {/* Configuration based on block type */}
                      {selectedBlock.item.label === "File type is..." && (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium mb-2">File Type</Label>
                            <Select defaultValue="pdf">
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
                                <SelectItem value="docx">Word Document (.docx, .doc)</SelectItem>
                                <SelectItem value="xlsx">Excel Spreadsheet (.xlsx, .xls)</SelectItem>
                                <SelectItem value="pptx">PowerPoint (.pptx, .ppt)</SelectItem>
                                <SelectItem value="image">Image (JPG, PNG, GIF)</SelectItem>
                                <SelectItem value="video">Video (MP4, MOV, AVI)</SelectItem>
                                <SelectItem value="text">Text File (.txt, .csv)</SelectItem>
                                <SelectItem value="zip">Archive (.zip, .rar)</SelectItem>
                                <SelectItem value="any">Any File Type</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Condition</Label>
                            <Select defaultValue="is">
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="is">Is</SelectItem>
                                <SelectItem value="is-not">Is not</SelectItem>
                                <SelectItem value="contains">Contains</SelectItem>
                                <SelectItem value="starts-with">Starts with</SelectItem>
                                <SelectItem value="ends-with">Ends with</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Additional Filters</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="size-limit" />
                                <label htmlFor="size-limit" className="text-sm">File size limit</label>
                              </div>
                              {/* Show size input when checked */}
                              <div className="ml-6">
                                <div className="flex items-center gap-2">
                                  <Input type="number" placeholder="10" className="h-8 w-20" />
                                  <Select defaultValue="mb">
                                    <SelectTrigger className="h-8 w-20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="kb">KB</SelectItem>
                                      <SelectItem value="mb">MB</SelectItem>
                                      <SelectItem value="gb">GB</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedBlock.item.label === "File name contains..." && (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium mb-2">Search Text</Label>
                            <Input 
                              placeholder="e.g., invoice, report, contract"
                              className="h-9"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Search In</Label>
                            <Select defaultValue="filename">
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="filename">File name only</SelectItem>
                                <SelectItem value="filepath">Full file path</SelectItem>
                                <SelectItem value="content">File content</SelectItem>
                                <SelectItem value="both">Name and content</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Match Options</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="case-sensitive" defaultChecked={false} />
                                <label htmlFor="case-sensitive" className="text-sm">Case sensitive</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="whole-word" defaultChecked={false} />
                                <label htmlFor="whole-word" className="text-sm">Match whole words only</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="regex" defaultChecked={false} />
                                <label htmlFor="regex" className="text-sm">Use regular expression</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedBlock.item.label === "Create task" && (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium mb-2">Task Template</Label>
                            <Select defaultValue="custom">
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="custom">Custom task</SelectItem>
                                <SelectItem value="review">Document review</SelectItem>
                                <SelectItem value="approve">Approval required</SelectItem>
                                <SelectItem value="followup">Follow-up action</SelectItem>
                                <SelectItem value="process">Process document</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Task Title</Label>
                            <Input 
                              placeholder="Use {filename} to include file name"
                              className="h-9"
                              defaultValue="Review {filename}"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Description</Label>
                            <Textarea 
                              placeholder="Task description (optional)"
                              className="resize-none"
                              rows={3}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-sm font-medium mb-2">Assign To</Label>
                              <Select defaultValue="uploader">
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="uploader">File uploader</SelectItem>
                                  <SelectItem value="owner">Record owner</SelectItem>
                                  <SelectItem value="specific">Specific person</SelectItem>
                                  <SelectItem value="role">By role</SelectItem>
                                  <SelectItem value="team">Team</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium mb-2">Due Date</Label>
                              <Select defaultValue="3-days">
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="same-day">Same day</SelectItem>
                                  <SelectItem value="1-day">Next business day</SelectItem>
                                  <SelectItem value="3-days">3 business days</SelectItem>
                                  <SelectItem value="1-week">1 week</SelectItem>
                                  <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Priority</Label>
                            <Select defaultValue="normal">
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="urgent">Urgent</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      
                      {selectedBlock.item.label === "Send notification" && (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium mb-2">Notification Channel</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="email" defaultChecked />
                                <label htmlFor="email" className="text-sm">Email</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="in-app" defaultChecked />
                                <label htmlFor="in-app" className="text-sm">In-app notification</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="slack" />
                                <label htmlFor="slack" className="text-sm">Slack</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="sms" />
                                <label htmlFor="sms" className="text-sm">SMS</label>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Recipients</Label>
                            <Select defaultValue="relevant">
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="relevant">Relevant stakeholders</SelectItem>
                                <SelectItem value="uploader">File uploader</SelectItem>
                                <SelectItem value="owner">Record owner</SelectItem>
                                <SelectItem value="watchers">All watchers</SelectItem>
                                <SelectItem value="specific">Specific people</SelectItem>
                                <SelectItem value="distribution">Distribution list</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Notification Template</Label>
                            <Select defaultValue="file-uploaded">
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="file-uploaded">New file uploaded</SelectItem>
                                <SelectItem value="action-required">Action required</SelectItem>
                                <SelectItem value="review-needed">Review needed</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="custom">Custom message</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Message Preview</Label>
                            <div className="p-3 bg-muted rounded-md text-sm">
                              <p className="font-medium">New file uploaded: {"{filename}"}</p>
                              <p className="text-muted-foreground mt-1">A new file has been uploaded to {"{record_name}"} by {"{uploader_name}"}.</p>
                              <p className="text-muted-foreground mt-2">Click here to view the file.</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedBlock.item.label === "Move to folder" && (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium mb-2">Destination Folder</Label>
                            <Select defaultValue="by-type">
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="by-type">Organize by file type</SelectItem>
                                <SelectItem value="by-date">Organize by date</SelectItem>
                                <SelectItem value="by-entity">Organize by entity</SelectItem>
                                <SelectItem value="processed">Processed files</SelectItem>
                                <SelectItem value="archive">Archive</SelectItem>
                                <SelectItem value="custom">Custom folder</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Folder Structure</Label>
                            <Input 
                              placeholder="e.g., /Documents/{year}/{month}/{file_type}/"
                              className="h-9"
                              defaultValue="/Documents/{file_type}/{year}-{month}/"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">If Folder Doesn't Exist</Label>
                            <Select defaultValue="create">
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="create">Create folder</SelectItem>
                                <SelectItem value="skip">Skip file</SelectItem>
                                <SelectItem value="error">Show error</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">After Moving</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="keep-original" />
                                <label htmlFor="keep-original" className="text-sm">Keep copy in original location</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="update-references" defaultChecked />
                                <label htmlFor="update-references" className="text-sm">Update all references</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Email Attachment trigger configuration */}
                      {selectedBlock.item.label === "Email Attachment" && (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium mb-2">Email Address</Label>
                            <Input 
                              placeholder="inbox@company.com"
                              className="h-9"
                              type="email"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Monitor this email for attachments</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Sender Filter</Label>
                            <Select defaultValue="any">
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="any">Any sender</SelectItem>
                                <SelectItem value="whitelist">Specific senders</SelectItem>
                                <SelectItem value="domain">From domain</SelectItem>
                                <SelectItem value="contacts">Known contacts only</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Subject Contains</Label>
                            <Input 
                              placeholder="e.g., Invoice, Statement, Report"
                              className="h-9"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Attachment Handling</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="extract-zip" defaultChecked />
                                <label htmlFor="extract-zip" className="text-sm">Extract ZIP files automatically</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="ocr-scan" defaultChecked />
                                <label htmlFor="ocr-scan" className="text-sm">OCR scan documents</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="virus-scan" defaultChecked />
                                <label htmlFor="virus-scan" className="text-sm">Virus scan before processing</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Manual Upload trigger configuration */}
                      {selectedBlock.item.label === "Manual Upload" && (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium mb-2">Upload Location</Label>
                            <Select defaultValue="drawer">
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="drawer">Any record drawer</SelectItem>
                                <SelectItem value="specific-type">Specific record type</SelectItem>
                                <SelectItem value="documents">Documents page</SelectItem>
                                <SelectItem value="bulk">Bulk upload area</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">File Requirements</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="require-metadata" />
                                <label htmlFor="require-metadata" className="text-sm">Require metadata on upload</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="auto-categorize" defaultChecked />
                                <label htmlFor="auto-categorize" className="text-sm">Auto-categorize by file type</label>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Upload Permissions</Label>
                            <Select defaultValue="all-users">
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all-users">All users</SelectItem>
                                <SelectItem value="specific-roles">Specific roles</SelectItem>
                                <SelectItem value="admins">Admins only</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      
                      {/* Folder Sync trigger configuration */}
                      {selectedBlock.item.label === "Folder Sync" && (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium mb-2">Watch Folder</Label>
                            <Input 
                              placeholder="/Dropbox/Family Office/Incoming"
                              className="h-9"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Sync Frequency</Label>
                            <Select defaultValue="realtime">
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="realtime">Real-time</SelectItem>
                                <SelectItem value="5min">Every 5 minutes</SelectItem>
                                <SelectItem value="15min">Every 15 minutes</SelectItem>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">File Handling</Label>
                            <Select defaultValue="move">
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="move">Move files after processing</SelectItem>
                                <SelectItem value="copy">Copy files (keep original)</SelectItem>
                                <SelectItem value="sync">Two-way sync</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Include Subfolders</Label>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="include-subfolders" defaultChecked />
                              <label htmlFor="include-subfolders" className="text-sm">Monitor all subfolders</label>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Cloud Storage trigger configuration */}
                      {selectedBlock.item.label === "Cloud Storage" && (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium mb-2">Cloud Provider</Label>
                            <Select defaultValue="dropbox">
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="dropbox">Dropbox</SelectItem>
                                <SelectItem value="google-drive">Google Drive</SelectItem>
                                <SelectItem value="onedrive">OneDrive</SelectItem>
                                <SelectItem value="box">Box</SelectItem>
                                <SelectItem value="sharepoint">SharePoint</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Connected Account</Label>
                            <Select defaultValue="connect">
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="connect">Connect new account</SelectItem>
                                <SelectItem value="existing">john@company.com</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Folder Path</Label>
                            <Input 
                              placeholder="/Family Office/Documents"
                              className="h-9"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2">Sync Options</Label>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="auto-sync" defaultChecked />
                                <label htmlFor="auto-sync" className="text-sm">Auto-sync new files</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="sync-updates" defaultChecked />
                                <label htmlFor="sync-updates" className="text-sm">Sync file updates</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="sync-deletes" />
                                <label htmlFor="sync-deletes" className="text-sm">Sync deletions</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Default configuration for other blocks */}
                      {!["File type is...", "File name contains...", "Create task", "Send notification", "Move to folder", 
                        "Email Attachment", "Manual Upload", "Folder Sync", "Cloud Storage"].includes(selectedBlock.item.label) && (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                          Configuration options for "{selectedBlock.item.label}" coming soon
                        </div>
                      )}
                    </div>
                    </>
                  ) : (
                    <>
                      {/* Show blocks only for active section */}
                      {!activeSection ? (
                        <div className="text-center py-12">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                            <Zap className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Select a workflow section to view available blocks
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Triggers - Only show when 'when' is active */}
                          {activeSection === 'when' && (
                            <div>
                              <h4 className="text-sm font-medium mb-3 text-foreground">
                                Ingestion Triggers
                              </h4>
                              <div className="space-y-2">
                                {[
                                  { icon: Mail, iconName: 'Mail', label: "Email Attachment", description: "When email with attachments arrives" },
                                  { icon: FileUp, iconName: 'FileUp', label: "Manual Upload", description: "When files are uploaded manually" },
                                  { icon: FolderOpen, iconName: 'FolderOpen', label: "Folder Sync", description: "When files appear in watched folder" },
                                  { icon: Cloud, iconName: 'Cloud', label: "Cloud Storage", description: "From Dropbox, Google Drive, etc." },
                                  { icon: Globe, iconName: 'Globe', label: "API Integration", description: "Via API or webhook" },
                                  { icon: Calendar, iconName: 'Calendar', label: "Scheduled Import", description: "At scheduled intervals" },
                                ].map((trigger) => (
                                  <div
                                    key={trigger.label}
                                    className="p-3 border rounded-lg bg-background cursor-move transition-all hover:shadow-sm hover:border-foreground/20 hover:scale-[1.01] border-border"
                                    draggable
                                    onDragStart={(e) => {
                                      // Store only serializable data
                                      const dragData = {
                                        type: 'trigger',
                                        label: trigger.label,
                                        description: trigger.description,
                                        iconName: trigger.iconName
                                      }
                                      e.dataTransfer.setData('text/plain', JSON.stringify(dragData))
                                      e.currentTarget.classList.add('opacity-50')
                                    }}
                                    onDragEnd={(e) => {
                                      e.currentTarget.classList.remove('opacity-50')
                                    }}
                                  >
                                    <div className="flex items-center gap-3">
                                      {React.createElement(trigger.icon, { className: "h-4 w-4 text-foreground" })}
                                      <div>
                                        <div className="text-sm font-medium">{trigger.label}</div>
                                        <div className="text-xs text-muted-foreground">{trigger.description}</div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Conditions - Only show when 'check-if' is active */}
                          {activeSection === 'check-if' && (
                            <div>
                              <h4 className="text-sm font-medium mb-3 text-foreground">
                                Available Conditions
                              </h4>
                              <div className="space-y-2">
                                {[
                                  "File name contains...",
                                  "File type is...",
                                  "Entity matches...",
                                  "Date is before/after...",
                                  "Amount is greater than...",
                                ].map((condition) => (
                                  <div
                                    key={condition}
                                    className="p-3 border rounded-lg bg-background cursor-move transition-all hover:shadow-sm hover:border-foreground/20 hover:scale-[1.01] border-border"
                                    draggable
                                    onDragStart={(e) => {
                                      const dragData = {
                                        type: 'condition',
                                        label: condition
                                      }
                                      e.dataTransfer.setData('text/plain', JSON.stringify(dragData))
                                      e.currentTarget.classList.add('opacity-50')
                                    }}
                                    onDragEnd={(e) => {
                                      e.currentTarget.classList.remove('opacity-50')
                                    }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <CheckCircle2 className="h-4 w-4 text-foreground" />
                                      <span className="text-sm">{condition}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Actions - Only show when 'do-this' is active */}
                          {activeSection === 'do-this' && (
                            <div>
                              <h4 className="text-sm font-medium mb-3 text-foreground">
                                Available Actions
                              </h4>
                              <div className="space-y-2">
                                {[
                                  "Create task",
                                  "Send notification",
                                  "Move to stage",
                                  "Update field",
                                  "Add comment",
                                  "Assign to user",
                                ].map((action) => (
                                  <div
                                    key={action}
                                    className="p-3 border rounded-lg bg-background cursor-move transition-all hover:shadow-sm hover:border-foreground/20 hover:scale-[1.01] border-border"
                                    draggable
                                    onDragStart={(e) => {
                                      const dragData = {
                                        type: 'action',
                                        label: action
                                      }
                                      e.dataTransfer.setData('text/plain', JSON.stringify(dragData))
                                      e.currentTarget.classList.add('opacity-50')
                                    }}
                                    onDragEnd={(e) => {
                                      e.currentTarget.classList.remove('opacity-50')
                                    }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <PlayCircle className="h-4 w-4 text-foreground" />
                                      <span className="text-sm">{action}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                  </div>
                  
                  {/* Footer with Cancel and Save buttons */}
                  <div className="border-t bg-background p-4">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (selectedBlock) {
                            // Cancel block configuration
                            setSelectedBlock(null)
                          } else {
                            // Cancel entire automation editing
                            setIsEditingAutomation(false)
                            setActiveSection(null)
                            setSelectedBlock(null)
                            setDroppedItems({ when: [], checkIf: [], doThis: [] })
                          }
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          if (selectedBlock) {
                            // Save block configuration
                            console.log('Block configuration saved:', selectedBlock)
                            setSelectedBlock(null)
                          } else {
                            // Save entire automation
                            console.log('Saving automation:', {
                              when: droppedItems.when,
                              checkIf: droppedItems.checkIf,
                              doThis: droppedItems.doThis
                            })
                            setIsEditingAutomation(false)
                            setActiveSection(null)
                            setSelectedBlock(null)
                            // Note: In a real implementation, you would save the automation here
                            // For now, close the sheet and reset to details tab
                            setIsOpen(false)
                            setActiveTab("details")
                          }
                        }}
                      >
                        {selectedBlock ? 'Save' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
