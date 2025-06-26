"use client"
import { useState } from "react"
import {
  CalendarIcon,
  ChevronDownIcon,
  DotIcon as DotsHorizontalIcon,
  SearchIcon,
  SortAscIcon,
  TagIcon,
  UserIcon,
  BuildingIcon,
  FileTextIcon,
  DownloadIcon,
  FileIcon,
  PlusIcon,
  LayoutGridIcon,
  ListIcon,
  TableIcon,
  ClockIcon,
  MessageSquareIcon,
  MailIcon,
  FolderIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ViewModeSelector } from "@/components/shared/view-mode-selector"
import { AddFileSheet, FileFormData } from "@/components/add-file-sheet"
import { MasterDrawer } from "@/components/master-drawer"
import { TabContentRenderer } from "@/components/shared/tab-content-renderer"
import { Label } from "@/components/ui/label"
import { DocumentViewer } from "@/components/document-viewer"
import { RecordListItem } from "@/components/shared/record-list-item"
import { RecordCard } from "@/components/shared/record-card"

// Function to get context-specific files based on task title
export function getContextualFiles(taskTitle?: string) {
  // Main task: Update capital schedule – Call #4
  if (!taskTitle || taskTitle.includes("Update capital schedule – Call #4")) {
    return [
      {
        id: "DOC-4001",
        title: "Growth Fund III - Limited Partnership Agreement",
        name: "GF3-LPA-Final-Executed.pdf",
        fileName: "GF3-LPA-Final-Executed.pdf",
        fileType: "PDF",
        type: "pdf",
        fileSize: "8.2 MB",
        size: "8.2 MB",
        uploadedAt: "2023-01-15T10:30:00Z",
        uploadedBy: "Legal Department",
        uploadedDate: "9 months ago",
        category: "Legal",
        tags: ["lpa", "fund documents", "commitments"],
        relatedTo: { type: "Fund", name: "Growth Fund III" },
        status: "Final",
        description: "Executed limited partnership agreement with all LP commitments and capital call provisions."
      },
      {
        id: "DOC-4002",
        title: "Capital Call History - Calls #1-3",
        name: "GF3-Capital-Call-History.xlsx",
        fileName: "GF3-Capital-Call-History.xlsx",
        fileType: "XLSX",
        type: "xlsx",
        fileSize: "1.8 MB",
        size: "1.8 MB",
        uploadedAt: "2023-10-15T09:15:00Z",
        uploadedBy: "Michael Chen",
        uploadedDate: "7 days ago",
        category: "Financial",
        tags: ["capital calls", "history", "tracking"],
        relatedTo: { type: "Fund", name: "Growth Fund III" },
        status: "Current",
        description: "Complete history of capital calls #1-3 with LP responses and payment tracking."
      },
      {
        id: "DOC-4003",
        title: "TechVantage Solutions - Investment Memo",
        name: "TechVantage-Investment-Memo-Final.pdf",
        fileName: "TechVantage-Investment-Memo-Final.pdf",
        fileType: "PDF",
        type: "pdf",
        fileSize: "3.4 MB",
        size: "3.4 MB",
        uploadedAt: "2023-10-10T14:20:00Z",
        uploadedBy: "Investment Committee",
        uploadedDate: "12 days ago",
        category: "Investment",
        tags: ["investment memo", "techvantage", "acquisition"],
        relatedTo: { type: "Company", name: "TechVantage Solutions" },
        status: "Approved",
        description: "IC-approved investment memorandum for TechVantage acquisition requiring $15M capital call."
      },
    ];
  }
  
  // Subtask 1: Calculate pro-rata allocation
  else if (taskTitle.includes("Calculate pro-rata allocation")) {
    return [
      {
        id: "DOC-4101",
        title: "LP Commitment Schedule - Current",
        name: "LP-Commitment-Schedule-Q4-2023.xlsx",
        fileName: "LP-Commitment-Schedule-Q4-2023.xlsx",
        fileType: "XLSX",
        type: "xlsx",
        fileSize: "856 KB",
        size: "856 KB",
        uploadedAt: "2023-10-19T10:00:00Z",
        uploadedBy: "Michael Chen",
        uploadedDate: "3 days ago",
        category: "Financial",
        tags: ["lp commitments", "allocation", "percentages"],
        relatedTo: { type: "Fund", name: "Growth Fund III" },
        status: "Current",
        description: "Updated LP commitment percentages after Q3 secondary transaction."
      },
      {
        id: "DOC-4102",
        title: "Pro-Rata Calculation Template",
        name: "Capital-Call-ProRata-Template.xlsx",
        fileName: "Capital-Call-ProRata-Template.xlsx",
        fileType: "XLSX",
        type: "xlsx",
        fileSize: "245 KB",
        size: "245 KB",
        uploadedAt: "2023-06-01T11:30:00Z",
        uploadedBy: "Robert Kim",
        uploadedDate: "4 months ago",
        category: "Template",
        tags: ["template", "calculations", "pro-rata"],
        relatedTo: { type: "Process", name: "Capital Call Process" },
        status: "Active",
        description: "Standard template for calculating LP pro-rata allocations."
      }
    ];
  }
  
  // Subtask 2: Update LP capital accounts
  else if (taskTitle.includes("Update LP capital accounts")) {
    return [
      {
        id: "DOC-4201",
        title: "LP Portal Update Guide",
        name: "LP-Portal-Capital-Account-Guide.pdf",
        fileName: "LP-Portal-Capital-Account-Guide.pdf",
        fileType: "PDF",
        type: "pdf",
        fileSize: "1.2 MB",
        size: "1.2 MB",
        uploadedAt: "2023-09-15T08:45:00Z",
        uploadedBy: "David Park",
        uploadedDate: "1 month ago",
        category: "Documentation",
        tags: ["guide", "lp portal", "capital accounts"],
        relatedTo: { type: "System", name: "LP Portal" },
        status: "Current",
        description: "Step-by-step guide for updating capital accounts in the LP portal system."
      },
      {
        id: "DOC-4202",
        title: "Capital Account Reconciliation - Call #3",
        name: "Call3-Capital-Account-Recon.xlsx",
        fileName: "Call3-Capital-Account-Recon.xlsx",
        fileType: "XLSX",
        type: "xlsx",
        fileSize: "1.5 MB",
        size: "1.5 MB",
        uploadedAt: "2023-08-20T16:00:00Z",
        uploadedBy: "Jessica Martinez",
        uploadedDate: "2 months ago",
        category: "Financial",
        tags: ["reconciliation", "capital accounts", "call #3"],
        relatedTo: { type: "Fund", name: "Growth Fund III" },
        status: "Completed",
        description: "Previous capital account reconciliation for reference."
      }
    ];
  }
  
  // Subtask 3: Generate capital call notices
  else if (taskTitle.includes("Generate capital call notices")) {
    return [
      {
        id: "DOC-4301",
        title: "Capital Call Notice Template v2.1",
        name: "Capital-Call-Notice-Template-v2.1.docx",
        fileName: "Capital-Call-Notice-Template-v2.1.docx",
        fileType: "DOCX",
        type: "docx",
        fileSize: "125 KB",
        size: "125 KB",
        uploadedAt: "2023-09-25T14:30:00Z",
        uploadedBy: "Legal Department",
        uploadedDate: "4 weeks ago",
        category: "Template",
        tags: ["template", "capital call notice", "legal approved"],
        relatedTo: { type: "Process", name: "Capital Call Process" },
        status: "Approved",
        description: "Latest legal-approved capital call notice template with digital signature fields."
      },
      {
        id: "DOC-4302",
        title: "LP Communication Preferences",
        name: "LP-Communication-Preferences.xlsx",
        fileName: "LP-Communication-Preferences.xlsx",
        fileType: "XLSX",
        type: "xlsx",
        fileSize: "89 KB",
        size: "89 KB",
        uploadedAt: "2023-10-20T09:00:00Z",
        uploadedBy: "Investor Relations",
        uploadedDate: "2 days ago",
        category: "Contact Info",
        tags: ["lp contacts", "preferences", "communication"],
        relatedTo: { type: "Process", name: "LP Communication" },
        status: "Current",
        description: "Updated LP contact preferences and special instructions for capital call notices."
      },
      {
        id: "DOC-4303",
        title: "Wire Instructions - Fund III",
        name: "GF3-Wire-Instructions-Current.pdf",
        fileName: "GF3-Wire-Instructions-Current.pdf",
        fileType: "PDF",
        type: "pdf",
        fileSize: "245 KB",
        size: "245 KB",
        uploadedAt: "2023-10-01T10:15:00Z",
        uploadedBy: "Treasury Department",
        uploadedDate: "3 weeks ago",
        category: "Banking",
        tags: ["wire instructions", "banking", "capital calls"],
        relatedTo: { type: "Fund", name: "Growth Fund III" },
        status: "Active",
        description: "Current wire instructions for LP capital contributions."
      }
    ];
  }
  
  // Subtask 4: Update fund commitment tracker
  else if (taskTitle.includes("Update fund commitment tracker")) {
    return [
      {
        id: "DOC-4401",
        title: "Fund Commitment Tracker v3.4",
        name: "GF3-Commitment-Tracker-v3.4.xlsx",
        fileName: "GF3-Commitment-Tracker-v3.4.xlsx",
        fileType: "XLSX",
        type: "xlsx",
        fileSize: "2.8 MB",
        size: "2.8 MB",
        uploadedAt: "2023-10-15T11:00:00Z",
        uploadedBy: "Michael Chen",
        uploadedDate: "1 week ago",
        category: "Financial",
        tags: ["tracker", "commitments", "master file"],
        relatedTo: { type: "Fund", name: "Growth Fund III" },
        status: "Current",
        description: "Master commitment tracker - must be updated after each capital call."
      },
      {
        id: "DOC-4402",
        title: "IC Reporting Template - 75% Threshold",
        name: "IC-Reporting-Template-75pct.pptx",
        fileName: "IC-Reporting-Template-75pct.pptx",
        fileType: "PPTX",
        type: "pptx",
        fileSize: "1.1 MB",
        size: "1.1 MB",
        uploadedAt: "2023-10-18T15:30:00Z",
        uploadedBy: "Thomas Wong",
        uploadedDate: "4 days ago",
        category: "Reporting",
        tags: ["ic reporting", "template", "75% threshold"],
        relatedTo: { type: "Process", name: "IC Reporting" },
        status: "Ready",
        description: "Template for quarterly IC reporting once 75% capital threshold is reached."
      }
    ];
  }
  
  // Subtask 5: Reconcile capital schedule
  else if (taskTitle.includes("Reconcile capital schedule")) {
    return [
      {
        id: "DOC-4501",
        title: "Reconciliation Checklist & Procedures",
        name: "Capital-Schedule-Recon-Procedures.pdf",
        fileName: "Capital-Schedule-Recon-Procedures.pdf",
        fileType: "PDF",
        type: "pdf",
        fileSize: "890 KB",
        size: "890 KB",
        uploadedAt: "2023-09-01T12:00:00Z",
        uploadedBy: "Fund Accounting",
        uploadedDate: "7 weeks ago",
        category: "Procedures",
        tags: ["reconciliation", "procedures", "checklist"],
        relatedTo: { type: "Process", name: "Capital Reconciliation" },
        status: "Current",
        description: "Standard operating procedures for capital schedule reconciliation."
      },
      {
        id: "DOC-4502",
        title: "Call #3 Reconciliation Report",
        name: "Call3-Recon-Report-Final.pdf",
        fileName: "Call3-Recon-Report-Final.pdf",
        fileType: "PDF",
        type: "pdf",
        fileSize: "1.6 MB",
        size: "1.6 MB",
        uploadedAt: "2023-08-25T17:00:00Z",
        uploadedBy: "Jessica Martinez",
        uploadedDate: "2 months ago",
        category: "Reports",
        tags: ["reconciliation", "report", "call #3"],
        relatedTo: { type: "Fund", name: "Growth Fund III" },
        status: "Completed",
        description: "Final reconciliation report from Call #3 showing FX adjustment issue."
      },
      {
        id: "DOC-4503",
        title: "Fund Accounting Export - Current",
        name: "Fund-Accounting-Export-Oct22.csv",
        fileName: "Fund-Accounting-Export-Oct22.csv",
        fileType: "CSV",
        type: "csv",
        fileSize: "342 KB",
        size: "342 KB",
        uploadedAt: "2023-10-22T08:00:00Z",
        uploadedBy: "Fund Accounting System",
        uploadedDate: "Today",
        category: "Data Export",
        tags: ["accounting data", "export", "reconciliation"],
        relatedTo: { type: "System", name: "Fund Accounting" },
        status: "Fresh",
        description: "Latest accounting system export for reconciliation purposes."
      }
    ];
  }
  
  // Default case - return general files
  else {
    return defaultFiles;
  }
}

// Default mock data, can be overridden by passing data prop
const defaultFiles = [
  {
    id: "DOC-1234",
    title: "Investment Agreement - Acme Corp Series B",
    name: "acme-corp-series-b-agreement.pdf",
    fileName: "acme-corp-series-b-agreement.pdf",
    fileType: "PDF",
    type: "pdf",
    fileSize: "2.4 MB",
    size: "2.4 MB",
    uploadedAt: "2023-05-15T10:30:00Z",
    uploadedBy: "John Smith",
    uploadedDate: "2 days ago",
    category: "Legal",
    tags: ["investment", "agreement", "series-b"],
    relatedTo: { type: "Company", name: "Acme Corp" },
    status: "Final",
    description: "Original investment agreement and terms."
  },
  {
    id: "DOC-1235",
    title: "Due Diligence Report - XYZ Holdings",
    name: "xyz-holdings-dd-report.docx",
    fileName: "xyz-holdings-dd-report.docx",
    fileType: "DOCX",
    type: "docx",
    fileSize: "5.1 MB",
    size: "5.1 MB",
    uploadedAt: "2023-05-14T09:15:00Z",
    uploadedBy: "Sarah Johnson",
    uploadedDate: "3 days ago",
    category: "Due Diligence",
    tags: ["due diligence", "report", "acquisition"],
    relatedTo: { type: "Entity", name: "XYZ Holdings" },
    status: "Draft",
    description: "Comprehensive due diligence report."
  },
  // More files can be added here
]

const getFileIcon = (fileType: string) => {
  switch (fileType?.toUpperCase()) {
    case "PDF":
      return <FileTextIcon className="h-4 w-4 text-red-500" />
    case "DOCX":
      return <FileTextIcon className="h-4 w-4 text-blue-500" />
    case "XLSX":
      return <FileTextIcon className="h-4 w-4 text-green-500" />
    case "PPTX":
      return <FileTextIcon className="h-4 w-4 text-orange-500" />
    default:
      return <FileIcon className="h-4 w-4 text-gray-500" />
  }
}

export type FileContentProps = {
  data?: any[] // Optional - if not provided, uses default mock data
  viewMode?: "table" | "card" | "list" // Optional - defaults to table
  onFileSelect?: (file: any) => void // Optional - callback when a file is selected
  title?: string // Optional - section title
  taskTitle?: string // Optional - used to contextually filter files
}

// File details panel component for use in the drawer
function FileDetailsPanel({ file, isFullScreen = false }: { file: any; isFullScreen?: boolean }) {
  // Guard against null file
  if (!file) {
    return (
      <div className={`px-6 py-4 flex items-center justify-center ${isFullScreen ? 'h-[calc(100vh-73px)]' : 'h-[300px]'}`}>
        <p className="text-muted-foreground">Select a file to view details</p>
      </div>
    );
  }

  // State for collapsible sections
  const [openSections, setOpenSections] = useState({
    details: true,
    metadata: false,
    related: false,
  });

  // Toggle function for collapsible sections
  const toggleSection = (section: 'details' | 'metadata' | 'related') => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className={`px-6 py-4 space-y-6 ${isFullScreen ? 'overflow-y-auto max-h-[calc(100vh-73px)]' : ''}`}>
      {/* Details Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Details</h3>
          <Button variant="ghost" size="sm" onClick={() => toggleSection('details')}>
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${openSections.details ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        {openSections.details && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex flex-col">
                <Label className="text-xs text-muted-foreground">File Name</Label>
                <span>{file.fileName || file.name || "Untitled"}</span>
              </div>
              <div className="flex flex-col">
                <Label className="text-xs text-muted-foreground">Title</Label>
                <span>{file.title || file.name || "Untitled"}</span>
              </div>
              <div className="flex flex-col">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <span>{file.description || "No description provided"}</span>
              </div>
              <div className="flex flex-col">
                <Label className="text-xs text-muted-foreground">Category</Label>
                <span>{file.category || "Uncategorized"}</span>
              </div>
              <div className="flex flex-col">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <span>{file.status || "Unknown"}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Metadata Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Metadata</h3>
          <Button variant="ghost" size="sm" onClick={() => toggleSection('metadata')}>
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${openSections.metadata ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        {openSections.metadata && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex flex-col">
                <Label className="text-xs text-muted-foreground">File Type</Label>
                <span>{(file.fileType || file.type || "FILE").toUpperCase()}</span>
              </div>
              <div className="flex flex-col">
                <Label className="text-xs text-muted-foreground">Size</Label>
                <span>{file.fileSize || file.size || "Unknown"}</span>
              </div>
              <div className="flex flex-col">
                <Label className="text-xs text-muted-foreground">Uploaded By</Label>
                <span>{file.uploadedBy || "Unknown"}</span>
              </div>
              <div className="flex flex-col">
                <Label className="text-xs text-muted-foreground">Upload Date</Label>
                <span>{file.uploadedDate || (file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : "Unknown")}</span>
              </div>
              <div className="flex flex-col">
                <Label className="text-xs text-muted-foreground">Tags</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {file.tags && Array.isArray(file.tags) && file.tags.length > 0 ? (
                    file.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">No tags</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Related</h3>
          <Button variant="ghost" size="sm" onClick={() => toggleSection('related')}>
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${openSections.related ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        {openSections.related && (
          <div className="space-y-4">
            {file.relatedTo ? (
              <div className="flex items-center gap-2">
                {file.relatedTo.type === "Company" ? <BuildingIcon className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                <span>{file.relatedTo.name}</span>
                <Badge variant="outline" className="ml-2">
                  {file.relatedTo.type}
                </Badge>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No related records</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function FileContent({ 
  data, 
  viewMode: initialViewMode = "table", 
  onFileSelect,
  title = "Files",
  taskTitle
}: FileContentProps) {
  const [viewMode, setViewMode] = useState(initialViewMode)
  const [isAddFileSheetOpen, setIsAddFileSheetOpen] = useState(false)
  // Use contextual files if no data is provided
  const initialData = data || getContextualFiles(taskTitle);
  const [fileData, setFileData] = useState(initialData)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false)

  // Define tabs for the MasterDrawer
  const fileTabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 0, icon: ClockIcon },
    { id: "notes", label: "Notes", count: 0, icon: FileIcon },
    { id: "emails", label: "Emails", count: 0, icon: MailIcon },
  ]

  const handleFileSelect = (file: any) => {
    setSelectedFile(file)
    setIsDocumentViewerOpen(true)
    
    if (onFileSelect) {
      onFileSelect(file)
    }
  }

  const handleFileUpload = (uploadData: FileFormData) => {
    // Create a new file object with the provided data and some defaults
    const newFile = {
      id: `file-${Date.now()}`,
      title: uploadData.name || `New ${uploadData.fileType || 'File'}`,
      name: uploadData.name || `file-${Date.now()}.pdf`,
      description: uploadData.description || "",
      fileName: uploadData.name || `file-${Date.now()}.pdf`,
      fileSize: "1.2 MB", // Mock size
      uploadedAt: new Date().toISOString(),
      uploadedBy: "Current User",
      fileType: uploadData.fileType || "document",
      type: uploadData.fileType || "document",
      category: uploadData.category || "Other",
      tags: uploadData.tags ? uploadData.tags.split(",").map(tag => tag.trim()) : [],
      status: uploadData.status || "Draft",
    }

    // Add the new file to the data
    setFileData([newFile, ...fileData])
    console.log("File uploaded:", newFile)
  }

  // Function to render tab content for the MasterDrawer
  const renderTabContent = (
    activeTab: string,
    viewMode: "card" | "list" | "table",
    setSelectedTask?: (task: any) => void,
    setSelectedNote?: (note: any) => void,
    setSelectedMeeting?: (meeting: any) => void,
    setSelectedEmail?: (email: any) => void,
  ) => {
    if (activeTab === "details") {
      return <FileDetailsPanel file={selectedFile} />
    }

    // For other tabs, use TabContentRenderer
    const tabData: any[] = []
    
    // Create a handler for "add" actions for empty states
    const handleAdd = () => {
      if (selectedFile) {
        console.log(`Add new ${activeTab.slice(0, -1)} for ${selectedFile.name || selectedFile.title || "File"}`)
      }
    }

    return (
      <TabContentRenderer
        activeTab={activeTab}
        viewMode={viewMode}
        data={tabData}
        onTaskClick={setSelectedTask}
        onNoteClick={setSelectedNote}
        onEmailClick={setSelectedEmail}
        onAdd={handleAdd}
      />
    )
  }

  // Function to render details panel for the MasterDrawer
  const renderDetailsPanel = (isFullScreen = false) => {
    return <FileDetailsPanel file={selectedFile} isFullScreen={isFullScreen} />
  }

  // Get file icon and type for the subtitle
  const getFileTypeDisplay = (file: any) => {
    if (!file) return "FILE";
    const fileType = (file.fileType || file.type || "FILE").toUpperCase()
    return fileType
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search files..." className="w-full bg-background pl-8" />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <SortAscIcon className="mr-2 h-3.5 w-3.5" />
                Sort
                <ChevronDownIcon className="ml-2 h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Date (newest first)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Date (oldest first)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Name (A-Z)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Name (Z-A)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>File Size (largest first)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>File Size (smallest first)</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <TagIcon className="mr-2 h-3.5 w-3.5" />
                Filter
                <ChevronDownIcon className="ml-2 h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs">Category</DropdownMenuLabel>
              <DropdownMenuCheckboxItem>Legal</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Financial</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Due Diligence</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Proposal</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs">File Type</DropdownMenuLabel>
              <DropdownMenuCheckboxItem>PDF</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>DOCX</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>XLSX</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>PPTX</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs">Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem>Final</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Under Review</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ViewModeSelector viewMode={viewMode} onViewModeChange={setViewMode} />
          <Button size="sm" onClick={() => setIsAddFileSheetOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add File
          </Button>
        </div>
      </div>

      {viewMode === "table" && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fileData.map((file) => (
                <TableRow 
                  key={file.id} 
                  className="cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleFileSelect(file)}
                >
                  <TableCell className="w-12">
                    <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="font-medium text-sm">{file.name || file.title}</TableCell>
                  <TableCell className="text-sm">{file.uploadedBy}</TableCell>
                  <TableCell className="text-sm">{file.uploadedDate || new Date(file.uploadedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-sm">{file.fileSize || file.size}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <DotsHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleFileSelect(file);
                        }}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {viewMode === "list" && (
        <div className="divide-y">
          {fileData.map((file) => (
            <RecordListItem
              key={file.id}
              title={file.name || file.title}
              primaryMetadata={[
                <Badge key="size" variant="outline">
                  {file.size || file.fileSize}
                </Badge>
              ]}
              secondaryMetadata={{
                left: file.uploadedBy,
                right: file.uploadedDate || file.date
              }}
              onClick={() => handleFileSelect(file)}
              actions={[
                { label: "View", onClick: () => handleFileSelect(file) },
                { label: "Download", onClick: () => {} },
                { label: "Delete", onClick: () => {}, variant: "destructive" as const },
              ]}
              leadingElement={<FileTextIcon className="h-4 w-4 text-muted-foreground" />}
            />
          ))}
        </div>
      )}

      {viewMode === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fileData.map((file) => (
            <RecordCard
              key={file.id}
              title={file.name || file.title}
              primaryMetadata={[
                <Badge key="size" variant="outline">
                  {file.size || file.fileSize}
                </Badge>
              ]}
              secondaryMetadata={{
                left: file.uploadedBy,
                right: file.uploadedDate || file.date
              }}
              onClick={() => handleFileSelect(file)}
              actions={[
                { label: "View", onClick: () => handleFileSelect(file) },
                { label: "Download", onClick: () => {} },
                { label: "Delete", onClick: () => {}, variant: "destructive" as const },
              ]}
              leadingElement={<FileTextIcon className="h-4 w-4 text-muted-foreground" />}
            />
          ))}
        </div>
      )}

      <AddFileSheet 
        open={isAddFileSheetOpen}
        onOpenChange={setIsAddFileSheetOpen}
        onSubmit={handleFileUpload}
      />

      <DocumentViewer 
        isOpen={isDocumentViewerOpen} 
        onOpenChange={setIsDocumentViewerOpen} 
        file={selectedFile} 
      />
    </div>
  )
}
