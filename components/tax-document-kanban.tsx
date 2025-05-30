"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, FileText, User, Building2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MasterDrawer } from "@/components/master-drawer"

interface TaxDocument {
  id: string
  documentType: string
  taxYear: number
  entity: string
  investor: string
  dueDate: string
  submittedDate?: string
  reviewer?: string
  status: "requested" | "sent" | "pending-review" | "under-review" | "approved" | "filed"
  priority: "low" | "medium" | "high"
  notes?: string
  filingDeadline: string
}

const mockTaxDocuments: TaxDocument[] = [
  {
    id: "1",
    documentType: "K-1 Partnership",
    taxYear: 2024,
    entity: "Venture Fund I LP",
    investor: "Pension Fund Alpha",
    dueDate: "2024-02-15",
    status: "requested",
    priority: "high",
    filingDeadline: "2024-03-15",
    notes: "Initial request sent to investor",
  },
  {
    id: "2",
    documentType: "1099-DIV",
    taxYear: 2024,
    entity: "Growth Fund II LP",
    investor: "Family Office Beta",
    dueDate: "2024-01-31",
    status: "sent",
    priority: "medium",
    filingDeadline: "2024-04-15",
    submittedDate: "2024-01-28",
  },
  {
    id: "3",
    documentType: "Tax Return",
    taxYear: 2023,
    entity: "Real Estate Fund LP",
    investor: "Insurance Co Gamma",
    dueDate: "2024-01-15",
    status: "pending-review",
    priority: "high",
    filingDeadline: "2024-03-15",
    submittedDate: "2024-01-14",
    reviewer: "Sarah Johnson",
  },
  {
    id: "4",
    documentType: "Supporting Documents",
    taxYear: 2024,
    entity: "Tech Fund III LP",
    investor: "Endowment Delta",
    dueDate: "2024-02-01",
    status: "under-review",
    priority: "medium",
    filingDeadline: "2024-04-15",
    submittedDate: "2024-01-30",
    reviewer: "Michael Chen",
  },
  {
    id: "5",
    documentType: "K-1 Partnership",
    taxYear: 2023,
    entity: "Venture Fund I LP",
    investor: "Corporate Fund Epsilon",
    dueDate: "2024-01-10",
    status: "approved",
    priority: "low",
    filingDeadline: "2024-03-15",
    submittedDate: "2024-01-08",
    reviewer: "Lisa Wang",
  },
  {
    id: "6",
    documentType: "1099-INT",
    taxYear: 2023,
    entity: "Bond Fund LP",
    investor: "Sovereign Wealth Zeta",
    dueDate: "2024-01-05",
    status: "filed",
    priority: "low",
    filingDeadline: "2024-03-15",
    submittedDate: "2024-01-03",
    reviewer: "David Kim",
  },
]

const statusConfig = {
  requested: { label: "Requested", color: "bg-gray-100 text-gray-800" },
  sent: { label: "Sent to Investor", color: "bg-blue-100 text-blue-800" },
  "pending-review": { label: "Pending Review", color: "bg-yellow-100 text-yellow-800" },
  "under-review": { label: "Under Review", color: "bg-orange-100 text-orange-800" },
  approved: { label: "Approved", color: "bg-green-100 text-green-800" },
  filed: { label: "Filed", color: "bg-purple-100 text-purple-800" },
}

const priorityConfig = {
  low: { label: "Low", color: "bg-green-100 text-green-800" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  high: { label: "High", color: "bg-red-100 text-red-800" },
}

export function TaxDocumentKanban() {
  const [selectedDocument, setSelectedDocument] = useState<TaxDocument | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleDocumentClick = (document: TaxDocument) => {
    setSelectedDocument(document)
    setIsDrawerOpen(true)
  }

  const getDocumentsByStatus = (status: TaxDocument["status"]) => {
    return mockTaxDocuments.filter((doc) => doc.status === status)
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const DocumentCard = ({ document }: { document: TaxDocument }) => (
    <Card
      className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => handleDocumentClick(document)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">{document.documentType}</CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Tax Year {document.taxYear}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Document</DropdownMenuItem>
              <DropdownMenuItem>Send Reminder</DropdownMenuItem>
              <DropdownMenuItem>View History</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Cancel Request</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Building2 className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{document.entity}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <User className="h-3 w-3 text-muted-foreground" />
            <span>{document.investor}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>Due: {new Date(document.dueDate).toLocaleDateString()}</span>
            {isOverdue(document.dueDate) && (
              <Badge variant="destructive" className="text-xs">
                Overdue
              </Badge>
            )}
          </div>
          {document.submittedDate && (
            <div className="flex items-center gap-2 text-xs">
              <FileText className="h-3 w-3 text-muted-foreground" />
              <span>Submitted: {new Date(document.submittedDate).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2">
            <Badge variant="secondary" className={`text-xs ${priorityConfig[document.priority].color}`}>
              {priorityConfig[document.priority].label}
            </Badge>
            {document.reviewer && <span className="text-xs text-muted-foreground">Reviewer: {document.reviewer}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const StatusColumn = ({
    status,
    title,
    documents,
  }: {
    status: TaxDocument["status"]
    title: string
    documents: TaxDocument[]
  }) => (
    <div className="flex-1 min-w-[300px]">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{title}</h3>
          <Badge variant="secondary" className="text-xs">
            {documents.length}
          </Badge>
        </div>
      </div>
      <div className="space-y-2">
        {documents.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </div>
    </div>
  )

  return (
    <>
      <div className="flex gap-6 overflow-x-auto pb-4">
        <StatusColumn status="requested" title="Requested" documents={getDocumentsByStatus("requested")} />
        <StatusColumn status="sent" title="Sent to Investor" documents={getDocumentsByStatus("sent")} />
        <StatusColumn
          status="pending-review"
          title="Pending Review"
          documents={getDocumentsByStatus("pending-review")}
        />
        <StatusColumn status="under-review" title="Under Review" documents={getDocumentsByStatus("under-review")} />
        <StatusColumn status="approved" title="Approved" documents={getDocumentsByStatus("approved")} />
        <StatusColumn status="filed" title="Filed" documents={getDocumentsByStatus("filed")} />
      </div>

      <MasterDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={selectedDocument ? `${selectedDocument.documentType} - ${selectedDocument.taxYear}` : ""}
      >
        {selectedDocument && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Document Type</label>
                <p className="text-sm">{selectedDocument.documentType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tax Year</label>
                <p className="text-sm">{selectedDocument.taxYear}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Entity</label>
                <p className="text-sm">{selectedDocument.entity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Investor</label>
                <p className="text-sm">{selectedDocument.investor}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                <p className="text-sm">{new Date(selectedDocument.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Filing Deadline</label>
                <p className="text-sm">{new Date(selectedDocument.filingDeadline).toLocaleDateString()}</p>
              </div>
              {selectedDocument.submittedDate && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Submitted Date</label>
                  <p className="text-sm">{new Date(selectedDocument.submittedDate).toLocaleDateString()}</p>
                </div>
              )}
              {selectedDocument.reviewer && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reviewer</label>
                  <p className="text-sm">{selectedDocument.reviewer}</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge className={statusConfig[selectedDocument.status].color}>
                  {statusConfig[selectedDocument.status].label}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Priority</label>
              <div className="mt-1">
                <Badge className={priorityConfig[selectedDocument.priority].color}>
                  {priorityConfig[selectedDocument.priority].label}
                </Badge>
              </div>
            </div>

            {selectedDocument.notes && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Notes</label>
                <p className="text-sm mt-1">{selectedDocument.notes}</p>
              </div>
            )}
          </div>
        )}
      </MasterDrawer>
    </>
  )
}
