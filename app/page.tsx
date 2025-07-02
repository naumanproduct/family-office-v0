"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  PlusIcon,
  FileTextIcon,
  ClipboardCheckIcon,
  UploadIcon,
  TrendingUpIcon,
  ActivityIcon,
  ChevronDownIcon,
} from "lucide-react"
import { UnifiedActivitySection, type ActivityItem } from "@/components/shared/unified-activity-section"
import Link from "next/link"

// Generate global activity data
const generateGlobalActivities = (): ActivityItem[] => {
  const now = new Date()
  const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString()
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString()
  
  return [
    {
      id: 1,
      type: "task_create",
      objectType: "task",
      actor: "You",
      action: "created a new",
      target: "Review Q1 Fund Statement",
      url: "/tasks/1",
      timestamp: "2 hours ago",
      date: hoursAgo(2),
    },
    {
      id: 2,
      type: "investment_update",
      objectType: "investment",
      actor: "Jessica Liu",
      action: "updated performance data for",
      target: "Blackstone Real Estate Income Trust",
      url: "/investments/2",
      timestamp: "3 hours ago",
      date: hoursAgo(3),
    },
    {
      id: 3,
      type: "file_upload",
      objectType: "file",
      actor: "Michael Chen",
      action: "uploaded",
      target: "March 2024 Capital Call Notice.pdf",
      url: "/documents/3",
      timestamp: "5 hours ago",
      date: hoursAgo(5),
    },
    {
      id: 4,
      type: "note_create",
      objectType: "note",
      actor: "Sarah Johnson",
      action: "created a",
      target: "Due Diligence Summary - TechFlow",
      url: "/notes/4",
      timestamp: "6 hours ago",
      date: hoursAgo(6),
    },
    {
      id: 5,
      type: "meeting_schedule",
      objectType: "meeting",
      actor: "Emily Watson",
      action: "scheduled a",
      target: "Investment Committee Review",
      url: "/meetings/5",
      timestamp: "8 hours ago",
      date: hoursAgo(8),
    },
    {
      id: 6,
      type: "entity_update",
      objectType: "entity",
      actor: "Jessica Martinez",
      action: "updated ownership structure for",
      target: "Family Trust LLC",
      url: "/entities/6",
      timestamp: "1 day ago",
      date: daysAgo(1),
    },
    {
      id: 7,
      type: "opportunity_move",
      objectType: "opportunity",
      actor: "Thomas Wong",
      action: "moved to due diligence",
      target: "Databricks Series H",
      url: "/opportunities/7",
      timestamp: "1 day ago",
      date: daysAgo(1),
    },
    {
      id: 8,
      type: "task_complete",
      objectType: "task",
      actor: "Robert Kim",
      action: "completed",
      target: "Reconcile Q4 Capital Accounts",
      url: "/tasks/8",
      timestamp: "2 days ago",
      date: daysAgo(2),
    },
    {
      id: 9,
      type: "company_add",
      objectType: "company",
      actor: "David Park",
      action: "added new portfolio",
      target: "NeoBank Technologies",
      url: "/companies/9",
      timestamp: "2 days ago",
      date: daysAgo(2),
    },
    {
      id: 10,
      type: "email_send",
      objectType: "email",
      actor: "You",
      action: "sent",
      target: "LP Quarterly Update - Q1 2024",
      url: "/emails/10",
      timestamp: "3 days ago",
      date: daysAgo(3),
    },
  ]
}

// Mock comments for global feed
const generateGlobalComments = (): ActivityItem[] => {
  const now = new Date()
  const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString()
  
  return [
    {
      id: 101,
      type: "comment",
      actor: "Sarah Johnson",
      action: "commented",
      target: "",
      content: "Great progress on the Q1 reporting. The fund performance looks strong across all portfolios.",
      timestamp: "4 hours ago",
      date: hoursAgo(4),
    },
    {
      id: 102,
      type: "comment",
      actor: "Michael Chen",
      action: "commented",
      target: "",
      content: "FYI - The capital call notices need to go out by end of week. I've updated the wire instructions.",
      timestamp: "7 hours ago",
      date: hoursAgo(7),
    },
  ]
}

export default function Home() {
  const [globalActivities] = React.useState(generateGlobalActivities())
  const [globalComments] = React.useState(generateGlobalComments())
  
  // Get time of day for personalized greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const handleCommentSubmit = (comment: string) => {
    console.log("New comment added:", comment)
    // In a real app, this would add the comment to the global feed
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center border-b">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Home</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1">
          {/* Main content with centered layout */}
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {/* Header section */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">{getTimeBasedGreeting()}, Gordon</h1>
                <p className="text-muted-foreground mt-1">Here's your Gekko Family Office overview</p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-black hover:bg-black/90 text-white">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    New
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/tasks" className="flex items-center">
                      <ClipboardCheckIcon className="h-4 w-4 mr-2" />
                      New Task
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notes" className="flex items-center">
                      <FileTextIcon className="h-4 w-4 mr-2" />
                      New Note
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/documents" className="flex items-center">
                      <UploadIcon className="h-4 w-4 mr-2" />
                      Upload
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Activity Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
              <Card className="shadow-none bg-gradient-to-t from-primary/5 to-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Tasks Today</p>
                      <p className="text-2xl font-bold mt-1.5">12</p>
                      <p className="text-xs text-muted-foreground mt-1">+3 from yesterday</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <ClipboardCheckIcon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-none bg-gradient-to-t from-primary/5 to-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">New Documents</p>
                      <p className="text-2xl font-bold mt-1.5">8</p>
                      <p className="text-xs text-muted-foreground mt-1">This week</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <FileTextIcon className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-none bg-gradient-to-t from-primary/5 to-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Active Deals</p>
                      <p className="text-2xl font-bold mt-1.5">5</p>
                      <p className="text-xs text-muted-foreground mt-1">2 in due diligence</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <TrendingUpIcon className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-none bg-gradient-to-t from-primary/5 to-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Team Activity</p>
                      <p className="text-2xl font-bold mt-1.5">32</p>
                      <p className="text-xs text-muted-foreground mt-1">Actions today</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <ActivityIcon className="h-6 w-6 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Activity Feed Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-1">Activity</h2>
                <p className="text-sm text-muted-foreground">Recent updates from your team</p>
              </div>
              
              {/* Using UnifiedActivitySection for consistency with drawers */}
              <UnifiedActivitySection 
                activities={globalActivities}
                comments={globalComments}
                showHeader={true}
                onCommentSubmit={handleCommentSubmit}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
