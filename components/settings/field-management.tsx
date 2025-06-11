"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, Edit, Trash2, GripVertical } from "lucide-react"

interface Field {
  id: string
  name: string
  apiName: string
  type: string
  required: boolean
  description: string
  defaultValue?: string
}

const sampleFields: Field[] = [
  {
    id: "1",
    name: "Deal Name",
    apiName: "deal_name",
    type: "Text",
    required: true,
    description: "The name of the investment deal",
  },
  {
    id: "2",
    name: "Investment Amount",
    apiName: "investment_amount",
    type: "Currency",
    required: true,
    description: "Total investment amount",
  },
  {
    id: "3",
    name: "Deal Stage",
    apiName: "deal_stage",
    type: "Picklist",
    required: true,
    description: "Current stage of the deal",
  },
  {
    id: "4",
    name: "Expected Close Date",
    apiName: "expected_close_date",
    type: "Date",
    required: false,
    description: "Expected closing date for the deal",
  },
  {
    id: "5",
    name: "Due Diligence Complete",
    apiName: "due_diligence_complete",
    type: "Checkbox",
    required: false,
    description: "Whether due diligence has been completed",
  },
]

const fieldTypes = [
  "Text",
  "Number",
  "Currency",
  "Date",
  "DateTime",
  "Checkbox",
  "Picklist",
  "Lookup",
  "Email",
  "Phone",
  "URL",
  "Textarea",
]

interface FieldManagementProps {
  objectType: "object" | "workflow"
  objectName: string
  onBack: () => void
}

export function FieldManagement({ objectType, objectName, onBack }: FieldManagementProps) {
  const [fields, setFields] = useState<Field[]>(sampleFields)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newField, setNewField] = useState({
    name: "",
    apiName: "",
    type: "Text",
    required: false,
    description: "",
    defaultValue: "",
  })

  const handleCreateField = () => {
    const field: Field = {
      id: Date.now().toString(),
      name: newField.name,
      apiName: newField.apiName,
      type: newField.type,
      required: newField.required,
      description: newField.description,
      defaultValue: newField.defaultValue || undefined,
    }
    setFields([...fields, field])
    setNewField({
      name: "",
      apiName: "",
      type: "Text",
      required: false,
      description: "",
      defaultValue: "",
    })
    setIsCreateDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {objectType === "object" ? "Objects" : "Workflows"}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{objectName} Fields</h3>
          <p className="text-sm text-muted-foreground">Manage fields for this {objectType}.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Field</DialogTitle>
              <DialogDescription>Add a new field to this {objectType}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fieldName">Field Name</Label>
                <Input
                  id="fieldName"
                  value={newField.name}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  placeholder="e.g., Deal Name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="apiName">API Name</Label>
                <Input
                  id="apiName"
                  value={newField.apiName}
                  onChange={(e) => setNewField({ ...newField, apiName: e.target.value })}
                  placeholder="e.g., deal_name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Field Type</Label>
                <Select value={newField.type} onValueChange={(value) => setNewField({ ...newField, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={newField.required}
                  onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
                />
                <Label htmlFor="required">Required field</Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newField.description}
                  onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                  placeholder="Describe what this field is used for..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateField}>
                Create Field
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Field Name</TableHead>
              <TableHead>API Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Required</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.id}>
                <TableCell>
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                </TableCell>
                <TableCell className="font-medium">{field.name}</TableCell>
                <TableCell>
                  <code className="text-sm bg-muted px-1 py-0.5 rounded">{field.apiName}</code>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{field.type}</Badge>
                </TableCell>
                <TableCell>
                  {field.required ? (
                    <Badge variant="destructive">Required</Badge>
                  ) : (
                    <Badge variant="secondary">Optional</Badge>
                  )}
                </TableCell>
                <TableCell>{field.description}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
