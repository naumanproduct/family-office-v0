"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ObjectsManagement } from "@/components/settings/objects-management"
import { WorkflowsManagement } from "@/components/settings/workflows-management"
import {
  Settings,
  Database,
  Shield,
  Plug,
  Bell,
  Users,
  Palette,
  Box,
  Workflow,
  ChevronRight,
  ChevronDown,
  X,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SettingsCategory {
  id: string
  label: string
  icon: any
  description?: string
  children?: SettingsCategory[]
}

const settingsCategories: SettingsCategory[] = [
  { 
    id: "general", 
    label: "General", 
    icon: Settings,
    description: "Basic configuration and preferences"
  },
  {
    id: "data",
    label: "Data Management",
    icon: Database,
    description: "Configure your data objects and workflows",
    children: [
      { id: "objects", label: "Objects", icon: Box, description: "Define and customize data objects" },
      { id: "workflows", label: "Workflows", icon: Workflow, description: "Configure business processes" },
    ],
  },
  { 
    id: "security", 
    label: "Security", 
    icon: Shield,
    description: "Authentication and access control"
  },
  { 
    id: "integrations", 
    label: "Integrations", 
    icon: Plug,
    description: "Connect third-party services and APIs"
  },
  { 
    id: "notifications", 
    label: "Notifications", 
    icon: Bell,
    description: "Configure alerts and messages"
  },
  { 
    id: "users", 
    label: "Users & Permissions", 
    icon: Users,
    description: "Manage team members and roles"
  },
  { 
    id: "appearance", 
    label: "Appearance", 
    icon: Palette,
    description: "Customize the look and feel"
  },
]

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [activeCategory, setActiveCategory] = useState("objects")
  const [activeCategoryPath, setActiveCategoryPath] = useState<string[]>(["data", "objects"])
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["data"])

  const handleNavigation = (category: SettingsCategory) => {
    const hasChildren = category.children && category.children.length > 0
    
    if (hasChildren) {
      setExpandedCategories((prev) =>
        prev.includes(category.id) ? prev.filter((id) => id !== category.id) : [...prev, category.id]
      )
    } else {
      // Find the parent if it's a child
      const parent = settingsCategories.find(c => 
        c.children?.some(child => child.id === category.id)
      )
      
      if (parent) {
        setActiveCategoryPath([parent.id, category.id])
      } else {
        setActiveCategoryPath([category.id])
      }
      
      setActiveCategory(category.id)
    }
  }

  const getActiveCategory = () => {
    const cat = settingsCategories.find(c => c.id === activeCategoryPath[0])
    if (activeCategoryPath.length > 1 && cat?.children) {
      return cat.children.find(c => c.id === activeCategoryPath[1])
    }
    return cat
  }

  const active = getActiveCategory()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[95vw] max-w-[1800px] h-[95vh] max-h-[1200px] p-0 overflow-hidden flex flex-col"
        style={{ minWidth: 320 }}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 h-full overflow-hidden">
          <div className="w-72 border-r bg-background h-full">
            <ScrollArea className="h-full">
              <div className="p-4">
                <div className="space-y-1">
                  {settingsCategories.map((category) => {
                    const hasChildren = category.children && category.children.length > 0
                    const isExpanded = expandedCategories.includes(category.id)
                    const isActive = activeCategoryPath[0] === category.id && activeCategoryPath.length === 1
                    const isParentOfActive = activeCategoryPath[0] === category.id && activeCategoryPath.length > 1
                    
                    return (
                      <div key={category.id} className="mb-1">
                        <button
                          onClick={() => handleNavigation(category)}
                          className={cn(
                            "flex w-full items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            (isActive || isParentOfActive) ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <category.icon className="h-4 w-4" />
                            <span>{category.label}</span>
                          </div>
                          {hasChildren && (
                            <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded ? "" : "-rotate-90")} />
                          )}
                        </button>
                        
                        {hasChildren && isExpanded && (
                          <div className="mt-1 ml-8 space-y-1">
                            {category.children?.map((child) => {
                              const isChildActive = activeCategoryPath[0] === category.id && activeCategoryPath[1] === child.id
                              
                              return (
                                <button
                                  key={child.id}
                                  onClick={() => handleNavigation(child)}
                                  className={cn(
                                    "flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    isChildActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                                  )}
                                >
                                  <child.icon className="h-4 w-4" />
                                  <span>{child.label}</span>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </ScrollArea>
          </div>

          <div className="flex-1 flex flex-col bg-background">
            {active && (
              <>
                <div className="p-6 border-b">
                  <div className="flex items-center gap-3">
                    {activeCategoryPath.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          setActiveCategoryPath([activeCategoryPath[0]])
                          setActiveCategory(activeCategoryPath[0])
                        }}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    )}
                    <active.icon className="h-5 w-5 text-primary" />
                    <div>
                      <h2 className="text-xl font-semibold">{active.label}</h2>
                      {active.description && (
                        <p className="text-sm text-muted-foreground mt-1">{active.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <ScrollArea className="flex-1 p-6">
                  {activeCategory === "objects" && <ObjectsManagement />}
                  {activeCategory === "workflows" && <WorkflowsManagement />}
                  {activeCategory === "general" && (
                    <Card className="shadow-none border-0">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg">General Settings</CardTitle>
                        <CardDescription>Manage your general application settings.</CardDescription>
                      </CardHeader>
                      <CardContent className="px-0">
                        <p className="text-muted-foreground">General settings coming soon...</p>
                      </CardContent>
                    </Card>
                  )}
                  {activeCategory === "security" && (
                    <Card className="shadow-none border-0">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg">Security Settings</CardTitle>
                        <CardDescription>Configure security and authentication settings.</CardDescription>
                      </CardHeader>
                      <CardContent className="px-0">
                        <p className="text-muted-foreground">Security settings coming soon...</p>
                      </CardContent>
                    </Card>
                  )}
                  {activeCategory === "integrations" && (
                    <Card className="shadow-none border-0">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg">Integrations</CardTitle>
                        <CardDescription>Manage third-party integrations and API connections.</CardDescription>
                      </CardHeader>
                      <CardContent className="px-0">
                        <p className="text-muted-foreground">Integrations coming soon...</p>
                      </CardContent>
                    </Card>
                  )}
                  {activeCategory === "notifications" && (
                    <Card className="shadow-none border-0">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg">Notifications</CardTitle>
                        <CardDescription>Configure notification preferences and settings.</CardDescription>
                      </CardHeader>
                      <CardContent className="px-0">
                        <p className="text-muted-foreground">Notification settings coming soon...</p>
                      </CardContent>
                    </Card>
                  )}
                  {activeCategory === "users" && (
                    <Card className="shadow-none border-0">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg">Users & Permissions</CardTitle>
                        <CardDescription>Manage user accounts and permission settings.</CardDescription>
                      </CardHeader>
                      <CardContent className="px-0">
                        <p className="text-muted-foreground">User management coming soon...</p>
                      </CardContent>
                    </Card>
                  )}
                  {activeCategory === "appearance" && (
                    <Card className="shadow-none border-0">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg">Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of your application.</CardDescription>
                      </CardHeader>
                      <CardContent className="px-0">
                        <p className="text-muted-foreground">Appearance settings coming soon...</p>
                      </CardContent>
                    </Card>
                  )}
                </ScrollArea>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
