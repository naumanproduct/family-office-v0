"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeftIcon, FileTextIcon, MailIcon, CalendarIcon, CheckCircleIcon } from "lucide-react"

interface MasterDetailsPanelProps {
  isFullScreen?: boolean
  title: string
  subtitle?: string
  firstLetter?: string
  onBack?: () => void
  children: React.ReactNode
  tabs?: {
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    count?: number | null
  }[]
  activeTab?: string
  setActiveTab?: (tabId: string) => void
}

export function MasterDetailsPanel({
  isFullScreen = false,
  title,
  subtitle,
  firstLetter,
  onBack,
  children,
  tabs = [],
  activeTab = "details",
  setActiveTab,
}: MasterDetailsPanelProps) {
  const handleTabChange = (value: string) => {
    if (setActiveTab) {
      setActiveTab(value)
    }
  }

  return (
    <div className={`flex h-full flex-col overflow-hidden ${isFullScreen ? "w-full" : ""}`}>
      {/* Header */}
      <div className="flex items-center gap-4 border-b bg-muted p-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-1">
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
        )}
        {firstLetter ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
            {firstLetter}
          </div>
        ) : null}
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      {/* Content */}
      {tabs.length > 0 ? (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex h-full flex-col">
          <div className="border-b bg-muted px-4">
            <TabsList className="h-11">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1.5">
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && tab.count !== null && (
                      <span className="ml-1 rounded-full bg-muted-foreground/20 px-2 py-0.5 text-xs">
                        {tab.count}
                      </span>
                    )}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>
          <div className="flex-1 overflow-auto">
            <TabsContent value={activeTab} className="h-full data-[state=active]:flex data-[state=active]:flex-col">
              {children}
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        <div className="flex-1 overflow-auto p-4">{children}</div>
      )}
    </div>
  )
}

// Export default tabs for common scenarios
export const defaultDetailsTabs = [
  {
    id: "details",
    label: "Details",
    icon: FileTextIcon,
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: CheckCircleIcon,
    count: 0,
  },
  {
    id: "emails",
    label: "Emails",
    icon: MailIcon,
    count: 0,
  },
  {
    id: "meetings",
    label: "Meetings",
    icon: CalendarIcon,
    count: 0,
  },
] 