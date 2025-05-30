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
  ExpandIcon,
  ChevronLeftIcon,
  MailIcon,
  BuildingIcon,
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  FolderIcon,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"

interface TaxDocument {
  id: string
  documentType: string
  taxYear: string
  entity: string
  investor: string
  dueDate: string
  stage: string
  // Additional fields for detailed view
  description?: string
  filingDeadline?: string
  submittedDate?: string
  reviewer?: string
  priority?: string
  notes?: string
  filingFee?: string
}

const initialTaxDocuments: TaxDocument[] = [
  {
    id: "1",
    documentType: "K-1 Partnership",
    taxYear: "2024",
    entity: "Venture Fund I LP",
    investor: "Pension Fund Alpha",
    dueDate: "2024-02-15",
    stage: "requested",
    description: "K-1 partnership tax document for limited partner",
    filingDeadline: "2024-03-15",
    priority: "High",
    notes: "Initial request sent to investor",
  },
  {
    id: "2",
    documentType: "1099-DIV",
    taxYear: "2024",
    entity: "Growth Fund II LP",
    investor: "Family Office Beta",
    dueDate: "2024-01-31",
    stage: "sent-to-investor",
    description: "Dividend distribution tax document",
    filingDeadline: "2024-04-15",
    submittedDate: "2024-01-28",
    priority: "Medium",
  },
  {
    id: "3",
    documentType: "Tax Return",
    taxYear: "2023",
    entity: "Real Estate Fund LP",
    investor: "Insurance Co Gamma",
    dueDate: "2024-01-15",
    stage: "pending-review",
    description: "Annual tax return documentation",
    filingDeadline: "2024-03-15",
    submittedDate: "2024-01-14",
    reviewer: "Sarah Johnson",
    priority: "High",
  },
  {
    id: "4",
    documentType: "Supporting Documents",
    taxYear: "2024",
    entity: "Tech Fund III LP",
    investor: "Endowment Delta",
    dueDate: "2024-02-01",
    stage: "under-review",
    description: "Supporting tax documentation and schedules",
    filingDeadline: "2024-04-15",
    submittedDate: "2024-01-30",
    reviewer: "Michael Chen",
    priority: "Medium",
  },
  {
    id: "5",
    documentType: "K-1 Partnership",
    taxYear: "2023",
    entity: "Venture Fund I LP",
    investor: "Corporate Fund Epsilon",
    dueDate: "2024-01-10",
    stage: "approved",
    description: "K-1 partnership tax document for limited partner",
    filingDeadline: "2024-03-15",
    submittedDate: "2024-01-08",
    reviewer: "Lisa Wang",
    priority: "Low",
  },
  {
    id: "6",
    documentType: "1099-INT",
    taxYear: "2023",
    entity: "Bond Fund LP",
    investor: "Sovereign Wealth Zeta",
    dueDate: "2024-01-05",
    stage: "filed",
    description: "Interest income tax document",
    filingDeadline: "2024-03-15",
    submittedDate: "2024-01-03",
    reviewer: "David Kim",
    priority: "Low",
  },
]

const stages = [
  { id: "requested", title: "Requested", color: "bg-gray-100" },
  { id: "sent-to-investor", title: "Sent to Investor", color: "bg-blue-100" },
  { id: "pending-review", title: "Pending Review", color: "bg-yellow-100" },
  { id: "under-review", title: "Under Review", color: "bg-orange-100" },
  { id: "approved", title: "Approved", color: "bg-green-100" },
  { id: "filed", title: "Filed", color: "bg-purple-100" },
]

// Separate the card UI from the sortable wrapper
function TaxDocumentCard({ document }: { document: TaxDocument }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{document.documentType}</h4>
                <p className="text-xs text-muted-foreground">Tax Year {document.taxYear}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVerticalIcon className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Cancel Request</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <BuildingIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Entity:</span>
                <span>{document.entity}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <UserIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Investor:</span>
                <span>{document.investor}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Due:</span>
                <span>{document.dueDate}</span>
              </div>
              {document.submittedDate && (
                <div className="flex items-center gap-2 text-xs">
                  <FileTextIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Submitted:</span>
                  <span>{document.submittedDate}</span>
                </div>
              )}
              {document.reviewer && (
                <div className="flex items-center gap-2 text-xs">
                  <UserIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Reviewer:</span>
                  <span>{document.reviewer}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full max-w-4xl flex-col p-0 sm:max-w-4xl [&>button]:hidden">
        <TaxDocumentDrawerContent document={document} />
      </SheetContent>
    </Sheet>
  )
}

function SortableTaxDocumentCard({ document }: { document: TaxDocument }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: document.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-manipulation">
      <TaxDocumentCard document={document} />
    </div>
  )
}

function TaxDocumentDrawerContent({ document }: { document: TaxDocument }) {
  const [activeTab, setActiveTab] = React.useState("details")

  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "history", label: "History", count: 3, icon: CalendarIcon },
    { id: "files", label: "Files", count: 5, icon: FolderIcon },
    { id: "notes", label: "Notes", count: 2, icon: FileTextIcon },
  ]

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => document.querySelector('[data-state="open"]')?.click()}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Badge variant="outline" className="bg-background">
            {document.documentType}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ExpandIcon className="h-4 w-4" />
            Full screen
          </Button>
          <Button variant="outline" size="sm">
            <MailIcon className="h-4 w-4" />
            Send reminder
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Record Header */}
        <div className="border-b bg-background px-6 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {document.documentType.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{document.documentType}</h2>
              <p className="text-sm text-muted-foreground">
                Tax Year {document.taxYear} • {document.entity}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b bg-background px-6">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative whitespace-nowrap py-3 text-sm font-medium flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon && <tab.icon className="h-4 w-4" />}
                {tab.label}
                {tab.count !== null && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                    {tab.count}
                  </Badge>
                )}
                {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"></span>}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "details" ? (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Tax Document Details</h4>

              <div className="rounded-lg border border-muted bg-muted/10 p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Document Type</Label>
                      <p className="text-sm font-medium">{document.documentType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Tax Year</Label>
                      <p className="text-sm">{document.taxYear}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Entity</Label>
                      <p className="text-sm">{document.entity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Investor</Label>
                      <p className="text-sm">{document.investor}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Due Date</Label>
                      <p className="text-sm">{document.dueDate}</p>
                    </div>
                  </div>

                  {document.filingDeadline && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Filing Deadline</Label>
                        <p className="text-sm">{document.filingDeadline}</p>
                      </div>
                    </div>
                  )}

                  {document.submittedDate && (
                    <div className="flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Submitted Date</Label>
                        <p className="text-sm">{document.submittedDate}</p>
                      </div>
                    </div>
                  )}

                  {document.reviewer && (
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Reviewer</Label>
                        <p className="text-sm">{document.reviewer}</p>
                      </div>
                    </div>
                  )}

                  {document.description && (
                    <div className="flex items-start gap-2">
                      <FileTextIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground">Description</Label>
                        <p className="text-sm">{document.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                No {activeTab} found for {document.documentType}
              </p>
              <p className="text-sm">Add some {activeTab} to get started</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function DroppableColumn({ stage, documents }: { stage: (typeof stages)[0]; documents: TaxDocument[] }) {
  const { setNodeRef, isOver } = useSortable({
    id: stage.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-h-[600px] w-80 ${isOver ? "ring-2 ring-primary ring-opacity-50 bg-muted/20" : ""}`}
    >
      <div className={`rounded-t-lg p-3 ${stage.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm">{stage.title}</h3>
            <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs">
              {documents.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50 rounded-b-lg p-3 space-y-3">
        <SortableContext items={documents.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          {documents.map((document) => (
            <SortableTaxDocumentCard key={document.id} document={document} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

export function TaxDocumentKanban() {
  const [documents, setDocuments] = React.useState(initialTaxDocuments)
  const [activeDocument, setActiveDocument] = React.useState<TaxDocument | null>(null)

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
    if (!stages.some((s) => s.id === overId)) {
      const targetDocument = documents.find((d) => d.id === overId)
      if (targetDocument) {
        targetStage = targetDocument.stage
      }
    }

    // Update the document's stage if it's different
    if (activeDocument.stage !== targetStage && stages.some((s) => s.id === targetStage)) {
      setDocuments(
        documents.map((document) => (document.id === activeId ? { ...document, stage: targetStage } : document)),
      )
    }
  }

  const documentsByStage = stages.map((stage) => ({
    stage,
    documents: documents.filter((document) => document.stage === stage.id),
  }))

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {documentsByStage.map(({ stage, documents }) => (
          <DroppableColumn key={stage.id} stage={stage} documents={documents} />
        ))}
      </div>
      <DragOverlay>
        {activeDocument ? (
          <div className="w-80 opacity-80 shadow-lg">
            <TaxDocumentCard document={activeDocument} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
