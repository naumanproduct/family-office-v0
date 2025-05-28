"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Plus,
  Building,
  Users,
  TrendingUp,
  CheckSquare,
  FileText,
  StickyNote,
  Mail,
  Briefcase,
  User,
} from "lucide-react"
import { FieldManagement } from "./field-management"

interface CustomObject {
  id: string
  name: string
  apiName: string
  description: string
  fieldCount: number
  recordCount: number
  icon: any
  createdAt: string
}

const systemObjects: CustomObject[] = [
  {
    id: "1",
    name: "Entities",
    apiName: "entities",
    description: "Legal entities including funds, SPVs, and investment vehicles",
    fieldCount: 18,
    recordCount: 45,
    icon: Building,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Investments",
    apiName: "investments",
    description: "Investment records tracking capital deployment and returns",
    fieldCount: 22,
    recordCount: 128,
    icon: TrendingUp,
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    name: "Opportunities",
    apiName: "opportunities",
    description: "Investment opportunities and deal pipeline management",
    fieldCount: 16,
    recordCount: 67,
    icon: Briefcase,
    createdAt: "2024-01-15",
  },
  {
    id: "4",
    name: "Tasks",
    apiName: "tasks",
    description: "Task management and workflow tracking",
    fieldCount: 12,
    recordCount: 234,
    icon: CheckSquare,
    createdAt: "2024-01-15",
  },
  {
    id: "5",
    name: "Documents",
    apiName: "documents",
    description: "Document storage and management system",
    fieldCount: 14,
    recordCount: 892,
    icon: FileText,
    createdAt: "2024-01-15",
  },
  {
    id: "6",
    name: "Notes",
    apiName: "notes",
    description: "Notes and annotations for records and meetings",
    fieldCount: 8,
    recordCount: 156,
    icon: StickyNote,
    createdAt: "2024-01-15",
  },
  {
    id: "7",
    name: "Emails",
    apiName: "emails",
    description: "Email communications and correspondence tracking",
    fieldCount: 10,
    recordCount: 1247,
    icon: Mail,
    createdAt: "2024-01-15",
  },
  {
    id: "8",
    name: "Companies",
    apiName: "companies",
    description: "Portfolio companies and investment targets",
    fieldCount: 20,
    recordCount: 89,
    icon: Building,
    createdAt: "2024-01-15",
  },
  {
    id: "9",
    name: "Contacts",
    apiName: "contacts",
    description: "Contact management for investors, partners, and stakeholders",
    fieldCount: 15,
    recordCount: 312,
    icon: Users,
    createdAt: "2024-01-15",
  },
]

export function ObjectsManagement() {
  const [objects, setObjects] = useState<CustomObject[]>(systemObjects)
  const [selectedObject, setSelectedObject] = useState<CustomObject | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newObject, setNewObject] = useState({
    name: "",
    apiName: "",
    description: "",
  })

  const handleCreateObject = () => {
    const object: CustomObject = {
      id: Date.now().toString(),
      name: newObject.name,
      apiName: newObject.apiName,
      description: newObject.description,
      fieldCount: 0,
      recordCount: 0,
      icon: User,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setObjects([...objects, object])
    setNewObject({ name: "", apiName: "", description: "" })
    setIsCreateDialogOpen(false)
  }

  const handleObjectClick = (object: CustomObject) => {
    setSelectedObject(object)
  }

  const handleBackToList = () => {
    setSelectedObject(null)
  }

  if (selectedObject) {
    return <FieldManagement objectType="object" objectName={selectedObject.name} onBack={handleBackToList} />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Objects</CardTitle>
            <CardDescription>
              Manage your data objects and their field structures. Objects define the data models for your business
              entities.
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Object
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Custom Object</DialogTitle>
                <DialogDescription>Add a new custom object to store your business data.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Object Name</Label>
                  <Input
                    id="name"
                    value={newObject.name}
                    onChange={(e) => setNewObject({ ...newObject, name: e.target.value })}
                    placeholder="e.g., Investment Deal"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="apiName">API Name</Label>
                  <Input
                    id="apiName"
                    value={newObject.apiName}
                    onChange={(e) => setNewObject({ ...newObject, apiName: e.target.value })}
                    placeholder="e.g., investment_deal"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newObject.description}
                    onChange={(e) => setNewObject({ ...newObject, description: e.target.value })}
                    placeholder="Describe what this object is used for..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateObject}>
                  Create Object
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">Object Name</TableHead>
                <TableHead className="w-[180px]">API Name</TableHead>
                <TableHead className="min-w-[500px]">Description</TableHead>
                <TableHead className="w-[120px] text-center">Fields</TableHead>
                <TableHead className="w-[120px] text-center">Records</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {objects.map((object) => (
                <TableRow key={object.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell onClick={() => handleObjectClick(object)}>
                    <div className="flex items-center gap-3">
                      <object.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{object.name}</span>
                    </div>
                  </TableCell>
                  <TableCell onClick={() => handleObjectClick(object)}>
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{object.apiName}</code>
                  </TableCell>
                  <TableCell onClick={() => handleObjectClick(object)}>
                    <span className="text-sm text-muted-foreground leading-relaxed">{object.description}</span>
                  </TableCell>
                  <TableCell onClick={() => handleObjectClick(object)} className="text-center">
                    <Badge variant="secondary" className="font-mono text-xs">
                      {object.fieldCount}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={() => handleObjectClick(object)} className="text-center">
                    <Badge variant="outline" className="font-mono text-xs">
                      {object.recordCount.toLocaleString()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
