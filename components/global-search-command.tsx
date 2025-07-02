"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  HomeIcon,
  TrendingUpIcon,
  Building2Icon,
  TargetIcon,
  CheckCircleIcon,
  FileTextIcon,
  FileIcon,
  BuildingIcon,
  UsersIcon,
  GanttChartIcon,
  DollarSignIcon,
  ArrowUpCircleIcon,
  CalendarIcon,
  BarChartIcon,
  ReceiptIcon,
  WalletIcon,
  RocketIcon,
  SearchIcon,
  MailIcon,
  ActivityIcon,
  LayoutIcon,
  CreditCardIcon,
  MinusCircleIcon,
} from "lucide-react"

interface GlobalSearchCommandProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Navigation items
const mainNavItems = [
  { title: "Home", url: "/", icon: HomeIcon, group: "Main" },
  { title: "Investments", url: "/investments", icon: TrendingUpIcon, group: "Main" },
  { title: "Entities", url: "/entities", icon: Building2Icon, group: "Main" },
  { title: "Opportunities", url: "/opportunities", icon: TargetIcon, group: "Main" },
  { title: "Tasks", url: "/tasks", icon: CheckCircleIcon, group: "Main" },
  { title: "Files", url: "/documents", icon: FileTextIcon, group: "Main" },
  { title: "Notes", url: "/notes", icon: FileIcon, group: "Main" },
  { title: "Companies", url: "/companies", icon: BuildingIcon, group: "Partners" },
  { title: "People", url: "/people", icon: UsersIcon, group: "Partners" },
  { title: "Emails", url: "/emails", icon: MailIcon, group: "Communication" },
  { title: "Activity", url: "/activity", icon: ActivityIcon, group: "Main" },
]

// Workflow items
const workflowItems = [
  { title: "Deal Pipeline", url: "/deal-pipeline", icon: GanttChartIcon },
  { title: "Capital Calls", url: "/capital-calls", icon: DollarSignIcon },
  { title: "Distributions Tracking", url: "/distributions-tracking", icon: ArrowUpCircleIcon },
  { title: "Meeting Preparation", url: "/meeting-preparation", icon: CalendarIcon },
  { title: "Quarterly Monitoring", url: "/quarterly-monitoring", icon: BarChartIcon },
  { title: "K-1 Review & Tax Docs", url: "/k1-review", icon: ReceiptIcon },
  { title: "Cash Forecasting", url: "/cash-forecasting", icon: WalletIcon },
  { title: "Investment Onboarding", url: "/investment-onboarding", icon: RocketIcon },
]

// Mock record data - In a real app, this would come from an API
const mockRecords = {
  companies: [
    { id: 1, name: "TechFlow Inc.", type: "company", url: "/companies/1" },
    { id: 2, name: "Meridian Capital", type: "company", url: "/companies/2" },
    { id: 3, name: "Blackstone Group", type: "company", url: "/companies/3" },
  ],
  people: [
    { id: 1, name: "Sarah Johnson", type: "person", role: "CEO", url: "/people/1" },
    { id: 2, name: "Michael Chen", type: "person", role: "CFO", url: "/people/2" },
    { id: 3, name: "Jessica Martinez", type: "person", role: "Partner", url: "/people/3" },
  ],
  investments: [
    { id: 1, name: "Series B - TechFlow", type: "investment", url: "/investments/1" },
    { id: 2, name: "Real Estate Fund III", type: "investment", url: "/investments/2" },
    { id: 3, name: "Growth Equity Fund", type: "investment", url: "/investments/3" },
  ],
  entities: [
    { id: 1, name: "Gekko Family Trust", type: "entity", url: "/entities/1" },
    { id: 2, name: "Gekko Holdings LLC", type: "entity", url: "/entities/2" },
    { id: 3, name: "Offshore Holdings Ltd.", type: "entity", url: "/entities/3" },
  ],
  opportunities: [
    { id: 1, name: "Databricks Series H", type: "opportunity", url: "/opportunities/1" },
    { id: 2, name: "SpaceX Secondary", type: "opportunity", url: "/opportunities/2" },
    { id: 3, name: "Stripe Late Stage", type: "opportunity", url: "/opportunities/3" },
  ],
  tasks: [
    { id: 1, name: "Review Q1 Financial Statements", type: "task", url: "/tasks/1" },
    { id: 2, name: "Approve Capital Call Notice", type: "task", url: "/tasks/2" },
    { id: 3, name: "Complete Due Diligence Report", type: "task", url: "/tasks/3" },
  ],
  notes: [
    { id: 1, name: "Investment Committee Meeting Notes", type: "note", url: "/notes/1" },
    { id: 2, name: "Due Diligence Checklist", type: "note", url: "/notes/2" },
    { id: 3, name: "Portfolio Performance Analysis", type: "note", url: "/notes/3" },
  ],
  files: [
    { id: 1, name: "Q1 2024 Report.pdf", type: "file", url: "/documents/1" },
    { id: 2, name: "Investment Agreement.docx", type: "file", url: "/documents/2" },
    { id: 3, name: "Cap Table.xlsx", type: "file", url: "/documents/3" },
  ],
}

export function GlobalSearchCommand({ open, onOpenChange }: GlobalSearchCommandProps) {
  const router = useRouter()
  const [search, setSearch] = React.useState("")

  // Filter records based on search
  const filteredRecords = React.useMemo(() => {
    if (!search) return []
    
    const searchLower = search.toLowerCase()
    const results: any[] = []
    
    // Search through all record types
    Object.entries(mockRecords).forEach(([type, records]) => {
      records.forEach((record) => {
        if (
          record.name.toLowerCase().includes(searchLower) ||
          ((record as any).role && (record as any).role.toLowerCase().includes(searchLower))
        ) {
          results.push(record)
        }
      })
    })
    
    return results.slice(0, 10) // Limit to 10 results
  }, [search])

  const handleSelect = (url: string) => {
    router.push(url)
    onOpenChange(false)
    setSearch("")
  }

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "company":
        return BuildingIcon
      case "person":
        return UsersIcon
      case "investment":
        return TrendingUpIcon
      case "entity":
        return Building2Icon
      case "opportunity":
        return TargetIcon
      case "task":
        return CheckCircleIcon
      case "note":
        return FileIcon
      case "file":
        return FileTextIcon
      default:
        return FileIcon
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search for anything..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {/* Search Results */}
        {search && filteredRecords.length > 0 && (
          <>
            <CommandGroup heading="Search Results">
              {filteredRecords.map((record) => {
                const Icon = getRecordIcon(record.type)
                return (
                  <CommandItem
                    key={`${record.type}-${record.id}`}
                    onSelect={() => handleSelect(record.url)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{record.name}</span>
                    {record.role && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        {record.role}
                      </span>
                    )}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {record.type}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}
        
        {/* Navigation */}
        <CommandGroup heading="Navigate">
          {mainNavItems.map((item) => (
            <CommandItem
              key={item.url}
              onSelect={() => handleSelect(item.url)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        
        <CommandSeparator />
        
        {/* Workflows */}
        <CommandGroup heading="Workflows">
          {workflowItems.map((item) => (
            <CommandItem
              key={item.url}
              onSelect={() => handleSelect(item.url)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
} 