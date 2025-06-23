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
  ChevronDownIcon,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { MasterDrawer } from "./master-drawer"

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

// Default stages if no config provided
const defaultStages = [
  { id: "requested", name: "Requested", color: "bg-gray-100" },
  { id: "pending", name: "Pending", color: "bg-blue-100" },
  { id: "received", name: "Received", color: "bg-yellow-100" },
  { id: "reviewed", name: "Reviewed", color: "bg-purple-100" },
  { id: "filed", name: "Filed", color: "bg-green-100" },
]

// Default attributes for tax documents
const defaultAttributes = [
  { id: "documentName", name: "Document Name", type: "text" },
  { id: "entityName", name: "Entity", type: "relation" },
  { id: "documentType", name: "Type", type: "text" },
  { id: "dueDate", name: "Due Date", type: "date" },
  { id: "assignedTo", name: "Assigned To", type: "user" },
  { id: "taxYear", name: "Tax Year", type: "text" },
]

interface TaxDocumentKanbanProps {
  workflowConfig?: {
    attributes: Array<{ id: string; name: string; type: string }>
    stages: Array<{ id: string; name: string; color: string }>
  }
  initialDocuments?: TaxDocument[]
}

// Separate the card UI from the sortable wrapper
function TaxDocumentCard({ document }: { document: TaxDocument }) {
  // Define tabs for the drawer
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: CheckCircleIcon },
    { id: "notes", label: "Notes", count: 3, icon: FileTextIcon },
    { id: "emails", label: "Emails", count: 5, icon: MailIcon },
    { id: "files", label: "Files", count: 1, icon: FolderIcon },
    { id: "activity", label: "Activity", count: null, icon: CalendarIcon },
  ]

  // Move state hooks outside of detailsPanel
  const [openSections, setOpenSections] = React.useState<{
    details: boolean;
    documentInfo: boolean;
    entityInfo: boolean;
    statusInfo: boolean;
  }>({
    details: true, // Details expanded by default
    documentInfo: false,
    entityInfo: false,
    statusInfo: false,
  });

  // Add state for showing all values
  const [showingAllValues, setShowingAllValues] = React.useState(false);

  // Create details panel function
  const detailsPanel = (isFullScreen = false) => {
    // Toggle function for collapsible sections
    const toggleSection = (section: 'details' | 'documentInfo' | 'entityInfo' | 'statusInfo') => {
      setOpenSections(prev => ({
        ...prev,
        [section]: !prev[section],
      }));
    };

    // Basic fields for collapsed view
    const basicFields = [
      {
        label: "Document Name",
        value: document.documentName,
      },
      {
        label: "Entity Name",
        value: document.entityName,
      },
      {
        label: "Document Type",
        value: document.documentType,
      },
      {
        label: "Due Date",
        value: document.dueDate,
      },
      {
        label: "Assigned To",
        value: document.assignedTo,
      },
    ] as Array<{
      label: string;
      value: React.ReactNode;
      isLink?: boolean;
    }>;

    // Extended fields for "Show all" view
    const extendedFields = [
      {
        label: "Document Name",
        value: document.documentName,
      },
      {
        label: "Entity Name",
        value: document.entityName,
        isLink: true,
      },
      {
        label: "Document Type",
        value: document.documentType,
      },
      {
        label: "Tax Year",
        value: document.taxYear || "N/A",
      },
      {
        label: "Due Date",
        value: document.dueDate,
      },
      {
        label: "Assigned To",
        value: document.assignedTo,
      },
      {
        label: "File Type",
        value: document.fileType || "N/A",
      },
      {
        label: "File Size",
        value: document.fileSize || "N/A",
      },
      {
        label: "Last Updated",
        value: document.lastUpdated || "N/A",
      },
      {
        label: "Uploaded By",
        value: document.uploadedBy || "N/A",
      },
      {
        label: "Description",
        value: document.description || "No description available",
      },
    ] as Array<{
      label: string;
      value: React.ReactNode;
      isLink?: boolean;
    }>;

    // Mock data for related entities
    const relatedData = {
      documentInfo: [
        { id: 1, name: "File Type", value: document.fileType || "PDF" },
        { id: 2, name: "File Size", value: document.fileSize || "N/A" },
      ],
      entityInfo: [
        { id: 1, name: document.entityName, role: "Primary Entity" },
        ...(document.relatedEntities || []).map((entity, idx) => ({ id: idx + 2, name: entity, role: "Related Entity" })),
      ],
      statusInfo: [
        { id: 1, name: "Last Updated", value: document.lastUpdated || "N/A" },
        { id: 2, name: "Uploaded By", value: document.uploadedBy || "N/A" },
      ],
    };

    // Render the detail fields
    const renderFields = (fields: typeof basicFields, showAllButton: boolean = false) => (
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={index} className="flex items-center">
            <Label className="text-xs text-muted-foreground w-28 shrink-0 ml-2">{field.label}</Label>
            {field.isLink ? (
              <p className="text-sm text-blue-600 flex-1">{field.value}</p>
            ) : (
              <p className="text-sm flex-1">{field.value}</p>
            )}
          </div>
        ))}
        {showAllButton && (
          <div className="flex items-center mt-2">
            <Button 
              variant="link" 
              className="h-auto p-0 text-xs text-blue-600 ml-2"
              onClick={() => setShowingAllValues(true)}
            >
              Show all
            </Button>
          </div>
        )}
      </div>
    );

    // Items section for related data
    const ItemsSection = ({ 
      items 
    }: { 
      items: any[] 
    }) => {
      return (
        <div className="ml-2 group/section">
          <div className="flex flex-col space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-muted/50 transition-colors flex items-center gap-1 py-1 w-fit font-normal"
                >
                  {item.name}
                  {item.role && <span className="text-muted-foreground"> - {item.role}</span>}
                  {item.value && <span className="ml-2">{item.value}</span>}
                </Badge>
              </div>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 text-xs text-muted-foreground opacity-0 group-hover/section:opacity-100 transition-opacity"
          >
            <PlusIcon className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      );
    };

    // Apple-style section headers and content
    const sections = [
      {
        id: 'details',
        title: 'Document Details',
        icon: FileTextIcon,
        content: renderFields(showingAllValues ? extendedFields : basicFields, !showingAllValues),
        count: null
      },
      {
        id: 'documentInfo',
        title: 'Document Information',
        icon: FileIcon,
        content: <ItemsSection items={relatedData.documentInfo} />,
        count: relatedData.documentInfo.length
      },
      {
        id: 'entityInfo',
        title: 'Related Entities',
        icon: BuildingIcon,
        content: <ItemsSection items={relatedData.entityInfo} />,
        count: relatedData.entityInfo.length
      },
      {
        id: 'statusInfo',
        title: 'Status Information',
        icon: CalendarIcon,
        content: <ItemsSection items={relatedData.statusInfo} />,
        count: relatedData.statusInfo.length
      },
    ];

    // Mock activity data
    const activities = [
      {
        id: 1,
        type: "request",
        actor: "Tax Team",
        action: "requested document",
        target: document.documentName,
        timestamp: "3 weeks ago",
      },
      {
        id: 2,
        type: "reminder",
        actor: "System",
        action: "sent reminder for",
        target: document.documentName,
        timestamp: "2 weeks ago",
      },
      {
        id: 3,
        type: "upload",
        actor: document.uploadedBy || "N/A",
        action: "uploaded document",
        target: document.documentName,
        timestamp: document.lastUpdated ? `on ${document.lastUpdated}` : "N/A",
      },
    ];

    return (
      <div className="px-6 pt-2 pb-6">
        {/* Unified container with Apple-style cohesive design */}
        <div className="rounded-lg border border-muted overflow-hidden">
          {sections.map((section, index) => {
            const isOpen = openSections[section.id as keyof typeof openSections];
            const Icon = section.icon;
            
            return (
              <React.Fragment key={section.id}>
                {/* Divider between sections (except for the first one) */}
                {index > 0 && (
                  <div className="h-px bg-muted mx-3" />
                )}
                
                {/* Section Header */}
                <button 
                  onClick={() => toggleSection(section.id as 'details' | 'documentInfo' | 'entityInfo' | 'statusInfo')}
                  className={`w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors ${isOpen ? 'bg-muted/20' : ''}`}
                >
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 text-muted-foreground ml-2" />
                    <h4 className="text-sm font-medium ml-2">{section.title}</h4>
                    
                    {/* Show count badge for sections that have counts */}
                    {section.count !== null && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 rounded-full text-xs">
                        {section.count}
                      </Badge>
                    )}
                  </div>
                  <ChevronDownIcon 
                    className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {/* Section Content with smooth height transition */}
                {isOpen && (
                  <div className="px-3 pb-3 pt-2 group/section">
                    {section.content}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Activity Section - Only in Drawer View */}
        {!isFullScreen && (
          <div className="mt-8">
            <div className="mb-4">
              <h4 className="text-sm font-medium">Activity</h4>
            </div>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className={`h-2 w-2 rounded-full ${
                      activity.type === "request" ? "bg-blue-500" : 
                      activity.type === "reminder" ? "bg-yellow-500" : "bg-green-500"
                    }`}></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">
                        <span className="font-medium">{activity.actor}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>{" "}
                        <Badge variant="outline" className="text-xs mx-1">
                          {activity.target}
                        </Badge>
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Create children function for tabs
  const renderTabContent = (
    activeTab: string,
    viewMode: "card" | "list" | "table",
  ) => {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No {activeTab} found for this document</p>
        <p className="text-sm">Add some {activeTab} to get started</p>
      </div>
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
                <h4 className="font-semibold text-sm text-gray-900 truncate cursor-pointer group-hover:underline">{document.documentName}</h4>
                <p className="text-xs text-gray-500 mt-1">{document.entityName}</p>
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
      }
      title={document.documentName}
      recordType="Tax Documents"
      subtitle={`${document.entityName} • ${document.documentType}`}
      tabs={tabs}
      detailsPanel={detailsPanel}
    >
      {renderTabContent}
    </MasterDrawer>
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
      {...attributes} 
      {...listeners} 
      className="touch-manipulation"
      suppressHydrationWarning
    >
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
    <>
      <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => {
            if (!isFullScreen) {
              const element = window.document.querySelector('[data-state="open"]');
              if (element && element instanceof HTMLElement) {
                element.click();
              }
            }
          }}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Badge variant="outline" className="bg-background">
            {document.documentName}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ExpandIcon className="h-4 w-4" />
            Full screen
          </Button>
          <Button variant="outline" size="sm">
            <FileIcon className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">{document.documentName}</h2>
          <p className="text-muted-foreground">{document.entityName} • {document.documentType}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Document Information</h3>
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">Document Type</Label>
                    <p className="text-sm">{document.documentType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">Tax Year</Label>
                    <p className="text-sm">{document.taxYear}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">File Type</Label>
                    <p className="text-sm">{document.fileType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">File Size</Label>
                    <p className="text-sm">{document.fileSize}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Status Information</h3>
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">Due Date</Label>
                    <p className="text-sm">{document.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">Assigned To</Label>
                    <p className="text-sm">{document.assignedTo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">Last Updated</Label>
                    <p className="text-sm">{document.lastUpdated}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">Uploaded By</Label>
                    <p className="text-sm">{document.uploadedBy || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Description</h3>
          <p className="text-sm">{document.description}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Notes</h3>
          <p className="text-sm">{document.notes}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Related Entities</h3>
          <div className="flex flex-wrap gap-2">
            {document.relatedEntities?.map((entity, index) => (
              <Badge key={index} variant="outline">
                {entity}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function DroppableColumn({ stage, documents }: { 
  stage: { id: string; name: string; color: string }; 
  documents: TaxDocument[] 
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
            <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs bg-white/80 text-gray-700">
              {documents.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-700">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50/50 rounded-b-xl border-l border-r border-b border-gray-200 p-3 space-y-3">
        <SortableContext items={documents.map((doc) => doc.id)} strategy={verticalListSortingStrategy}>
          {documents.map((document) => (
            <SortableTaxDocumentCard key={document.id} document={document} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

// Add Column Button Component
function AddColumnButton({ onAddColumn }: { onAddColumn: () => void }) {
  return (
    <div className="flex items-center justify-center w-16">
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
        onClick={onAddColumn}
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

export function TaxDocumentKanban({ workflowConfig, initialDocuments }: TaxDocumentKanbanProps) {
  const [documents, setDocuments] = React.useState(initialDocuments || initialTaxDocuments)
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
      setDocuments(
        documents.map((document) =>
          document.id === activeId ? { ...document, stage: targetStage } : document,
        ),
      )
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
          <DroppableColumn key={stage.id} stage={stage} documents={documents} />
        ))}
        <AddColumnButton onAddColumn={() => setAddColumnDialogOpen(true)} />
      </div>
      <DragOverlay>
        {activeDocument ? (
          <div className="w-80 opacity-80 shadow-lg">
            <TaxDocumentCard document={activeDocument} />
          </div>
        ) : null}
      </DragOverlay>
      <AddColumnDialog open={addColumnDialogOpen} onOpenChange={setAddColumnDialogOpen} onAddColumn={handleAddColumn} />
    </DndContext>
  )
}
