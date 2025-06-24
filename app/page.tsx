"use client"

import * as React from "react"
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SearchIcon,
  FilterIcon,
  UsersIcon,
  RefreshCwIcon,
  PlusIcon,
  FileTextIcon,
  ClipboardCheckIcon,
  UploadIcon,
  BarChartIcon
} from "lucide-react"
import { ActivityItem } from "@/components/shared/unified-activity-section"
import { HomeActivityFeed } from "@/components/home-activity-feed"
import Link from "next/link"

export default function Home() {
  // Get time of day for personalized greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-4 p-4 md:p-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{getTimeBasedGreeting()}, Gordon</h1>
              <p className="text-muted-foreground text-sm mt-0.5">Here's what's happening across your family office</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8" asChild>
                <Link href="/tasks">
                  <PlusIcon className="h-3.5 w-3.5 mr-1" />
                  <span>New Task</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="h-8" asChild>
                <Link href="/notes">
                  <FileTextIcon className="h-3.5 w-3.5 mr-1" />
                  <span>New Note</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="h-8" asChild>
                <Link href="/documents">
                  <UploadIcon className="h-3.5 w-3.5 mr-1" />
                  <span>Upload</span>
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Activity Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-card">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">New Tasks</p>
                  <p className="text-2xl font-semibold">12</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <ClipboardCheckIcon className="h-4 w-4 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">Documents Added</p>
                  <p className="text-2xl font-semibold">8</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <FileTextIcon className="h-4 w-4 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">Meetings Scheduled</p>
                  <p className="text-2xl font-semibold">3</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-green-500/10 flex items-center justify-center">
                  <UsersIcon className="h-4 w-4 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">Notes Created</p>
                  <p className="text-2xl font-semibold">15</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <FileTextIcon className="h-4 w-4 text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-2 px-4 space-y-0">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                  <RefreshCwIcon className="h-3.5 w-3.5 mr-1" />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent className="px-4 py-3">
                <HomeActivityFeed />
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
