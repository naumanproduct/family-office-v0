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
  ClipboardCheckIcon,
  FileTextIcon,
  ScaleIcon,
  ClockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  FolderIcon,
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

interface ComplianceItem {
  id: string
  entityName: string
  itemType: string
  dueDate: string
  responsiblePerson: string
  priority: string
  stage: string
  // Additional fields for detailed view
  description?: string
  entityType?: string
  jurisdiction?: string
  filingFrequency?: string
  lastFiled?: string
  requirements?: string
  estimatedCost?: string
  notes?: string
  documents?: { name: string; url: string }[]
  relatedEntities?: string[]
}

const initialComplianceItems: ComplianceItem[] = [
  {
    id: "1",
    entityName: "Johnson Family Trust",
    itemType: "Annual Report",
    dueDate: "2024-03-31",
    responsiblePerson: "Sarah Chen",
    priority: "High",
    stage: "upcoming",
    description: "Annual report filing with Secretary of State",
    entityType: "Trust",
    jurisdiction: "Delaware",
    filingFrequency: "Annual",
    lastFiled: "2023-03-25",
    requirements: "Financial statements, trustee information, beneficiary updates",
    estimatedCost: "$350",
    notes: "Last year had a 10-day extension, may need one this year as well",
    documents: [
      { name: "Last year's filing", url: "#" },
      { name: "Filing instructions", url: "#" }
    ],
    relatedEntities: ["Johnson Holdings LLC"],
  },
  {
    id: "2",
    entityName: "Smith Investments LLC",
    itemType: "Tax Registration Renewal",
    dueDate: "2024-02-28",
    responsiblePerson: "Mike Rodriguez",
    priority: "Medium",
    stage: "in-progress",
    description: "Renewal of state tax registration",
    entityType: "Limited Liability Company",
    jurisdiction: "New York",
    filingFrequency: "Annual",
    lastFiled: "2023-02-15",
    requirements: "Entity information, member details, business activity description",
    estimatedCost: "$250",
    notes: "Need updated member information from John Smith",
    documents: [
      { name: "Renewal form template", url: "#" },
      { name: "Prior year registration", url: "#" }
    ],
    relatedEntities: ["Smith Family Trust"],
  },
  {
    id: "3",
    entityName: "Coastal Properties LLC",
    itemType: "Business License",
    dueDate: "2024-04-15",
    responsiblePerson: "Lisa Wang",
    priority: "High",
    stage: "review",
    description: "Renewal of business license for property management",
    entityType: "Limited Liability Company",
    jurisdiction: "Florida",
    filingFrequency: "Annual",
    lastFiled: "2023-04-10",
    requirements: "Property inventory, management certification, insurance verification",
    estimatedCost: "$500",
    notes: "Need updated insurance certificates for all properties",
    documents: [
      { name: "License application", url: "#" },
      { name: "Property inventory", url: "#" }
    ],
    relatedEntities: ["Johnson Family Trust", "Coastal Holdings Inc."],
  },
  {
    id: "4",
    entityName: "Johnson Holdings LLC",
    itemType: "Registered Agent Update",
    dueDate: "2024-01-31",
    responsiblePerson: "David Kim",
    priority: "Low",
    stage: "completed",
    description: "Update registered agent information with Secretary of State",
    entityType: "Limited Liability Company",
    jurisdiction: "Nevada",
    filingFrequency: "As needed",
    lastFiled: "2022-05-20",
    requirements: "New agent details, service address, consent forms",
    estimatedCost: "$150",
    notes: "Switching from individual agent to registered agent service",
    documents: [
      { name: "Agent change form", url: "#" },
      { name: "New agent consent", url: "#" }
    ],
    relatedEntities: ["Johnson Family Trust"],
  },
  {
    id: "5",
    entityName: "Johnson Family Foundation",
    itemType: "Form 990-PF",
    dueDate: "2024-05-15",
    responsiblePerson: "Sarah Chen",
    priority: "High",
    stage: "needs-attention",
    description: "IRS annual filing for private foundations",
    entityType: "Private Foundation",
    jurisdiction: "Federal",
    filingFrequency: "Annual",
    lastFiled: "2023-05-10",
    requirements: "Financial statements, grant details, investment information",
    estimatedCost: "$2,500",
    notes: "Missing information on two grants made in December 2023",
    documents: [
      { name: "Prior year 990-PF", url: "#" },
      { name: "Foundation financial statements", url: "#" }
    ],
    relatedEntities: ["Johnson Family Trust"],
  },
]

// Default stages if no config provided
const defaultStages = [
  { id: "upcoming", name: "Upcoming", color: "bg-blue-100" },
  { id: "in-progress", name: "In Progress", color: "bg-yellow-100" },
  { id: "review", name: "Review", color: "bg-purple-100" },
  { id: "needs-attention", name: "Needs Attention", color: "bg-red-100" },
  { id: "completed", name: "Completed", color: "bg-green-100" },
]

// Default attributes for compliance items
const defaultAttributes = [
  { id: "entityName", name: "Entity Name", type: "relation" },
  { id: "itemType", name: "Item Type", type: "text" },
  { id: "dueDate", name: "Due Date", type: "date" },
  { id: "responsiblePerson", name: "Responsible Person", type: "user" },
  { id: "priority", name: "Priority", type: "text" },
  { id: "jurisdiction", name: "Jurisdiction", type: "text" },
]

interface EntityComplianceKanbanProps {
  workflowConfig?: {
    attributes: Array<{ id: string; name: string; type: string }>
    stages: Array<{ id: string; name: string; color: string }>
  }
}

function ComplianceItemCard({ item }: { item: ComplianceItem }) {
  // Define tabs for the drawer
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "contacts", label: "Contacts", count: 2, icon: UserIcon },
    { id: "emails", label: "Emails", count: 1, icon: MailIcon },
    { id: "tasks", label: "Tasks", count: 3, icon: ClipboardCheckIcon },
    { id: "notes", label: "Notes", count: 2, icon: FileTextIcon },
    { id: "files", label: "Files", count: item.documents ? item.documents.length : 0, icon: FolderIcon },
    { id: "activity", label: "Activity", count: null, icon: CalendarIcon },
  ]

  // Create details panel function
  const detailsPanel = (isFullScreen = false) => {
    // Add state for collapsible sections
    const [openSections, setOpenSections] = React.useState<{
      details: boolean;
      filing: boolean;
      entity: boolean;
      status: boolean;
    }>({
      details: true, // Details expanded by default
      filing: false,
      entity: false,
      status: false,
    });

    // Add state for showing all values
    const [showingAllValues, setShowingAllValues] = React.useState(false);

    // Toggle function for collapsible sections
    const toggleSection = (section: 'details' | 'filing' | 'entity' | 'status') => {
      setOpenSections(prev => ({
        ...prev,
        [section]: !prev[section],
      }));
    };

    // Basic fields for collapsed view
    const basicFields = [
      {
        label: "Item Type",
        value: item.itemType,
      },
      {
        label: "Entity Name",
        value: item.entityName,
      },
      {
        label: "Due Date",
        value: item.dueDate,
      },
      {
        label: "Responsible Person",
        value: item.responsiblePerson,
      },
      {
        label: "Priority",
        value: item.priority,
      },
    ] as Array<{
      label: string;
      value: React.ReactNode;
      isLink?: boolean;
    }>;

    // Extended fields for "Show all" view
    const extendedFields = [
      {
        label: "Item Type",
        value: item.itemType,
      },
      {
        label: "Entity Name",
        value: item.entityName,
        isLink: true,
      },
      {
        label: "Entity Type",
        value: item.entityType || "N/A",
      },
      {
        label: "Due Date",
        value: item.dueDate,
      },
      {
        label: "Responsible Person",
        value: item.responsiblePerson,
      },
      {
        label: "Priority",
        value: item.priority,
      },
      {
        label: "Jurisdiction",
        value: item.jurisdiction || "N/A",
      },
      {
        label: "Filing Frequency",
        value: item.filingFrequency || "N/A",
      },
      {
        label: "Last Filed",
        value: item.lastFiled || "N/A",
      },
      {
        label: "Estimated Cost",
        value: item.estimatedCost || "N/A",
      },
      {
        label: "Description",
        value: item.description || "No description available",
      },
    ] as Array<{
      label: string;
      value: React.ReactNode;
      isLink?: boolean;
    }>;

    // Mock data for related entities
    const relatedData = {
      filingInfo: [
        { id: 1, name: "Filing Type", value: item.itemType },
        { id: 2, name: "Filing Frequency", value: item.filingFrequency || "Annual" },
        { id: 3, name: "Jurisdiction", value: item.jurisdiction || "N/A" },
      ],
      entityInfo: [
        { id: 1, name: item.entityName, role: "Primary Entity" },
        ...(item.relatedEntities || []).map((entity, idx) => ({ id: idx + 2, name: entity, role: "Related Entity" })),
      ],
      statusInfo: [
        { id: 1, name: "Last Filed", value: item.lastFiled || "N/A" },
        { id: 2, name: "Estimated Cost", value: item.estimatedCost || "N/A" },
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
        title: 'Compliance Details',
        icon: FileTextIcon,
        content: renderFields(showingAllValues ? extendedFields : basicFields, !showingAllValues),
        count: null
      },
      {
        id: 'filing',
        title: 'Filing Information',
        icon: ScaleIcon,
        content: <ItemsSection items={relatedData.filingInfo} />,
        count: relatedData.filingInfo.length
      },
      {
        id: 'entity',
        title: 'Related Entities',
        icon: BuildingIcon,
        content: <ItemsSection items={relatedData.entityInfo} />,
        count: relatedData.entityInfo.length
      },
      {
        id: 'status',
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
        type: "created",
        actor: "Compliance Team",
        action: "created compliance item",
        target: item.itemType,
        timestamp: "3 months ago",
      },
      {
        id: 2,
        type: "reminder",
        actor: "System",
        action: "sent reminder for",
        target: item.itemType,
        timestamp: "2 weeks ago",
      },
      {
        id: 3,
        type: "update",
        actor: item.responsiblePerson,
        action: "updated status of",
        target: item.itemType,
        timestamp: "1 week ago",
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
                  onClick={() => toggleSection(section.id as 'details' | 'filing' | 'entity' | 'status')}
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
                      activity.type === "created" ? "bg-blue-500" : 
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
    if (activeTab === "files" && item.documents && item.documents.length > 0) {
      return (
        <div className="p-6 space-y-4">
          <h3 className="text-sm font-medium">Documents</h3>
          <div className="space-y-2">
            {item.documents.map((doc, index) => (
              <div key={index} className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                <a href={doc.url} className="text-sm text-primary hover:underline">
                  {doc.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No {activeTab} found for this compliance item</p>
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
                <h4 className="font-semibold text-sm text-gray-900 truncate cursor-pointer group-hover:underline">{item.itemType}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.entityName}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                    <MoreVerticalIcon className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Due:</span>
                <span>{item.dueDate}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <UserIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Assigned:</span>
                <span>{item.responsiblePerson}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <ScaleIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Jurisdiction:</span>
                <span>{item.jurisdiction}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Badge variant={item.priority === "High" ? "destructive" : item.priority === "Medium" ? "default" : "secondary"} className="h-5 px-2 text-xs">
                  {item.priority} Priority
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      }
      title={item.itemType}
      recordType="Compliance Items"
      subtitle={`${item.entityName} • ${item.entityType || 'Entity'}`}
      tabs={tabs}
      detailsPanel={detailsPanel}
    >
      {renderTabContent}
    </MasterDrawer>
  )
}

function SortableComplianceItemCard({ item }: { item: ComplianceItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: { type: "compliance-item", item },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-manipulation">
      <ComplianceItemCard item={item} />
    </div>
  )
}

function ComplianceItemDetails({ item, isFullScreen }: { item: ComplianceItem; isFullScreen: boolean }) {
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
            {item.itemType}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ExpandIcon className="h-4 w-4" />
            Full screen
          </Button>
          <Button variant="outline" size="sm">
            <ClipboardCheckIcon className="h-4 w-4" />
            Mark Complete
          </Button>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">{item.itemType}</h2>
          <p className="text-muted-foreground">{item.entityName} • {item.entityType}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Filing Information</h3>
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">Filing Type</Label>
                    <p className="text-sm">{item.itemType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">Entity Type</Label>
                    <p className="text-sm">{item.entityType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ScaleIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">Jurisdiction</Label>
                    <p className="text-sm">{item.jurisdiction}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">Filing Frequency</Label>
                    <p className="text-sm">{item.filingFrequency}</p>
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
                    <p className="text-sm">{item.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">Responsible Person</Label>
                    <p className="text-sm">{item.responsiblePerson}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">Last Filed</Label>
                    <p className="text-sm">{item.lastFiled}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">Estimated Cost</Label>
                    <p className="text-sm">{item.estimatedCost}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Requirements</h3>
          <p className="text-sm">{item.requirements}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Description</h3>
          <p className="text-sm">{item.description}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Notes</h3>
          <p className="text-sm">{item.notes}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Related Entities</h3>
          <div className="flex flex-wrap gap-2">
            {item.relatedEntities?.map((entity, index) => (
              <Badge key={index} variant="outline">
                {entity}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Documents</h3>
          <div className="space-y-2">
            {item.documents?.map((doc, index) => (
              <div key={index} className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                <a href={doc.url} className="text-sm text-primary hover:underline">
                  {doc.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function DroppableColumn({ stage, items }: { 
  stage: { id: string; name: string; color: string }; 
  items: ComplianceItem[] 
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
              {items.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-700">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50/50 rounded-b-xl border-l border-r border-b border-gray-200 p-3 space-y-3">
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableComplianceItemCard key={item.id} item={item} />
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

export function EntityComplianceKanban({ workflowConfig }: EntityComplianceKanbanProps) {
  const [items, setItems] = React.useState(initialComplianceItems)
  const [activeItem, setActiveItem] = React.useState<ComplianceItem | null>(null)
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
    const item = items.find((i) => i.id === activeId)
    if (item) {
      setActiveItem(item)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveItem(null)
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeComplianceItem = items.find((i) => i.id === activeId)
    if (!activeComplianceItem) return

    // Find which stage the item is being dropped on
    let targetStage = overId

    // If dropping on another item, find its stage
    if (!stagesList.some((s) => s.id === overId)) {
      const targetItem = items.find((i) => i.id === overId)
      if (targetItem) {
        targetStage = targetItem.stage
      }
    }

    // Update the item's stage if it's different
    if (activeComplianceItem.stage !== targetStage && stagesList.some((s) => s.id === targetStage)) {
      setItems(
        items.map((item) =>
          item.id === activeId ? { ...item, stage: targetStage } : item,
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

  const itemsByStage = stagesList.map((stage) => ({
    stage,
    items: items.filter((item) => item.stage === stage.id),
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
        {itemsByStage.map(({ stage, items }) => (
          <DroppableColumn key={stage.id} stage={stage} items={items} />
        ))}
        <AddColumnButton onAddColumn={() => setAddColumnDialogOpen(true)} />
      </div>
      <DragOverlay>
        {activeItem ? (
          <div className="w-80 opacity-80 shadow-lg">
            <ComplianceItemCard item={activeItem} />
          </div>
        ) : null}
      </DragOverlay>
      <AddColumnDialog open={addColumnDialogOpen} onOpenChange={setAddColumnDialogOpen} onAddColumn={handleAddColumn} />
    </DndContext>
  )
}

