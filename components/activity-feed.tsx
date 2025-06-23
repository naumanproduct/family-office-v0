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
  FileTextIcon,
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
  // 🔧 Task-related
  {
    id: 1,
    type: "task",
    objectType: "task",
    actor: "You",
    action: "created a new",
    target: "Review Q1 Fund Statement",
    url: "/tasks/1",
    timestamp: "just now",
    date: new Date().toISOString(),
  },
  {
    id: 2,
    type: "task",
    objectType: "task",
    actor: "Sarah Malik",
    action: "completed the",
    target: "Draft LP Summary for KKR Fund",
    url: "/tasks/2",
    timestamp: "5 mins ago",
    date: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    type: "task",
    objectType: "task",
    actor: "You",
    action: "updated a task deadline",
    target: "Submit Tax Estimates",
    url: "/tasks/3",
    timestamp: "30 mins ago",
    date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    type: "task",
    objectType: "task",
    actor: "Omar Ali",
    action: "commented on",
    target: "Review Subscription Docs",
    url: "/tasks/4",
    timestamp: "1 hour ago",
    date: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },

  // 💼 Investment-related
  {
    id: 5,
    type: "investment",
    objectType: "investment",
    actor: "You",
    action: "created a new",
    target: "KKR North America Fund XII",
    url: "/investments/5",
    timestamp: "2 hours ago",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    type: "investment",
    objectType: "investment",
    actor: "Jessica Liu",
    action: "updated performance data for",
    target: "Blackstone Real Estate Income Trust",
    url: "/investments/6",
    timestamp: "3 hours ago",
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    type: "investment",
    objectType: "investment",
    actor: "You",
    action: "linked a new document to investment",
    target: "Apollo Credit Opportunities",
    url: "/investments/7",
    timestamp: "4 hours ago",
    date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 8,
    type: "investment",
    objectType: "investment",
    actor: "You",
    action: "added holding to investment",
    target: "Sequoia Growth Fund IV",
    url: "/investments/8",
    timestamp: "5 hours ago",
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },

  // 👥 People & Companies
  {
    id: 9,
    type: "person",
    objectType: "contact",
    actor: "You",
    action: "added a new",
    target: "David Abrams",
    url: "/people/9",
    timestamp: "6 hours ago",
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 10,
    type: "company",
    objectType: "company",
    actor: "Amira Khan",
    action: "updated company profile",
    target: "Silver Lake Partners",
    url: "/companies/10",
    timestamp: "7 hours ago",
    date: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 11,
    type: "relationship",
    objectType: "relationship",
    actor: "You",
    action: "added relationship",
    target: "David Abrams",
    url: "/people/9",
    timestamp: "8 hours ago",
    date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 12,
    type: "person",
    objectType: "person",
    actor: "You",
    action: "changed role for",
    target: "Tina Zhang",
    url: "/people/12",
    timestamp: "9 hours ago",
    date: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
  },

  // 🏢 Entity-related
  {
    id: 13,
    type: "entity",
    objectType: "entity",
    actor: "You",
    action: "created a new",
    target: "Ahmed Family Trust",
    url: "/entities/13",
    timestamp: "1 day ago",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 14,
    type: "entity",
    objectType: "entity",
    actor: "You",
    action: "updated ownership structure for",
    target: "Blue Horizon Holdings LLC",
    url: "/entities/14",
    timestamp: "2 days ago",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 15,
    type: "entity",
    objectType: "entity",
    actor: "Nauman Ahmed",
    action: "uploaded trust agreement to",
    target: "Sunset LP",
    url: "/entities/15",
    timestamp: "3 days ago",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 16,
    type: "entity",
    objectType: "entity",
    actor: "You",
    action: "added UBO mapping",
    target: "Crescent Fund SPV",
    url: "/entities/16",
    timestamp: "4 days ago",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // 📈 Opportunity (Deals)
  {
    id: 17,
    type: "opportunity",
    objectType: "opportunity",
    actor: "You",
    action: "created a new",
    target: "Carta Secondary Round",
    url: "/opportunities/17",
    timestamp: "5 days ago",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 18,
    type: "opportunity",
    objectType: "opportunity",
    actor: "You",
    action: "moved opportunity",
    target: "Anduril Series D",
    url: "/opportunities/18",
    timestamp: "6 days ago",
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 19,
    type: "opportunity",
    objectType: "opportunity",
    actor: "James Patel",
    action: "linked note to opportunity",
    target: "Databricks Crossover Investment",
    url: "/opportunities/19",
    timestamp: "7 days ago",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 20,
    type: "opportunity",
    objectType: "opportunity",
    actor: "You",
    action: "added co-investor to opportunity",
    target: "Bain Fund XIII",
    url: "/opportunities/20",
    timestamp: "8 days ago",
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // 📄 File & Note-related
  {
    id: 21,
    type: "file",
    objectType: "file",
    actor: "You",
    action: "uploaded a new file",
    target: "KKR Fund XII – March 2024 Performance.pdf",
    url: "/documents/21",
    timestamp: "9 days ago",
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 22,
    type: "file",
    objectType: "file",
    actor: "You",
    action: "deleted a file",
    target: "Old Capital Call Schedule.xlsx",
    url: "/documents/22",
    timestamp: "10 days ago",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 23,
    type: "note",
    objectType: "note",
    actor: "You",
    action: "created a note",
    target: "Liquidity Planning Notes – July 2025",
    url: "/notes/23",
    timestamp: "11 days ago",
    date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 24,
    type: "note",
    objectType: "note",
    actor: "Naiel",
    action: "linked note to",
    target: "Ahmed Family Office Master Entity",
    url: "/notes/24",
    timestamp: "12 days ago",
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // �� Cross-object / Relational
  {
    id: 25,
    type: "link",
    objectType: "task",
    actor: "You",
    action: "linked task",
    target: "Finalize Tax Docs",
    url: "/tasks/25",
    timestamp: "13 days ago",
    date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 26,
    type: "link",
    objectType: "investment",
    actor: "You",
    action: "associated investment",
    target: "Benchmark Fund VII",
    url: "/investments/26",
    timestamp: "14 days ago",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 27,
    type: "link",
    objectType: "file",
    actor: "Sarah Malik",
    action: "shared file",
    target: "Q2 2025 Capital Account Statement",
    url: "/documents/27",
    timestamp: "15 days ago",
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 28,
    type: "link",
    objectType: "person",
    actor: "You",
    action: "linked person",
    target: "Jane Monroe",
    url: "/people/28",
    timestamp: "16 days ago",
    date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const activityTypes = [
  { id: "all", label: "All Activity", icon: RefreshCwIcon },
  { id: "task", label: "Tasks", icon: FileTextIcon },
  { id: "investment", label: "Investments", icon: TrendingUpIcon },
  { id: "person", label: "People", icon: UsersIcon },
  { id: "company", label: "Companies", icon: BuildingIcon },
  { id: "entity", label: "Entities", icon: BuildingIcon },
  { id: "opportunity", label: "Opportunities", icon: TargetIcon },
  { id: "file", label: "Files", icon: FileTextIcon },
  { id: "note", label: "Notes", icon: FileTextIcon },
  { id: "relationship", label: "Relationships", icon: UsersIcon },
  { id: "link", label: "Cross-Object", icon: TargetIcon },
]

// Unique list of actors – derived from activities so examples stay in sync
const actorOptions = Array.from(new Set(mockActivities.map((a) => a.actor)))

export function ActivityFeed() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>(["all"])
  const [selectedActors, setSelectedActors] = React.useState<string[]>(["all"])
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

    // Filter by actor
    if (!selectedActors.includes("all")) {
      filtered = filtered.filter((activity) => selectedActors.includes(activity.actor))
    }

    // Filter by time
    if (timeFilter !== "all") {
      const now = new Date()

      switch (timeFilter) {
        case "today":
          filtered = filtered.filter((activity) => {
            const activityDate = new Date(activity.date ?? 0)
            return activityDate.toDateString() === now.toDateString()
          })
          break
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter((activity) => {
            const activityDate = new Date(activity.date ?? 0)
            return activityDate >= weekAgo
          })
          break
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter((activity) => {
            const activityDate = new Date(activity.date ?? 0)
            return activityDate >= monthAgo
          })
          break
      }
    }

    return filtered
  }, [searchQuery, selectedTypes, selectedActors, timeFilter, mockActivities])

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
      const activityDate = new Date(activity.date ?? 0)
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

  const handleActorToggle = (actor: string) => {
    if (actor === "all") {
      setSelectedActors(["all"])
    } else {
      setSelectedActors((prev) => {
        const newActors = prev.filter((a) => a !== "all")
        if (newActors.includes(actor)) {
          const filtered = newActors.filter((a) => a !== actor)
          return filtered.length === 0 ? ["all"] : filtered
        } else {
          return [...newActors, actor]
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

          {/* Actor Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <UsersIcon className="h-4 w-4 mr-2" />
                Actors
                {selectedActors.length > 0 && !selectedActors.includes("all") && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedActors.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Actors</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                key="allActors"
                checked={selectedActors.includes("all")}
                onCheckedChange={() => handleActorToggle("all")}
              >
                All Actors
              </DropdownMenuCheckboxItem>
              {actorOptions.map((actor) => (
                <DropdownMenuCheckboxItem
                  key={actor}
                  checked={selectedActors.includes(actor)}
                  onCheckedChange={() => handleActorToggle(actor)}
                >
                  {actor}
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
                    setSelectedActors(["all"])
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
