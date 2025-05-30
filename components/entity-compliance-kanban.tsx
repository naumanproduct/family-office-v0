"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, Building2, User, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MasterDrawer } from "@/components/master-drawer"

interface ComplianceItem {
  id: string
  complianceType: string
  entity: string
  jurisdiction: string
  dueDate: string
  filedDate?: string
  assignedTo: string
  status: "pending" | "in-progress" | "under-review" | "approved" | "filed" | "overdue"
  priority: "low" | "medium" | "high" | "critical"
  description: string
  requirements: string[]
  filingFee?: number
  notes?: string
}

const mockComplianceItems: ComplianceItem[] = [
  {
    id: "1",
    complianceType: "Annual Report",
    entity: "Venture Fund I LP",
    jurisdiction: "Delaware",
    dueDate: "2024-03-01",
    assignedTo: "Sarah Johnson",
    status: "pending",
    priority: "high",
    description: "Annual report filing for Delaware LP",
    requirements: ["Financial statements", "Partner information", "Registered agent confirmation"],
    filingFee: 300,
    notes: "Waiting for final financial statements",
  },
  {
    id: "2",
    complianceType: "Tax Filing",
    entity: "Growth Fund II LP",
    jurisdiction: "California",
    dueDate: "2024-04-15",
    assignedTo: "Michael Chen",
    status: "in-progress",
    priority: "critical",
    description: "State tax return filing",
    requirements: ["Form 565", "K-1 schedules", "Payment voucher"],
    filingFee: 800,
    notes: "Tax preparation in progress",
  },
  {
    id: "3",
    complianceType: "Regulatory Update",
    entity: "Real Estate Fund LP",
    jurisdiction: "New York",
    dueDate: "2024-02-28",
    assignedTo: "Lisa Wang",
    status: "under-review",
    priority: "medium",
    description: "Investment adviser registration update",
    requirements: ["Form ADV amendment", "Updated disclosure documents"],
    filingFee: 150,
    notes: "Pending legal review",
  },
  {
    id: "4",
    complianceType: "Board Resolution",
    entity: "Tech Fund III LP",
    jurisdiction: "Delaware",
    dueDate: "2024-03-15",
    assignedTo: "David Kim",
    status: "approved",
    priority: "low",
    description: "Annual board resolutions",
    requirements: ["Meeting minutes", "Signed resolutions", "Corporate records update"],
    notes: "Board meeting completed, filing pending",
  },
  {
    id: "5",
    complianceType: "Annual Report",
    entity: "Bond Fund LP",
    jurisdiction: "Nevada",
    dueDate: "2024-01-31",
    filedDate: "2024-01-28",
    assignedTo: "Jennifer Lee",
    status: "filed",
    priority: "medium",
    description: "Nevada annual report filing",
    requirements: ["Annual report form", "Filing fee", "Registered agent info"],
    filingFee: 125,
    notes: "Successfully filed on time",
  },
  {
    id: "6",
    complianceType: "Tax Filing",
    entity: "Infrastructure Fund LP",
    jurisdiction: "Texas",
    dueDate: "2024-01-15",
    assignedTo: "Robert Wilson",
    status: "overdue",
    priority: "critical",
    description: "Franchise tax report",
    requirements: ["Public information report", "Franchise tax payment"],
    filingFee: 300,
    notes: "OVERDUE - Penalties may apply",
  },
]

const statusConfig = {
  pending: { label: "Pending", color: "bg-gray-100 text-gray-800" },
  "in-progress": { label: "In Progress", color: "bg-blue-100 text-blue-800" },
  "under-review": { label: "Under Review", color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Approved", color: "bg-green-100 text-green-800" },
  filed: { label: "Filed", color: "bg-purple-100 text-purple-800" },
  overdue: { label: "Overdue", color: "bg-red-100 text-red-800" },
}

const priorityConfig = {
  low: { label: "Low", color: "bg-green-100 text-green-800" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  high: { label: "High", color: "bg-orange-100 text-orange-800" },
  critical: { label: "Critical", color: "bg-red-100 text-red-800" },
}

export function EntityComplianceKanban() {
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleItemClick = (item: ComplianceItem) => {
    setSelectedItem(item)
    setIsDrawerOpen(true)
  }

  const getItemsByStatus = (status: ComplianceItem["status"]) => {
    return mockComplianceItems.filter((item) => item.status === status)
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const ComplianceCard = ({ item }: { item: ComplianceItem }) => (
    <Card className="mb-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleItemClick(item)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">{item.complianceType}</CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />
              {item.entity}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Item</DropdownMenuItem>
              <DropdownMenuItem>Assign to User</DropdownMenuItem>
              <DropdownMenuItem>Set Reminder</DropdownMenuItem>
              <DropdownMenuItem>View History</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Mark as Cancelled</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium">{item.jurisdiction}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <User className="h-3 w-3 text-muted-foreground" />
            <span>{item.assignedTo}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
            {isOverdue(item.dueDate) && item.status !== "filed" && <AlertTriangle className="h-3 w-3 text-red-500" />}
          </div>
          {item.filedDate && (
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span>Filed: {new Date(item.filedDate).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2">
            <Badge variant="secondary" className={`text-xs ${priorityConfig[item.priority].color}`}>
              {priorityConfig[item.priority].label}
            </Badge>
            {item.filingFee && <span className="text-xs text-muted-foreground">Fee: ${item.filingFee}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const StatusColumn = ({
    status,
    title,
    items,
  }: {
    status: ComplianceItem["status"]
    title: string
    items: ComplianceItem[]
  }) => (
    <div className="flex-1 min-w-[300px]">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{title}</h3>
          <Badge variant="secondary" className="text-xs">
            {items.length}
          </Badge>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <ComplianceCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )

  return (
    <>
      <div className="flex gap-6 overflow-x-auto pb-4">
        <StatusColumn status="pending" title="Pending" items={getItemsByStatus("pending")} />
        <StatusColumn status="in-progress" title="In Progress" items={getItemsByStatus("in-progress")} />
        <StatusColumn status="under-review" title="Under Review" items={getItemsByStatus("under-review")} />
        <StatusColumn status="approved" title="Approved" items={getItemsByStatus("approved")} />
        <StatusColumn status="filed" title="Filed" items={getItemsByStatus("filed")} />
        <StatusColumn status="overdue" title="Overdue" items={getItemsByStatus("overdue")} />
      </div>

      <MasterDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={selectedItem ? `${selectedItem.complianceType} - ${selectedItem.entity}` : ""}
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Compliance Type</label>
                <p className="text-sm">{selectedItem.complianceType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Entity</label>
                <p className="text-sm">{selectedItem.entity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Jurisdiction</label>
                <p className="text-sm">{selectedItem.jurisdiction}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                <p className="text-sm">{selectedItem.assignedTo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                <p className="text-sm">{new Date(selectedItem.dueDate).toLocaleDateString()}</p>
              </div>
              {selectedItem.filedDate && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Filed Date</label>
                  <p className="text-sm">{new Date(selectedItem.filedDate).toLocaleDateString()}</p>
                </div>
              )}
              {selectedItem.filingFee && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Filing Fee</label>
                  <p className="text-sm">${selectedItem.filingFee}</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-sm mt-1">{selectedItem.description}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge className={statusConfig[selectedItem.status].color}>
                  {statusConfig[selectedItem.status].label}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Priority</label>
              <div className="mt-1">
                <Badge className={priorityConfig[selectedItem.priority].color}>
                  {priorityConfig[selectedItem.priority].label}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Requirements</label>
              <ul className="text-sm mt-1 space-y-1">
                {selectedItem.requirements.map((req, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {selectedItem.notes && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Notes</label>
                <p className="text-sm mt-1">{selectedItem.notes}</p>
              </div>
            )}
          </div>
        )}
      </MasterDrawer>
    </>
  )
}
