"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
  X,
  ChevronLeft,
  Search,
  Save,
  Undo,
  HelpCircle,
  KeyRound,
  Building,
  CreditCard,
  UserCircle,
  Globe,
  FileText,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SettingsCategory {
  id: string
  label: string
  icon: any
  description?: string
  children?: SettingsCategory[]
}

const settingsCategories: SettingsCategory[] = [
  { 
    id: "account", 
    label: "Account", 
    icon: UserCircle,
    description: "Manage your account settings and preferences",
    children: [
      { id: "profile", label: "Profile", icon: UserCircle },
      { id: "password", label: "Password & Security", icon: KeyRound },
      { id: "billing", label: "Billing & Plans", icon: CreditCard },
    ]
  },
  { 
    id: "workspace", 
    label: "Workspace", 
    icon: Building,
    description: "Manage workspace settings and configuration",
    children: [
      { id: "general", label: "General", icon: Settings },
      { id: "members", label: "Members & Permissions", icon: Users },
      { id: "appearance", label: "Appearance", icon: Palette },
    ]
  },
  {
    id: "data",
    label: "Data Management",
    icon: Database,
    description: "Configure your data structure and workflows",
    children: [
      { id: "objects", label: "Objects", icon: Box },
      { id: "workflows", label: "Workflows", icon: Workflow },
      { id: "files", label: "Files & Media", icon: FileText },
    ],
  },
  { 
    id: "security", 
    label: "Security & Privacy", 
    icon: Shield,
    description: "Configure security settings and access control" 
  },
  { 
    id: "integrations", 
    label: "Integrations", 
    icon: Plug,
    description: "Connect with external services and APIs" 
  },
  { 
    id: "notifications", 
    label: "Notifications", 
    icon: Bell,
    description: "Configure notification preferences and channels" 
  },
  { 
    id: "advanced", 
    label: "Advanced", 
    icon: Globe,
    description: "Advanced configuration options" 
  },
]

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  // State for navigation and UI
  const [mainCategory, setMainCategory] = useState<string>("workspace")
  const [subCategory, setSubCategory] = useState<string>("general")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [breadcrumbs, setBreadcrumbs] = useState<{id: string, label: string}[]>([])
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false)
  
  // State for managing dialogs
  const [isObjectsDialogOpen, setIsObjectsDialogOpen] = useState(false)
  const [isWorkflowsDialogOpen, setIsWorkflowsDialogOpen] = useState(false)
  
  // Update breadcrumbs when navigation changes
  useEffect(() => {
    const currentMainCategory = settingsCategories.find(cat => cat.id === mainCategory)
    if (!currentMainCategory) return
    
    const newBreadcrumbs = [{ id: currentMainCategory.id, label: currentMainCategory.label }]
    
    if (subCategory) {
      const currentSubCategory = currentMainCategory.children?.find(cat => cat.id === subCategory)
      if (currentSubCategory) {
        newBreadcrumbs.push({ id: currentSubCategory.id, label: currentSubCategory.label })
      }
    }
    
    setBreadcrumbs(newBreadcrumbs)
  }, [mainCategory, subCategory])
  
  // Handler for category selection
  const handleCategorySelect = (categoryId: string, isMainCategory: boolean = true) => {
    if (isMainCategory) {
      setMainCategory(categoryId)
      // Reset subcategory if the main category has children
      const category = settingsCategories.find(cat => cat.id === categoryId)
      if (category?.children?.length) {
        setSubCategory(category.children[0].id)
      } else {
        setSubCategory("")
      }
    } else {
      setSubCategory(categoryId)
    }
  }
  
  // Get current category for display
  const getCurrentCategory = () => {
    const mainCat = settingsCategories.find(cat => cat.id === mainCategory)
    if (!mainCat) return null
    
    if (subCategory && mainCat.children) {
      return mainCat.children.find(cat => cat.id === subCategory) || mainCat
    }
    
    return mainCat
  }
  
  // Mock function for "Save Changes"
  const handleSaveChanges = () => {
    console.log("Saving changes...")
    setUnsavedChanges(false)
    // In a real app, this would save the current section's changes
  }
  
  // Mock function for search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // In a real app, this would filter visible settings or show search results
  }
  
  // Helper function for Add button click
  const handleAddButtonClick = () => {
    if (subCategory === "objects") {
      setIsObjectsDialogOpen(true)
    } else if (subCategory === "workflows") {
      setIsWorkflowsDialogOpen(true)
    }
  }
  
  const currentCategory = getCurrentCategory()
  
  return (
    <Dialog open={open} onOpenChange={(newOpenState) => {
      // Show confirmation if there are unsaved changes
      if (unsavedChanges && !newOpenState) {
        if (confirm("You have unsaved changes. Are you sure you want to close?")) {
          onOpenChange(newOpenState)
        }
      } else {
        onOpenChange(newOpenState)
      }
    }}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Settings</h2>
          </div>
          
          <div className="flex items-center gap-2">
            {unsavedChanges && (
              <div className="flex items-center gap-2 mr-2">
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Unsaved changes
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSaveChanges}
                  className="h-8 gap-1 text-xs"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save
                </Button>
              </div>
            )}
            
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search settings..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-9 w-9"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r flex flex-col overflow-hidden">
            <div className="p-4 space-y-1 flex-1 overflow-y-auto">
              {settingsCategories.map((category) => (
                <div key={category.id} className="space-y-1">
                  <button
                    onClick={() => handleCategorySelect(category.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      mainCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <category.icon className="h-4 w-4" />
                      <span>{category.label}</span>
                    </div>
                    {category.children && <ChevronRight className="h-4 w-4 opacity-70" />}
                  </button>
                  
                  {/* Show subcategories for selected main category */}
                  {mainCategory === category.id && category.children && (
                    <div className="ml-5 pl-3 border-l space-y-1 my-2">
                      {category.children.map((subcat) => (
                        <button
                          key={subcat.id}
                          onClick={() => handleCategorySelect(subcat.id, false)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                            subCategory === subcat.id
                              ? "bg-accent text-accent-foreground font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <subcat.icon className="h-4 w-4" />
                          <span>{subcat.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Help & Support */}
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full justify-start gap-2 text-muted-foreground">
                <HelpCircle className="h-4 w-4" />
                <span>Help & Support</span>
              </Button>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Content Header */}
            <div className="p-6 pb-0">
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.id} className="flex items-center">
                    {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
                    <button 
                      onClick={() => index === 0 ? handleCategorySelect(crumb.id) : null}
                      className={cn(
                        "hover:text-foreground transition-colors",
                        index === breadcrumbs.length - 1 ? "text-foreground font-medium pointer-events-none" : ""
                      )}
                    >
                      {crumb.label}
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-semibold">{currentCategory?.label}</h1>
                  <p className="text-muted-foreground mt-1">
                    {currentCategory?.description || `Manage your ${currentCategory?.label?.toLowerCase()} settings`}
                  </p>
                </div>
                
                {/* Add buttons for Data Management sections */}
                {(subCategory === "objects" || subCategory === "workflows") && (
                  <Button onClick={handleAddButtonClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add {subCategory === "objects" ? "Object" : "Workflow"}
                  </Button>
                )}
              </div>
              <Separator />
            </div>
            
            {/* Content Body */}
            <div className="flex-1 p-6 pt-4 overflow-y-auto">
              {subCategory === "objects" && (
                <ObjectsManagement 
                  hideTitle 
                  hideButton 
                  isDialogOpen={isObjectsDialogOpen}
                  onDialogOpenChange={setIsObjectsDialogOpen}
                />
              )}
              {subCategory === "workflows" && (
                <WorkflowsManagement 
                  hideTitle 
                  hideButton 
                  isDialogOpen={isWorkflowsDialogOpen}
                  onDialogOpenChange={setIsWorkflowsDialogOpen}
                />
              )}
              
              {/* General Settings */}
              {subCategory === "general" && (
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    <TabsTrigger value="localization">Localization</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic">
                    <Card>
                      <CardHeader>
                        <CardTitle>Workspace Information</CardTitle>
                        <CardDescription>Manage general information about your workspace</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-1.5">
                          <label htmlFor="workspace-name" className="text-sm font-medium">
                            Workspace Name
                          </label>
                          <Input 
                            id="workspace-name" 
                            defaultValue="Family Office V0" 
                            onChange={() => setUnsavedChanges(true)}
                          />
                          <p className="text-xs text-muted-foreground">
                            This is the name of your workspace visible to all members
                          </p>
                        </div>
                        
                        <div className="grid gap-1.5">
                          <label htmlFor="workspace-description" className="text-sm font-medium">
                            Description
                          </label>
                          <Input 
                            id="workspace-description" 
                            defaultValue="Family office management platform" 
                            onChange={() => setUnsavedChanges(true)}
                          />
                          <p className="text-xs text-muted-foreground">
                            A brief description of your workspace's purpose
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end border-t p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" disabled={!unsavedChanges}>
                            <Undo className="mr-2 h-4 w-4" />
                            Reset
                          </Button>
                          <Button disabled={!unsavedChanges} onClick={handleSaveChanges}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="preferences">
                    <Card>
                      <CardHeader>
                        <CardTitle>Workspace Preferences</CardTitle>
                        <CardDescription>Customize how your workspace behaves</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Workspace preferences settings will appear here
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="localization">
                    <Card>
                      <CardHeader>
                        <CardTitle>Localization</CardTitle>
                        <CardDescription>Configure language and regional settings</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Localization settings will appear here
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
              
              {/* Other content sections would be implemented here */}
              {(subCategory !== "objects" && subCategory !== "workflows" && subCategory !== "general") && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="bg-muted rounded-full p-3 mb-4">
                    {currentCategory && <currentCategory.icon className="h-6 w-6 text-primary" />}
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {currentCategory?.label} Settings
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    This section will allow you to manage your {currentCategory?.label?.toLowerCase()} settings and preferences.
                  </p>
                  <Button className="mt-4">Set Up {currentCategory?.label}</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
