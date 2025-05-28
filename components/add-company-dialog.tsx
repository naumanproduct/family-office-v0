"use client"

import type * as React from "react"
import {
  BuildingIcon,
  TrendingUpIcon,
  DollarSignIcon,
  UsersIcon,
  GlobeIcon,
  MapPinIcon,
  FileTextIcon,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddCompanyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCompanyDialog({ open, onOpenChange }: AddCompanyDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="companyName">Company Name</Label>
              </div>
              <Input id="companyName" placeholder="Company Name" required />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="industry">Industry</Label>
              </div>
              <Select>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Financial Services</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="revenue">Revenue</Label>
              </div>
              <Select>
                <SelectTrigger id="revenue">
                  <SelectValue placeholder="Select revenue range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<1M">Less than $1M</SelectItem>
                  <SelectItem value="1M-10M">$1M - $10M</SelectItem>
                  <SelectItem value="10M-50M">$10M - $50M</SelectItem>
                  <SelectItem value="50M-100M">$50M - $100M</SelectItem>
                  <SelectItem value="100M-500M">$100M - $500M</SelectItem>
                  <SelectItem value="500M-1B">$500M - $1B</SelectItem>
                  <SelectItem value=">1B">More than $1B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="employees">Employees</Label>
              </div>
              <Select>
                <SelectTrigger id="employees">
                  <SelectValue placeholder="Select employee range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10</SelectItem>
                  <SelectItem value="11-50">11-50</SelectItem>
                  <SelectItem value="51-200">51-200</SelectItem>
                  <SelectItem value="201-500">201-500</SelectItem>
                  <SelectItem value="501-1000">501-1000</SelectItem>
                  <SelectItem value="1001-5000">1001-5000</SelectItem>
                  <SelectItem value="5001+">5001+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="website">Website</Label>
              </div>
              <Input id="website" placeholder="Website" />
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
                <Label htmlFor="description">Description</Label>
              </div>
              <Textarea id="description" placeholder="Description" className="min-h-[100px]" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Company</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
