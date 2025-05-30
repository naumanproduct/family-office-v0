"use client"
import {
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
} from "lucide-react"
import { Label } from "@/components/ui/label"

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

const stages = [
  { id: "awareness", title: "Awareness", color: "bg-gray-100" },
  { id: "initial-contact", title: "Initial Contact", color: "bg-blue-100" },
  { id: "work-in-progress", title: "Work in Progress", color: "bg-yellow-100" },
  { id: "term-sheet", title: "Term Sheet", color: "bg-purple-100" },
  { id: "due-diligence", title: "Due Diligence", color: "bg-orange-100" },
  { id: "invested", title: "Invested", color: "bg-green-100" },
  { id: "passed", title: "Passed", color: "bg-red-100" },
]

// Separate the card UI from the sortable wrapper
function DealCard({ deal }: { deal: Deal }) {
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
  const detailsPanel = (isFullScreen = false) => (
    <div className="p-6">
      {/* Deal Details */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Opportunity Details</h4>

        <div className="rounded-lg border border-muted bg-muted/10 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Company</Label>
                  <p className="text-sm font-medium">{deal.companyName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Funding Round</Label>
                  <p className="text-sm">{deal.fundingRound}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Target Raise</Label>
                  <p className="text-sm">{deal.targetRaise}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Deal Owner</Label>
                  <p className="text-sm">{deal.owner}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Location</Label>
                  <p className="text-sm">{deal.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Stage</Label>
                  <p className="text-sm">{opportunityStage}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm text-blue-600">{deal.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Last Contact</Label>
                  <p className="text-sm">{deal.lastContact}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Next Meeting</Label>
                  <p className="text-sm">{deal.nextMeeting}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Valuation</Label>
                  <p className="text-sm">{deal.valuation || "TBD"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-start gap-2">
              <FileTextIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <p className="text-sm">{deal.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Create children function for tabs
  const renderTabContent = (
    activeTab: string,
    viewMode: "card" | "list" | "table",
    setSelectedTask?: (task:\
