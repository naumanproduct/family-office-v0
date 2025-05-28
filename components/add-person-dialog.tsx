"use client"

import type * as React from "react"
import { UserIcon, MailIcon, PhoneIcon, BriefcaseIcon, BuildingIcon, MapPinIcon, FileTextIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AddPersonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPersonDialog({ open, onOpenChange }: AddPersonDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Person</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="firstName">First Name</Label>
                </div>
                <Input id="firstName" placeholder="First Name" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="lastName">Last Name</Label>
                </div>
                <Input id="lastName" placeholder="Last Name" required />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email">Email</Label>
              </div>
              <Input id="email" type="email" placeholder="Email" required />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="phone">Phone</Label>
              </div>
              <Input id="phone" placeholder="Phone" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="jobTitle">Job Title</Label>
              </div>
              <Input id="jobTitle" placeholder="Job Title" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="company">Company</Label>
              </div>
              <Input id="company" placeholder="Company" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="location">Location</Label>
              </div>
              <Input id="location" placeholder="Location" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="bio">Bio</Label>
              </div>
              <Textarea id="bio" placeholder="Bio" className="min-h-[100px]" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Person</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
