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
  DollarSignIcon,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  TrendingUpIcon,
  FileTextIcon,
  UsersIcon,
  CheckCircleIcon,
  FolderIcon,
  MailIcon,
  BuildingIcon,
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
import { MasterDrawer } from "./master-drawer"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface Deal {
  id: string
  companyName: string
  sector: string
  fundingRound: string
  targetRaise: string
  owner: string
  stage: string
  // Additional fields for detailed view
  description?: string
  location?: string
  website?: string
  phone?: string
  email?: string
  lastContact?: string
  nextMeeting?: string
  valuation?: string
  revenue?: string
  employees?: string
}

const initialDeals: Deal[] = [
  {
    id: "1",
    companyName: "TechFlow Solutions",
    sector: "SaaS",
    fundingRound: "Series A",
    targetRaise: "$5M",
    owner: "Sarah Chen",
    stage: "awareness",
    description: "AI-powered workflow automation platform for enterprise clients",
    location: "San Francisco, CA",
    website: "techflow.com",
    phone: "+1 (555) 123-4567",
    email: "contact@techflow.com",
    lastContact: "2024-01-15",
    nextMeeting: "2024-01-22",
    valuation: "$20M",
    revenue: "$2M ARR",
    employees: "45",
  },
  {
    id: "2",
    companyName: "GreenEnergy Corp",
    sector: "CleanTech",
    fundingRound: "Seed",
    targetRaise: "$2M",
    owner: "Mike Rodriguez",
    stage: "initial-contact",
    description: "Solar panel efficiency optimization using machine learning",
    location: "Austin, TX",
    website: "greenenergy.com",
    phone: "+1 (555) 234-5678",
    email: "info@greenenergy.com",
    lastContact: "2024-01-18",
    nextMeeting: "2024-01-25",
    valuation: "$8M",
    revenue: "$500K ARR",
    employees: "12",
  },
  {
    id: "3",
    companyName: "HealthTech Innovations",
    sector: "HealthTech",
    fundingRound: "Series B",
    targetRaise: "$15M",
    owner: "Lisa Wang",
    stage: "work-in-progress",
    description: "Telemedicine platform with AI-powered diagnostics",
    location: "Boston, MA",
    website: "healthtech.com",
    phone: "+1 (555) 345-6789",
    email: "hello@healthtech.com",
    lastContact: "2024-01-20",
    nextMeeting: "2024-01-28",
    valuation: "$60M",
    revenue: "$8M ARR",
    employees: "120",
  },
  {
    id: "4",
    companyName: "FinanceAI",
    sector: "FinTech",
    fundingRound: "Series A",
    targetRaise: "$8M",
    owner: "David Kim",
    stage: "term-sheet",
    description: "AI-powered personal finance management and investment advice",
    location: "New York, NY",
    website: "financeai.com",
    phone: "+1 (555) 456-7890",
    email: "team@financeai.com",
    lastContact: "2024-01-22",
    nextMeeting: "2024-01-30",
    valuation: "$35M",
    revenue: "$3.5M ARR",
    employees: "65",
  },
]

interface DealPipelineKanbanProps {
  workflowConfig?: {
    attributes: Array<{ id: string; name: string; type: string }>
    stages: Array<{ id: string; name: string; color: string }>
  }
}

// Default stages if no config provided
const defaultStages = [
  { id: "awareness", name: "Awareness", color: "bg-gray-100" },
  { id: "initial-contact", name: "Initial Contact", color: "bg-blue-100" },
  { id: "work-in-progress", name: "Work in Progress", color: "bg-yellow-100" },
  { id: "term-sheet", name: "Term Sheet", color: "bg-purple-100" },
  { id: "due-diligence", name: "Due Diligence", color: "bg-orange-100" },
  { id: "invested", name: "Invested", color: "bg-green-100" },
  { id: "passed", name: "Passed", color: "bg-red-100" },
]

// Default attributes if no config provided
const defaultAttributes = [
  { id: "companyName", name: "Company", type: "text" },
  { id: "fundingRound", name: "Funding Round", type: "text" },
  { id: "targetRaise", name: "Target Raise", type: "currency" },
  { id: "owner", name: "Owner", type: "user" },
  { id: "nextMeeting", name: "Next Meeting", type: "date" },
]

// Separate the card UI from the sortable wrapper
function DealCard({
  deal,
  attributes = defaultAttributes,
}: {
  deal: Deal
  attributes?: Array<{ id: string; name: string; type: string }>
}) {
  // Map stage to opportunity stage
  const opportunityStage =
    deal.stage === "awareness"
      ? "Initial Contact"
      : deal.stage === "initial-contact"
        ? "Proposal"
        : deal.stage === "work-in-progress"
          ? "Due Diligence"
          : deal.stage === "term-sheet"
            ? "Term Sheet"
            : deal.stage === "due-diligence"
              ? "Due Diligence"
              : deal.stage === "invested"
                ? "Closed Won"
                : deal.stage === "passed"
                  ? "Closed Lost"
                  : "Initial Contact"

  // Create opportunity title
  const opportunityTitle = `${deal.fundingRound} Investment - ${deal.companyName}`

  // Create opportunity subtitle
  const opportunitySubtitle = `${deal.sector} • ${opportunityStage}`

  // Define tabs for the drawer
  const tabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "contacts", label: "Contacts", count: 3, icon: UsersIcon },
    { id: "emails", label: "Emails", count: 5, icon: MailIcon },
    { id: "tasks", label: "Tasks", count: 2, icon: CheckCircleIcon },
    { id: "notes", label: "Notes", count: 4, icon: FileTextIcon },
    { id: "meetings", label: "Meetings", count: 2, icon: CalendarIcon },
    { id: "files", label: "Files", count: 7, icon: FolderIcon },
    { id: "activity", label: "Activity", count: null, icon: CalendarIcon },
  ]

  // Create details panel function
  const detailsPanel = (isFullScreen = false) => {
    // Add state for collapsible sections
    const [openSections, setOpenSections] = React.useState<{
      details: boolean;
      company: boolean;
      contacts: boolean;
      financials: boolean;
    }>({
      details: true, // Details expanded by default
      company: false,
      contacts: false,
      financials: false,
    });

    // Add state for showing all values
    const [showingAllValues, setShowingAllValues] = React.useState(false);

    // Toggle function for collapsible sections
    const toggleSection = (section: 'details' | 'company' | 'contacts' | 'financials') => {
      setOpenSections(prev => ({
        ...prev,
        [section]: !prev[section],
      }));
    };

    // Basic fields for collapsed view
    const basicFields = [
      {
        label: "Company Name",
        value: deal.companyName,
      },
      {
        label: "Funding Round",
        value: deal.fundingRound,
      },
      {
        label: "Target Raise",
        value: deal.targetRaise,
      },
      {
        label: "Deal Owner",
        value: deal.owner,
      },
      {
        label: "Stage",
        value: opportunityStage,
      },
    ] as Array<{
      label: string;
      value: React.ReactNode;
      isLink?: boolean;
    }>;

    // Extended fields for "Show all" view
    const extendedFields = [
      {
        label: "Company Name",
        value: deal.companyName,
      },
      {
        label: "Sector",
        value: deal.sector,
      },
      {
        label: "Funding Round",
        value: deal.fundingRound,
      },
      {
        label: "Target Raise",
        value: deal.targetRaise,
      },
      {
        label: "Deal Owner",
        value: deal.owner,
      },
      {
        label: "Stage",
        value: opportunityStage,
      },
      {
        label: "Location",
        value: deal.location || "N/A",
      },
      {
        label: "Email",
        value: deal.email || "N/A",
        isLink: true,
      },
      {
        label: "Last Contact",
        value: deal.lastContact || "N/A",
      },
      {
        label: "Next Meeting",
        value: deal.nextMeeting || "N/A",
      },
      {
        label: "Valuation",
        value: deal.valuation || "TBD",
      },
      {
        label: "Revenue",
        value: deal.revenue || "N/A",
      },
      {
        label: "Employees",
        value: deal.employees || "N/A",
      },
      {
        label: "Description",
        value: deal.description || "No description available",
      },
    ] as Array<{
      label: string;
      value: React.ReactNode;
      isLink?: boolean;
    }>;

    // Mock data for related entities
    const relatedData = {
      contacts: [
        { id: 1, name: "Sarah Johnson", role: "CEO" },
        { id: 2, name: "Michael Chen", role: "CFO" },
      ],
      companyInfo: [
        { id: 1, name: "Website", value: deal.website || "N/A", isLink: true },
        { id: 2, name: "Phone", value: deal.phone || "N/A" },
      ],
      financials: [
        { id: 1, name: "Valuation", value: deal.valuation || "TBD" },
        { id: 2, name: "Revenue", value: deal.revenue || "N/A" },
        { id: 3, name: "Employees", value: deal.employees || "N/A" },
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
        title: 'Deal Details',
        icon: FileTextIcon,
        content: renderFields(showingAllValues ? extendedFields : basicFields, !showingAllValues),
        count: null
      },
      {
        id: 'company',
        title: 'Company Information',
        icon: BuildingIcon,
        content: <ItemsSection items={relatedData.companyInfo} />,
        count: relatedData.companyInfo.length
      },
      {
        id: 'contacts',
        title: 'Contacts',
        icon: UsersIcon,
        content: <ItemsSection items={relatedData.contacts} />,
        count: relatedData.contacts.length
      },
      {
        id: 'financials',
        title: 'Financials',
        icon: DollarSignIcon,
        content: <ItemsSection items={relatedData.financials} />,
        count: relatedData.financials.length
      },
    ];

    // Mock activity data
    const activities = [
      {
        id: 1,
        type: "meeting",
        actor: "Deal Team",
        action: "had a meeting with",
        target: deal.companyName,
        timestamp: "2 days ago",
      },
      {
        id: 2,
        type: "update",
        actor: "Financial Analyst",
        action: "updated valuation for",
        target: deal.companyName,
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
                  onClick={() => toggleSection(section.id as 'details' | 'company' | 'contacts' | 'financials')}
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
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
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
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No {activeTab} found for this opportunity</p>
        <p className="text-sm">Add some {activeTab} to get started</p>
      </div>
    )
  }

  // Function to get the appropriate icon for each attribute type
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

  // Function to render attribute value based on type
  const renderAttributeValue = (attribute: any, value: any) => {
    if (!value) return "—"

    switch (attribute.type) {
      case "currency":
        return (
          <span
            className="font-medium outline-none hover:bg-primary/10 rounded-sm px-0.5 cursor-text transition-colors"
            contentEditable
            suppressContentEditableWarning
          >
            {value}
          </span>
        )
      default:
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
                  {deal.companyName}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{deal.sector}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                    <MoreVerticalIcon className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
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
                const Icon = getAttributeIcon(attribute.type)
                const value = (deal as any)[attribute.id]

                if (!value) return null

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
      title={opportunityTitle}
      recordType="Opportunity"
      subtitle={opportunitySubtitle}
      tabs={tabs}
      children={renderTabContent}
      detailsPanel={detailsPanel}
      onComposeEmail={() => {}}
    />
  )
}

function SortableDealCard({
  deal,
  attributes,
}: {
  deal: Deal
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
    id: deal.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style} {...dndAttributes} {...listeners} className="touch-manipulation">
      <DealCard deal={deal} attributes={attributes} />
    </div>
  )
}

function DroppableColumn({
  stage,
  deals,
  attributes,
}: {
  stage: { id: string; name: string; color: string }
  deals: Deal[]
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
            <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs bg-white/80 text-gray-700">
              {deals.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-700">
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50/50 rounded-b-xl border-l border-r border-b border-gray-200 p-3 space-y-3">
        <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map((deal) => (
            <SortableDealCard key={deal.id} deal={deal} attributes={attributes} />
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

export function DealPipelineKanban({ workflowConfig }: DealPipelineKanbanProps) {
  const [deals, setDeals] = React.useState(initialDeals)
  const [activeDeal, setActiveDeal] = React.useState<Deal | null>(null)
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
    const deal = deals.find((d) => d.id === activeId)
    if (deal) {
      setActiveDeal(deal)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDeal(null)
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeDeal = deals.find((d) => d.id === activeId)
    if (!activeDeal) return

    // Find which stage the item is being dropped on
    let targetStage = overId

    // If dropping on another deal, find its stage
    if (!stagesList.some((s) => s.id === overId)) {
      const targetDeal = deals.find((d) => d.id === overId)
      if (targetDeal) {
        targetStage = targetDeal.stage
      }
    }

    // Update the deal's stage if it's different
    if (activeDeal.stage !== targetStage && stagesList.some((s) => s.id === targetStage)) {
      setDeals(deals.map((deal) => (deal.id === activeId ? { ...deal, stage: targetStage } : deal)))
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

  const dealsByStage = stagesList.map((stage) => ({
    stage,
    deals: deals.filter((deal) => deal.stage === stage.id),
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
        {dealsByStage.map(({ stage, deals }) => (
          <DroppableColumn key={stage.id} stage={stage} deals={deals} attributes={attributes} />
        ))}
        <AddColumnButton onAddColumn={() => setAddColumnDialogOpen(true)} />
      </div>
      <DragOverlay>
        {activeDeal ? (
          <div className="w-80 opacity-80 shadow-lg">
            <DealCard deal={activeDeal} attributes={attributes} />
          </div>
        ) : null}
      </DragOverlay>
      <AddColumnDialog open={addColumnDialogOpen} onOpenChange={setAddColumnDialogOpen} onAddColumn={handleAddColumn} />
    </DndContext>
  )
}
