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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SettingsCategory {
  id: string
  label: string
  icon: any
  children?: SettingsCategory[]
}

const settingsCategories: SettingsCategory[] = [
  { id: "general", label: "General", icon: Settings },
  {
    id: "data",
    label: "Data",
    icon: Database,
    children: [
      { id: "objects", label: "Objects", icon: Box },
      { id: "workflows", label: "Workflows", icon: Workflow },
    ],
  },
  { id: "security", label: "Security", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "users", label: "Users & Permissions", icon: Users },
  { id: "appearance", label: "Appearance", icon: Palette },
]

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [activeCategory, setActiveCategory] = useState("objects")
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["data"])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const renderNavItem = (category: SettingsCategory, level = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.includes(category.id)
    const isActive = activeCategory === category.id

    return (
      <div key={category.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleCategory(category.id)
            } else {
              setActiveCategory(category.id)
            }
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
            level > 0 && "ml-4 pl-6",
            isActive ? "bg-muted text-foreground" : "text-muted-foreground",
          )}
        >
          <category.icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{category.label}</span>
          {hasChildren && (isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
        </button>
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">{category.children?.map((child) => renderNavItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground">Manage your application settings and configuration.</p>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row h-full overflow-hidden">
          <aside className="lg:w-64 p-6 pt-2 border-r">
            <nav className="space-y-1">{settingsCategories.map((category) => renderNavItem(category))}</nav>
          </aside>

          <div className="flex-1 p-6 overflow-y-auto">
            {activeCategory === "objects" && <ObjectsManagement />}
            {activeCategory === "workflows" && <WorkflowsManagement />}
            {activeCategory === "general" && (
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Manage your general application settings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">General settings coming soon...</p>
                </CardContent>
              </Card>
            )}
            {activeCategory === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Configure security and authentication settings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Security settings coming soon...</p>
                </CardContent>
              </Card>
            )}
            {activeCategory === "integrations" && (
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>Manage third-party integrations and API connections.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Integrations coming soon...</p>
                </CardContent>
              </Card>
            )}
            {activeCategory === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Configure notification preferences and settings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Notification settings coming soon...</p>
                </CardContent>
              </Card>
            )}
            {activeCategory === "users" && (
              <Card>
                <CardHeader>
                  <CardTitle>Users & Permissions</CardTitle>
                  <CardDescription>Manage user accounts and permission settings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">User management coming soon...</p>
                </CardContent>
              </Card>
            )}
            {activeCategory === "appearance" && (
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel of your application.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Appearance settings coming soon...</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
