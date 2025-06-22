"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UnifiedActivitySection, type ActivityItem } from "@/components/shared/unified-activity-section"
import {
  SearchIcon,
  FilterIcon,
  TrendingUpIcon,
  UsersIcon,
  CalendarIcon,
  FileTextIcon,
  DollarSignIcon,
  BuildingIcon,
  TargetIcon,
  RefreshCwIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data - in real app this would come from API
const mockActivities: ActivityItem[] = [
  {
    id: 1,
    type: "investment",
    actor: "Portfolio Team",
    action: "completed investment in",
    target: "TechCorp Series B",
    timestamp: "2 hours ago",
    date: "2025-01-22",
    details: {
      amount: "$2.5M",
      investmentType: "Series B",
      sector: "Technology",
      geography: "North America",
      approvalDate: "2025-01-20",
      fundingDate: "2025-01-22",
    },
  },
  {
    id: 2,
    type: "distribution",
    actor: "Fund Operations",
    action: "processed distribution from",
    target: "Growth Fund III",
    timestamp: "4 hours ago",
    date: "2025-01-22",
    details: {
      amount: "$1.2M",
      type: "Quarterly Distribution",
      perShare: "$0.45",
      totalShares: "2,666,667",
      paymentDate: "2025-01-25",
    },
  },
  {
    id: 3,
    type: "meeting",
    actor: "Investment Committee",
    action: "completed meeting",
    target: "Q1 Portfolio Review",
    timestamp: "6 hours ago",
    date: "2025-01-22",
    details: {
      type: "Investment Committee",
      duration: "2 hours",
      topics: ["Portfolio Performance", "New Deal Pipeline", "Risk Assessment", "Market Outlook"],
      outcome: "Approved 3 new investments, increased allocation to tech sector",
      nextSteps: "Schedule due diligence for approved deals",
    },
  },
  {
    id: 4,
    type: "status_change",
    actor: "Deal Team",
    action: "moved deal",
    target: "HealthTech Acquisition",
    timestamp: "8 hours ago",
    date: "2025-01-22",
    details: {
      previousStatus: "Due Diligence",
      newStatus: "Term Sheet",
      reason: "Completed financial and legal review",
      nextSteps: ["Finalize term sheet", "Board approval", "Legal documentation"],
    },
  },
  {
    id: 5,
    type: "creation",
    actor: "System",
    action: "created new entity",
    target: "TechVentures Holdings LLC",
    timestamp: "1 day ago",
    date: "2025-01-21",
    details: {
      entityType: "LLC",
      jurisdiction: "Delaware",
      purpose: "Investment holding company",
      registrationDate: "2025-01-21",
    },
  },
  {
    id: 6,
    type: "comment",
    actor: "Sarah Johnson",
    action: "added comment to",
    target: "Q4 Tax Planning",
    timestamp: "1 day ago",
    date: "2025-01-21",
    content:
      "Updated tax projections based on recent distributions. We're on track to optimize our tax position for Q4.",
  },
  {
    id: 7,
    type: "funding",
    actor: "Capital Markets",
    action: "received capital call for",
    target: "Infrastructure Fund II",
    timestamp: "2 days ago",
    date: "2025-01-20",
    details: {
      amount: "$5M",
      callNumber: "Call #3",
      dueDate: "2025-02-15",
      purpose: "Bridge Infrastructure Project",
    },
  },
  {
    id: 8,
    type: "partnership",
    actor: "Business Development",
    action: "signed partnership agreement with",
    target: "Global Asset Management",
    timestamp: "3 days ago",
    date: "2025-01-19",
    details: {
      partnershipType: "Strategic Alliance",
      focusArea: "Emerging Markets",
      duration: "3 years",
      expectedValue: "$50M AUM",
    },
  },
]

const activityTypes = [
  { id: "all", label: "All Activity", icon: RefreshCwIcon },
  { id: "investment", label: "Investments", icon: TrendingUpIcon },
  { id: "distribution", label: "Distributions", icon: DollarSignIcon },
  { id: "meeting", label: "Meetings", icon: CalendarIcon },
  { id: "status_change", label: "Deal Updates", icon: TargetIcon },
  { id: "creation", label: "New Entities", icon: BuildingIcon },
  { id: "comment", label: "Comments", icon: FileTextIcon },
  { id: "funding", label: "Capital Calls", icon: DollarSignIcon },
  { id: "partnership", label: "Partnerships", icon: UsersIcon },
]

export function ActivityFeed() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>(["all"])
  const [timeFilter, setTimeFilter] = React.useState("all")

  // Filter activities based on search and filters
  const filteredActivities = React.useMemo(() => {
    let filtered = mockActivities

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (activity) =>
          activity.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.action.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by activity types
    if (!selectedTypes.includes("all")) {
      filtered = filtered.filter((activity) => selectedTypes.includes(activity.type))
    }

    // Filter by time
    if (timeFilter !== "all") {
      const now = new Date()

      switch (timeFilter) {
        case "today":
          filtered = filtered.filter((activity) => {
            const activityDate = new Date(activity.date)
            return activityDate.toDateString() === now.toDateString()
          })
          break
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter((activity) => {
            const activityDate = new Date(activity.date)
            return activityDate >= weekAgo
          })
          break
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter((activity) => {
            const activityDate = new Date(activity.date)
            return activityDate >= monthAgo
          })
          break
      }
    }

    return filtered
  }, [searchQuery, selectedTypes, timeFilter, mockActivities])

  // Group activities by time periods
  const groupedActivities = React.useMemo(() => {
    const groups: Record<string, ActivityItem[]> = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    }

    const now = new Date()
    const today = now.toDateString()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    filteredActivities.forEach((activity) => {
      const activityDate = new Date(activity.date)
      const activityDateString = activityDate.toDateString()

      if (activityDateString === today) {
        groups.today.push(activity)
      } else if (activityDateString === yesterday) {
        groups.yesterday.push(activity)
      } else if (activityDate >= weekAgo) {
        groups.thisWeek.push(activity)
      } else {
        groups.older.push(activity)
      }
    })

    return groups
  }, [filteredActivities])

  const handleTypeToggle = (typeId: string) => {
    if (typeId === "all") {
      setSelectedTypes(["all"])
    } else {
      setSelectedTypes((prev) => {
        const newTypes = prev.filter((t) => t !== "all")
        if (newTypes.includes(typeId)) {
          const filtered = newTypes.filter((t) => t !== typeId)
          return filtered.length === 0 ? ["all"] : filtered
        } else {
          return [...newTypes, typeId]
        }
      })
    }
  }

  const getActivityStats = () => {
    const stats = activityTypes.slice(1).map((type) => ({
      ...type,
      count: mockActivities.filter((a) => a.type === type.id).length,
    }))
    return stats
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {getActivityStats().map((stat) => (
          <Card key={stat.id} className="p-3">
            <div className="flex items-center space-x-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stat.count}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          {/* Activity Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FilterIcon className="h-4 w-4 mr-2" />
                Types
                {selectedTypes.length > 0 && !selectedTypes.includes("all") && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedTypes.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Activity Types</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {activityTypes.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type.id}
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={() => handleTypeToggle(type.id)}
                >
                  <type.icon className="h-4 w-4 mr-2" />
                  {type.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Time Filter */}
          <Tabs value={timeFilter} onValueChange={setTimeFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-8">
        {Object.entries(groupedActivities).map(([period, activities]) => {
          if (activities.length === 0) return null

          const periodLabels = {
            today: "Today",
            yesterday: "Yesterday",
            thisWeek: "This Week",
            older: "Older",
          }

          return (
            <div key={period} className="space-y-4">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">{periodLabels[period as keyof typeof periodLabels]}</h3>
                <div className="flex-1 h-px bg-border"></div>
                <Badge variant="outline">{activities.length} activities</Badge>
              </div>

              <Card>
                <CardContent className="p-6">
                  <UnifiedActivitySection activities={activities} />
                </CardContent>
              </Card>
            </div>
          )
        })}

        {filteredActivities.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <SearchIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No activities found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters to see more results.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedTypes(["all"])
                    setTimeFilter("all")
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
