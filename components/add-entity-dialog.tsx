"use client"

import type * as React from "react"
import { BuildingIcon, ScaleIcon, UsersIcon, MapPinIcon, CalendarIcon, FileTextIcon, TagIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddEntityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddEntityDialog({ open, onOpenChange }: AddEntityDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Entity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="entityName">Entity Name</Label>
              </div>
              <Input id="entityName" placeholder="Entity Name" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ScaleIcon className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="entityType">Entity Type</Label>
                </div>
                <Select>
                  <SelectTrigger id="entityType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LLC">LLC</SelectItem>
                    <SelectItem value="LP">LP</SelectItem>
                    <SelectItem value="Trust">Trust</SelectItem>
                    <SelectItem value="Corp">Corp</SelectItem>
                    <SelectItem value="Foundation">Foundation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="rolePurpose">Role / Purpose</Label>
                </div>
                <Select>
                  <SelectTrigger id="rolePurpose">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Holding Co">Holding Co</SelectItem>
                    <SelectItem value="GP">GP</SelectItem>
                    <SelectItem value="LP">LP</SelectItem>
                    <SelectItem value="Operating Co">Operating Co</SelectItem>
                    <SelectItem value="Trust">Trust</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="jurisdiction">Jurisdiction</Label>
                </div>
                <Select>
                  <SelectTrigger id="jurisdiction">
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Delaware">Delaware</SelectItem>
                    <SelectItem value="BVI">BVI</SelectItem>
                    <SelectItem value="Cayman">Cayman</SelectItem>
                    <SelectItem value="Nevada">Nevada</SelectItem>
                    <SelectItem value="Wyoming">Wyoming</SelectItem>
                    <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ScaleIcon className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="status">Status</Label>
                </div>
                <Select>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Dissolved">Dissolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="ownershipPercent">Ownership %</Label>
                </div>
                <Input id="ownershipPercent" placeholder="0-100" type="number" min="0" max="100" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="parentEntity">Parent Entity</Label>
                </div>
                <Input id="parentEntity" placeholder="Parent entity name" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="managerController">Manager / Controller</Label>
                </div>
                <Input id="managerController" placeholder="Manager or controller name" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="dateFormed">Date Formed</Label>
                </div>
                <Input id="dateFormed" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TagIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="tags">Tags</Label>
              </div>
              <Input id="tags" placeholder="Taxable, Onshore, Offshore (comma separated)" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="notes">Notes</Label>
              </div>
              <Textarea id="notes" placeholder="Summary or reminders" className="min-h-[100px]" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Entity</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
