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
  DollarSignIcon,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeIcon,
  TrendingUpIcon,
  FileTextIcon,
  UsersIcon,
  CheckCircleIcon,
  FolderIcon,
  FileIcon,
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
  documentName: string
  entityName: string
  dueDate: string
  assignedTo: string
  documentType: string
  stage: string
  // Additional fields for detailed view
  description?: string
  taxYear?: string
  fileType?: string
  fileSize?: string
  lastUpdated?: string
  uploadedBy?: string
  relatedEntities?: string[]
  notes?: string
  documentURL?: string
}

const initialTaxDocuments: TaxDocument[] = [
  {
    id: "1",
    documentName: "W-2 Forms",
    entityName: "Johnson Family Trust",
    dueDate: "2024-02-15",
    assignedTo: "Sarah Chen",
    documentType: "Income",
    stage: "requested",
    description: "Employee wage and tax statements for all family employees",
    taxYear: "2023",
    fileType: "PDF",
    fileSize: "2.3 MB",
    lastUpdated: "2024-01-10",
    uploadedBy: "N/A",
    relatedEntities: ["Johnson Holdings LLC", "Johnson Family Foundation"],
    notes: "Need to collect from all five family members employed by the trust",
    documentURL: "#",
  },
  {
    id: "2",
    documentName: "1099-DIV",
    entityName: "Smith Investments LLC",
    dueDate: "2024-02-28",
    assignedTo: "Mike Rodriguez",
    documentType: "Investment",
    stage: "pending",
    description: "Dividend income statements from all investment accounts",
    taxYear: "2023",
    fileType: "PDF",
    fileSize: "1.5 MB",
    lastUpdated: "2024-01-15",
    uploadedBy: "N/A",
    relatedEntities: ["Smith Family Trust"],
    notes: "Waiting on final statements from Vanguard and Fidelity",
    documentURL: "#",
  },
  {
    id: "3",
    documentName: "K-1 Partnership Income",
    entityName: "BlackRock Ventures",
    dueDate: "2024-03-15",
    assignedTo: "Lisa Wang",
    documentType: "Partnership",
    stage: "received",
    description: "Partnership income statements for all LLC investments",
    taxYear: "2023",
    fileType: "PDF",
    fileSize: "3.7 MB",
    lastUpdated: "2024-01-18",
    uploadedBy: "Lisa Wang",
    relatedEntities: ["Johnson Family Trust", "Tech Ventures Fund"],
    notes: "Received early from BlackRock, still waiting on three other partnerships",
    documentURL: "#",
  },
  {
    id: "4",
    documentName: "Property Tax Statements",
    entityName: "Coastal Properties LLC",
    dueDate: "2024-04-01",
    assignedTo: "David Kim",
    documentType: "Real Estate",
    stage: "reviewed",
    description: "Annual property tax statements for all real estate holdings",
    taxYear: "2023",
    fileType: "PDF",
    fileSize: "5.2 MB",
    lastUpdated: "2024-01-22",
    uploadedBy: "David Kim",
    relatedEntities: ["Johnson Family Trust", "Coastal Holdings Inc."],
    notes: "All statements received and verified, ready for tax preparation",
    documentURL: "#",
  },
  {
    id: "5",
    documentName: "Charitable Donation Receipts",
    entityName: "Johnson Family Foundation",
    dueDate: "2024-03-01",
    assignedTo: "Sarah Chen",
    documentType: "Charitable",
    stage: "filed",
    description: "Receipts for all charitable donations made by the foundation",
    taxYear: "2023",
    fileType: "PDF",
    fileSize: "4.1 MB",
    lastUpdated: "2024-01-25",
    uploadedBy: "Sarah Chen",
    relatedEntities: ["Johnson Family Trust"],
    notes: "All donation receipts collected, verified, and filed for tax preparation",
    documentURL: "#",
  },
]

const stages = [
  { id: "requested", title: "Requested", color: "bg-gray-100" },
  { id: "pending", title: "Pending", color: "bg-blue-100" },
  { id: "received", title: "Received", color: "bg-yellow-100" },
  { id: "reviewed", title: "Reviewed", color: "bg-purple-100" },
  { id: "filed", title: "Filed", color: "bg-green-100" },
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
                <h4 className="font-medium text-sm">{document.documentName}</h4>
                <p className="text-xs text-muted-foreground">{document.entityName}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVerticalIcon className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Download</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <FileIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Type:</span>
                <span>{document.documentType}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Due:</span>
                <span>{document.dueDate}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <UserIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Assigned:</span>
                <span>{document.assignedTo}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Year:</span>
                <span>{document.taxYear}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <TaxDocumentDetails document={document} isFullScreen={false} />
      </SheetContent>
    </Sheet>
  )
}

function SortableTaxDocumentCard({ document }: { document: TaxDocument }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: document.id,
    data: { type: "tax-document", document },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaxDocumentCard document={document} />
    </div>
  )
}

function TaxDocumentDetails({ document, isFullScreen }: { document: TaxDocument; isFullScreen: boolean }) {
  const BackButton = isFullScreen ? (
    <Button variant="ghost" size="icon" className="h-8 w-8 mr-2">
      <ChevronLeftIcon className="h-4 w-4" />
    </Button>
  ) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        {BackButton}
        <h2 className="text-xl font-semibold">{document.documentName}</h2>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Document Details</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Entity Name</Label>
            <div className="text-sm font-medium">{document.entityName}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Document Type</Label>
            <div className="text-sm font-medium">{document.documentType}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Tax Year</Label>
            <div className="text-sm font-medium">{document.taxYear}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Due Date</Label>
            <div className="text-sm font-medium">{document.dueDate}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">File Type</Label>
            <div className="text-sm font-medium">{document.fileType}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">File Size</Label>
            <div className="text-sm font-medium">{document.fileSize}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Last Updated</Label>
            <div className="text-sm font-medium">{document.lastUpdated}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Uploaded By</Label>
            <div className="text-sm font-medium">{document.uploadedBy}</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Description</h3>
        <p className="text-sm">{document.description}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Related Entities</h3>
        <div className="flex flex-wrap gap-2">
          {document.relatedEntities?.map((entity, index) => (
            <Badge key={index} variant="secondary">
              {entity}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Notes</h3>
        <p className="text-sm">{document.notes}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Actions</h3>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            <FileIcon className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button size="sm" variant="outline">
            <FileTextIcon className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>
    </div>
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
        <SortableContext items={documents.map(d => d.id)} strategy={verticalListSortingStrategy}>
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
    useSensor(KeyboardSensor)
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
      setDocuments(documents.map((document) => 
        (document.id === activeId ? { ...document, stage: targetStage } : document)
      ))
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