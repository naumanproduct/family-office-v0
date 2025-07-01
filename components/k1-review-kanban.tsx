"use client"

import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  MoreVerticalIcon,
  PlusIcon,
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  FileIcon,
  UsersIcon,
  CheckCircleIcon,
  MailIcon,
  BuildingIcon,
  ClipboardIcon,
  AlertCircleIcon,
  ReceiptIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MasterDrawer } from "./master-drawer"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { UnifiedDetailsPanel } from "@/components/shared/unified-details-panel"
import { buildStandardDetailSections } from "@/components/shared/detail-section-builder"
import { UnifiedActivitySection } from "@/components/shared/unified-activity-section"
import { generateWorkflowActivities } from "@/components/shared/activity-generators"

interface TaxDocument {
  id: string
  documentName: string
  entityName: string
  taxYear: string
  documentType: string
  receivedDate: string
  reviewer: string
  dueDate: string
  stage: string
  // Additional fields for detailed view
  description?: string
  source?: string
  fiscalYear?: string
  amount?: string
  status?: string
  notes?: string
  uploadedBy?: string
  fileSize?: string
}

const initialDocuments: TaxDocument[] = [
  {
    id: "1",
    documentName: "K-1 - Blackstone REIT IX",
    entityName: "Family Office Master Fund LP",
    taxYear: "2024",
    documentType: "K-1",
    receivedDate: "2025-02-15",
    reviewer: "Sarah Johnson",
    dueDate: "2025-03-15",
    stage: "received",
    description: "Schedule K-1 for Blackstone Real Estate Income Trust IX",
    source: "Blackstone Fund Administration",
    fiscalYear: "2024",
    amount: "$52,300",
    uploadedBy: "System Import",
    fileSize: "2.4 MB",
  },
  {
    id: "2",
    documentName: "K-1 - KKR Americas XII",
    entityName: "Family Office Master Fund LP",
    taxYear: "2024",
    documentType: "K-1",
    receivedDate: "2025-02-10",
    reviewer: "Michael Chen",
    dueDate: "2025-03-15",
    stage: "under-review",
    description: "Schedule K-1 for KKR Americas Fund XII LP",
    source: "KKR Investor Relations",
    fiscalYear: "2024",
    amount: "$78,500",
    status: "In Progress",
    uploadedBy: "Email Import",
    fileSize: "1.8 MB",
  },
  {
    id: "3",
    documentName: "1099-DIV - Goldman Sachs",
    entityName: "Family Office Holdings LLC",
    taxYear: "2024",
    documentType: "1099-DIV",
    receivedDate: "2025-01-31",
    reviewer: "Jessica Liu",
    dueDate: "2025-03-15",
    stage: "filed",
    description: "Dividend income from Goldman Sachs investment accounts",
    source: "Goldman Sachs Private Wealth",
    fiscalYear: "2024",
    amount: "$125,400",
    status: "Complete",
    notes: "Includes qualified and non-qualified dividends",
    uploadedBy: "Portal Sync",
    fileSize: "450 KB",
  },
  {
    id: "4",
    documentName: "K-1 - Apollo Credit Fund III",
    entityName: "Family Office Master Fund LP",
    taxYear: "2024",
    documentType: "K-1",
    receivedDate: "2025-02-05",
    reviewer: "David Park",
    dueDate: "2025-03-15",
    stage: "sent-to-cpa",
    description: "Schedule K-1 for Apollo Credit Opportunities Fund III",
    source: "Apollo Global Management",
    fiscalYear: "2024",
    amount: "$31,200",
    status: "Sent to CPA",
    notes: "Includes foreign tax credit information",
    uploadedBy: "Manual Upload",
    fileSize: "3.1 MB",
  },
]

interface K1ReviewKanbanProps {
  workflowConfig?: {
    attributes: Array<{ id: string; name: string; type: string }>
    stages: Array<{ id: string; name: string; color: string }>
  }
  initialDocuments?: TaxDocument[]
}

// Default stages if no config provided
const defaultStages = [
  { id: "received", name: "Received", color: "bg-gray-100" },
  { id: "under-review", name: "Under Review", color: "bg-blue-100" },
  { id: "filed", name: "Filed", color: "bg-purple-100" },
  { id: "sent-to-cpa", name: "Sent to CPA", color: "bg-green-100" },
]

// Default attributes if no config provided
const defaultAttributes = [
  { id: "documentName", name: "Document", type: "text" },
  { id: "entityName", name: "Entity", type: "text" },
  { id: "taxYear", name: "Tax Year", type: "text" },
  { id: "documentType", name: "Type", type: "text" },
  { id: "receivedDate", name: "Received", type: "date" },
  { id: "reviewer", name: "Reviewer", type: "user" },
  { id: "dueDate", name: "Due Date", type: "date" },
]

// Separate the card UI from the sortable wrapper
function TaxDocumentCard({
  document,
  attributes = defaultAttributes,
}: {
  document: TaxDocument
  attributes?: Array<{ id: string; name: string; type: string }>
}) {
  // Determine document status
  const documentStatus =
    document.stage === "received"
      ? "Received"
      : document.stage === "under-review"
      ? "Under Review"
      : document.stage === "filed"
      ? "Filed"
      : "Sent to CPA"

  // Create document title
  const documentTitle = document.documentName

  // Create document subtitle
  const documentSubtitle = `${document.entityName} • ${document.taxYear}`

  // Define tabs for the drawer
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "notes", label: "Notes", count: 3, icon: FileIcon },
    { id: "files", label: "Files", count: 2, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 4, icon: CheckCircleIcon },
    { id: "emails", label: "Emails", count: 3, icon: MailIcon },
    { id: "activity", label: "Activity", count: null, icon: ClipboardIcon },
  ]

  // Create details panel function using shared builder
  const detailsPanel = (isFullScreen = false) => {
    const infoFields = [
      { label: "Document", value: document.documentName },
      { label: "Entity", value: document.entityName },
      { label: "Tax Year", value: document.taxYear },
      { label: "Document Type", value: document.documentType },
      { label: "Received Date", value: document.receivedDate },
      { label: "Reviewer", value: document.reviewer },
      { label: "Due Date", value: document.dueDate },
      { label: "Amount", value: document.amount || "N/A" },
      { label: "Status", value: documentStatus },
    ]

    // Provide mock related records only for the showcase document
    const entities =
      document.documentName === "K-1 - Blackstone REIT IX"
        ? [
            {
              id: 1,
              name: document.entityName,
              type: "Limited Partner",
            },
          ]
        : []

    const investments =
      document.documentName === "K-1 - Blackstone REIT IX"
        ? [
            {
              id: 1,
              name: "Blackstone Real Estate Income Trust IX",
              amount: "$50M",
              status: "Active",
            },
          ]
        : []

    const sections = buildStandardDetailSections({
      infoTitle: "Document Information",
      infoIcon: <ReceiptIcon className="h-4 w-4 text-muted-foreground" />,
      infoFields,
      entities,
      investments,
      companies: [],
      opportunities: [],
      people: [
        { id: 1, name: document.reviewer, role: "Tax Reviewer" },
        { id: 2, name: "Tax Team", role: "Department" },
      ],
    })

    return (
      <UnifiedDetailsPanel
        sections={sections}
        isFullScreen={isFullScreen}
        activityContent={<UnifiedActivitySection activities={generateWorkflowActivities()} />}
      />
    )
  }

  // Create children function for tabs
  const renderTabContent = (
    activeTab: string,
    viewMode: "card" | "list" | "table",
    setSelectedTask?: (task: any) => void,
    setSelectedNote?: (note: any) => void,
    setSelectedMeeting?: (meeting: any) => void,
    setSelectedEmail?: (email: any) => void,
  ) => {
    // Provide rich mock content only for Blackstone K-1 to showcase workflow container concept
    if (document.documentName === "K-1 - Blackstone REIT IX") {
      // ------------------------------
      // Mock data definitions
      // ------------------------------
      const tasks = [
        {
          id: 1,
          title: "Review K-1 for accuracy",
          priority: "High",
          status: "completed",
          assignee: document.reviewer,
          dueDate: "2025-02-20",
          description: "Verify all amounts and allocations match expectations",
          relatedTo: { type: "Document", name: document.documentName },
        },
        {
          id: 2,
          title: "Cross-reference with fund statements",
          priority: "Medium",
          status: "in-progress",
          assignee: document.reviewer,
          dueDate: "2025-02-22",
          description: "Ensure K-1 matches quarterly capital account statements",
          relatedTo: { type: "Document", name: document.documentName },
        },
        {
          id: 3,
          title: "File in entity tax folder",
          priority: "Medium",
          status: "pending",
          assignee: "Tax Team",
          dueDate: "2025-02-25",
          description: "Save to appropriate entity folder in document management system",
          relatedTo: { type: "Document", name: document.documentName },
        },
        {
          id: 4,
          title: "Send to CPA firm",
          priority: "High",
          status: "pending",
          assignee: document.reviewer,
          dueDate: "2025-03-01",
          description: "Upload to CPA portal or send via secure email",
          relatedTo: { type: "Document", name: document.documentName },
        },
      ]

      const notes = [
        {
          id: 1,
          title: "Foreign tax credit available",
          author: document.reviewer,
          date: "2025-02-16",
          tags: ["tax-credit", "foreign"],
        },
        {
          id: 2,
          title: "State allocation breakdown",
          author: "Michael Chen",
          date: "2025-02-17",
          tags: ["state-tax", "allocation"],
        },
        {
          id: 3,
          title: "Comparison to prior year",
          author: document.reviewer,
          date: "2025-02-18",
          tags: ["analysis", "year-over-year"],
        },
      ]

      const emails = [
        {
          id: 1,
          subject: "2024 K-1 Now Available - Blackstone REIT IX",
          from: "taxdocs@blackstone.com",
          date: "2025-02-15",
          status: "Read",
        },
        {
          id: 2,
          subject: "Important Tax Document - Action Required",
          from: "investor.relations@blackstone.com",
          date: "2025-02-15",
          status: "Read",
        },
        {
          id: 3,
          subject: "Re: K-1 Question - Foreign Tax Credit",
          from: "support@blackstone.com",
          date: "2025-02-17",
          status: "Read",
        },
      ]

      const files = [
        {
          id: 1,
          name: "2024_K1_Blackstone_REIT_IX.pdf",
          uploadedBy: "System Import",
          uploadedDate: "2025-02-15",
          size: "2.4 MB",
        },
        {
          id: 2,
          name: "K1_Summary_Analysis.xlsx",
          uploadedBy: document.reviewer,
          uploadedDate: "2025-02-16",
          size: "125 KB",
        },
      ]

      const activity = [
        {
          id: 1,
          action: "Document received",
          user: "System",
          date: "2025-02-15 09:30 AM",
          details: "K-1 imported from email",
        },
        {
          id: 2,
          action: "Assigned to reviewer",
          user: "Tax Manager",
          date: "2025-02-15 10:00 AM",
          details: `Assigned to ${document.reviewer}`,
        },
        {
          id: 3,
          action: "Review started",
          user: document.reviewer,
          date: "2025-02-16 08:15 AM",
          details: "Moved to Under Review",
        },
      ]

      const dataMap: Record<string, any[]> = {
        tasks,
        notes,
        emails,
        files,
        activity,
      }

      return (
        <TabContentRenderer
          activeTab={activeTab}
          viewMode={viewMode}
          data={dataMap[activeTab] || []}
          onTaskClick={setSelectedTask}
          onNoteClick={setSelectedNote}
          onMeetingClick={setSelectedMeeting}
          onEmailClick={setSelectedEmail}
        />
      )
    }

    // Default placeholder for other documents
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No {activeTab} found for this document</p>
        <p className="text-sm">Add some {activeTab} to get started</p>
      </div>
    )
  }

  // Function to get the appropriate icon for each attribute type
  const getAttributeIcon = (type: string, id: string) => {
    if (id === "documentType") return ReceiptIcon
    if (id === "receivedDate" || id === "dueDate") return CalendarIcon
    if (id === "entityName") return BuildingIcon
    
    switch (type) {
      case "date":
        return CalendarIcon
      case "user":
        return UserIcon
      case "text":
      default:
        return FileTextIcon
    }
  }

  // Function to render attribute value based on type
  const renderAttributeValue = (attribute: any, value: any) => {
    if (!value) return "—"

    return (
      <span
        className="outline-none hover:bg-primary/10 rounded-sm px-0.5 cursor-text transition-colors"
        contentEditable
        suppressContentEditableWarning
      >
        {value}
      </span>
    )
  }

  return (
    <MasterDrawer
      trigger={
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200 hover:border-gray-300 group"
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 truncate cursor-pointer group-hover:underline">
                  {document.documentName}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{document.entityName} • {document.taxYear}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                    <MoreVerticalIcon className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Download</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent
            className="pt-0 space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              {attributes.map((attribute) => {
                const Icon = getAttributeIcon(attribute.type, attribute.id)
                const value = (document as any)[attribute.id]

                if (!value || attribute.id === "documentName" || attribute.id === "entityName") return null

                return (
                  <div key={attribute.id} className="flex items-center gap-2 text-xs">
                    <Icon className="h-3 w-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-500 truncate">{attribute.name}:</span>
                    <span className="truncate">{renderAttributeValue(attribute, value)}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      }
      title={documentTitle}
      recordType="Tax Document"
      subtitle={documentSubtitle}
      tabs={tabs}
      children={renderTabContent}
      detailsPanel={detailsPanel}
      onComposeEmail={() => {}}
    />
  )
}

function SortableTaxDocumentCard({
  document,
  attributes,
}: {
  document: TaxDocument
  attributes?: Array<{ id: string; name: string; type: string }>
}) {
  const {
    attributes: dndAttributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: document.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...dndAttributes} 
      {...listeners} 
      className="touch-manipulation"
      suppressHydrationWarning
    >
      <TaxDocumentCard document={document} attributes={attributes} />
    </div>
  )
}

function DroppableColumn({
  stage,
  documents,
  attributes,
}: {
  stage: { id: string; name: string; color: string }
  documents: TaxDocument[]
  attributes?: Array<{ id: string; name: string; type: string }>
}) {
  const { setNodeRef, isOver } = useSortable({
    id: stage.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-h-[600px] w-80 transition-all duration-200 ${
        isOver ? "ring-2 ring-blue-500 ring-opacity-30 bg-blue-50/20" : ""
      }`}
    >
      <div className={`rounded-t-xl p-4 border border-gray-200 ${stage.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-sm text-gray-900">{stage.name}</h3>
            <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs bg-white/80 text-gray-700 flex items-center justify-center">
              {documents.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-700">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50/50 rounded-b-xl border-l border-r border-b border-gray-200 p-3 space-y-3">
        <SortableContext items={documents.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          {documents.map((document) => (
            <SortableTaxDocumentCard key={document.id} document={document} attributes={attributes} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

// New component for adding a column
function AddColumnButton({ onAddColumn }: { onAddColumn: () => void }) {
  return (
    <div className="flex flex-col min-h-[600px] w-16 justify-center items-center">
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
        onClick={onAddColumn}
        title="Add Column"
      >
        <PlusIcon className="h-5 w-5 text-gray-400" />
      </Button>
    </div>
  )
}

// New dialog for adding a column
function AddColumnDialog({
  open,
  onOpenChange,
  onAddColumn,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddColumn: (name: string, color: string) => void
}) {
  const [name, setName] = React.useState("")
  const [color, setColor] = React.useState("bg-gray-100")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onAddColumn(name, color)
      setName("")
      onOpenChange(false)
    }
  }

  const colorOptions = [
    { value: "bg-gray-100", label: "Gray" },
    { value: "bg-blue-100", label: "Blue" },
    { value: "bg-green-100", label: "Green" },
    { value: "bg-yellow-100", label: "Yellow" },
    { value: "bg-purple-100", label: "Purple" },
    { value: "bg-red-100", label: "Red" },
    { value: "bg-orange-100", label: "Orange" },
    { value: "bg-pink-100", label: "Pink" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="column-name">Column Name</Label>
            <Input
              id="column-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., In Review"
              autoFocus
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label>Column Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((option) => (
                <div
                  key={option.value}
                  className={`h-10 rounded-lg cursor-pointer ${option.value} border-2 transition-all ${
                    color === option.value
                      ? "border-blue-500 scale-105 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setColor(option.value)}
                  title={option.label}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()} className="bg-blue-600 hover:bg-blue-700">
              Add Column
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function K1ReviewKanban({ workflowConfig, initialDocuments: propDocuments }: K1ReviewKanbanProps) {
  const [documents, setDocuments] = React.useState(propDocuments || initialDocuments)
  const [activeDocument, setActiveDocument] = React.useState<TaxDocument | null>(null)
  const [stagesList, setStagesList] = React.useState(workflowConfig?.stages || defaultStages)
  const [addColumnDialogOpen, setAddColumnDialogOpen] = React.useState(false)

  // Update stages when workflow config changes
  React.useEffect(() => {
    if (workflowConfig?.stages) {
      setStagesList(workflowConfig.stages)
    }
  }, [workflowConfig?.stages])

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor),
  )

  function handleDragStart(event: any) {
    const { active } = event
    const activeId = active.id as string
    const document = documents.find((d) => d.id === activeId)
    if (document) {
      setActiveDocument(document)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDocument(null)
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeDocument = documents.find((d) => d.id === activeId)
    if (!activeDocument) return

    // Find which stage the item is being dropped on
    let targetStage = overId

    // If dropping on another document, find its stage
    if (!stagesList.some((s) => s.id === overId)) {
      const targetDocument = documents.find((d) => d.id === overId)
      if (targetDocument) {
        targetStage = targetDocument.stage
      }
    }

    // Update the document's stage if it's different
    if (activeDocument.stage !== targetStage && stagesList.some((s) => s.id === targetStage)) {
      setDocuments(documents.map((document) => (document.id === activeId ? { ...document, stage: targetStage } : document)))
    }
  }

  const handleAddColumn = (name: string, color: string) => {
    const newStage = {
      id: `stage-${Date.now()}`,
      name: name,
      color: color,
    }
    setStagesList([...stagesList, newStage])
  }

  const documentsByStage = stagesList.map((stage) => ({
    stage,
    documents: documents.filter((document) => document.stage === stage.id),
  }))

  const attributes = workflowConfig?.attributes || defaultAttributes

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {documentsByStage.map(({ stage, documents }) => (
          <DroppableColumn key={stage.id} stage={stage} documents={documents} attributes={attributes} />
        ))}
        <AddColumnButton onAddColumn={() => setAddColumnDialogOpen(true)} />
      </div>
      <DragOverlay>
        {activeDocument ? (
          <div className="w-80 opacity-80 shadow-lg">
            <TaxDocumentCard document={activeDocument} attributes={attributes} />
          </div>
        ) : null}
      </DragOverlay>
      <AddColumnDialog open={addColumnDialogOpen} onOpenChange={setAddColumnDialogOpen} onAddColumn={handleAddColumn} />
    </DndContext>
  )
} 