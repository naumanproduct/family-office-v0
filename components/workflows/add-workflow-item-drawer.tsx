"use client"

import * as React from "react"
import { useState } from "react"
import { ChevronLeftIcon, PlusIcon, SearchIcon, BuildingIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for companies (sorted alphabetically by name)
const mockCompanies = [
  { id: 1, name: "Acme Corp", industry: "Technology" },
  { id: 8, name: "Cyberdyne Systems", industry: "Technology" },
  { id: 2, name: "Globex", industry: "Finance" },
  { id: 3, name: "Initech", industry: "Technology" },
  { id: 10, name: "LexCorp", industry: "Technology" },
  { id: 4, name: "Massive Dynamic", industry: "Research" },
  { id: 9, name: "Oscorp", industry: "Research" },
  { id: 5, name: "Stark Industries", industry: "Manufacturing" },
  { id: 7, name: "Umbrella Corporation", industry: "Pharmaceuticals" },
  { id: 6, name: "Wayne Enterprises", industry: "Conglomerate" },
]

interface AddWorkflowItemDrawerProps {
  workflowType: string
  onAddItem?: (data: any) => void
  customFields?: Array<{
    id: string
    name: string
    type: "text" | "textarea" | "select" | "date"
    options?: string[]
    required?: boolean
  }>
}

export function AddWorkflowItemDrawer({ 
  workflowType, 
  onAddItem,
  customFields = [
    { id: "stage", name: "Stage", type: "select", options: ["Initial Contact", "Meeting Scheduled", "Proposal", "Negotiation", "Closed"], required: true },
    { id: "priority", name: "Priority", type: "select", options: ["Low", "Medium", "High"], required: true },
    { id: "description", name: "Description", type: "textarea" },
    { id: "notes", name: "Notes", type: "textarea" },
  ]
}: AddWorkflowItemDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"select-company" | "fill-details">("select-company")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  // Filter companies based on search term
  const filteredCompanies = mockCompanies.filter(
    (company) => company.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCompanySelect = (company: any) => {
    setSelectedCompany(company)
    setActiveTab("fill-details")
    // Initialize form data with company info
    setFormData({
      companyId: company.id,
      companyName: company.name,
    })
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    if (onAddItem) {
      onAddItem({
        ...formData,
        company: selectedCompany,
        createdAt: new Date().toISOString(),
      })
    }
    // Reset and close
    setActiveTab("select-company")
    setSelectedCompany(null)
    setFormData({})
    setIsOpen(false)
  }

  const handleBack = () => {
    if (activeTab === "fill-details") {
      setActiveTab("select-company")
    } else {
      setIsOpen(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add company
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full max-w-2xl flex-col p-0 sm:max-w-2xl [&>button]:hidden">
        <SheetTitle className="sr-only">Add {workflowType}</SheetTitle>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="bg-background">
              {activeTab === "select-company" ? "Select Company" : `Add ${workflowType}`}
            </Badge>
          </div>
        </div>

        {/* Record Header */}
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {workflowType.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {activeTab === "select-company" 
                  ? `Select Company for ${workflowType}` 
                  : `Add ${workflowType} Details`}
              </h2>
              <p className="text-sm text-muted-foreground">
                {activeTab === "select-company"
                  ? "Select a company to associate with this workflow item"
                  : `Configure the details for this ${workflowType.toLowerCase()}`}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "select-company" | "fill-details")} className="flex flex-col h-full">
            <TabsContent value="select-company" className="flex-1 p-6 m-0 border-0">
              {/* Search */}
              <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search companies..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Companies list - styled like card fields in the app */}
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="space-y-2">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="group flex items-center space-x-3 rounded-lg border border-border bg-card p-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200 cursor-pointer"
                      onClick={() => handleCompanySelect(company)}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="h-8 w-8 overflow-hidden rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                          <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{company.name}</div>
                          <div className="text-xs text-muted-foreground">{company.industry}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2">Company</Badge>
                    </div>
                  ))}
                  
                  {filteredCompanies.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-border rounded-lg bg-muted/50">
                      <div className="max-w-sm mx-auto">
                        <div className="text-muted-foreground mb-3">
                          <BuildingIcon className="h-8 w-8 mx-auto" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">No companies found</p>
                        <p className="text-xs text-muted-foreground mb-4">
                          Try a different search term or add a new company
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="fill-details" className="flex-1 p-6 m-0 border-0">
              {selectedCompany && (
                <div className="mb-6">
                  <div className="flex items-center space-x-3 rounded-lg border border-border bg-card p-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="h-8 w-8 overflow-hidden rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{selectedCompany.name}</div>
                        <div className="text-xs text-muted-foreground">{selectedCompany.industry}</div>
                      </div>
                    </div>
                    <Badge variant="outline">Company</Badge>
                  </div>
                </div>
              )}
              
              <Separator className="my-4" />
              
              {/* Form fields */}
              <div className="space-y-4">
                {customFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id} className="text-xs font-medium">
                      {field.name}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    
                    {field.type === "text" && (
                      <Input
                        id={field.id}
                        value={formData[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={field.required}
                        className="h-8 text-sm"
                      />
                    )}
                    
                    {field.type === "textarea" && (
                      <Textarea
                        id={field.id}
                        value={formData[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={field.required}
                        className="resize-none text-sm"
                        rows={3}
                      />
                    )}
                    
                    {field.type === "select" && field.options && (
                      <Select
                        value={formData[field.id] || ""}
                        onValueChange={(value) => handleInputChange(field.id, value)}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder={`Select ${field.name}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    {field.type === "date" && (
                      <Input
                        id={field.id}
                        type="date"
                        value={formData[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={field.required}
                        className="h-8 text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSubmit} className="gap-2">
                  Add to {workflowType}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
} 