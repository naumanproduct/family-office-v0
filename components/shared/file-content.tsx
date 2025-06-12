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
  data = defaultFiles, 
  viewMode: initialViewMode = "table", 
  onFileSelect,
  title = "Files" 
}: FileContentProps) {
  const [viewMode, setViewMode] = useState(initialViewMode)
  const [isAddFileSheetOpen, setIsAddFileSheetOpen] = useState(false)
  const [fileData, setFileData] = useState(data)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false)

  // Define tabs for the MasterDrawer
  const fileTabs = [
    { id: "details", label: "Details", count: null, icon: FileTextIcon },
    { id: "tasks", label: "Tasks", count: 0, icon: ClockIcon },
    { id: "notes", label: "Notes", count: 0, icon: MessageSquareIcon },
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
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fileData.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => handleFileSelect(file)}
                      >
                        {getFileIcon(file.fileType || file.type)}
                        <div>
                          <div className="font-medium">{file.title || file.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {file.fileName || file.name} • {file.fileSize || file.size}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{file.fileSize || file.size}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {(file.fileType || file.type || "FILE").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{file.uploadedDate || new Date(file.uploadedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{file.uploadedBy}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <DotsHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFileSelect(file)}>
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {viewMode === "list" && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {fileData.map((file) => (
                <div key={file.id} className="flex items-center justify-between border-b pb-4 rounded-md p-2">
                  <div 
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => handleFileSelect(file)}
                  >
                    {getFileIcon(file.fileType || file.type)}
                    <div>
                      <div className="font-medium">{file.title || file.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {file.fileName || file.name} • {file.fileSize || file.size}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Uploaded {file.uploadedDate || new Date(file.uploadedAt).toLocaleDateString()} by {file.uploadedBy}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {(file.fileType || file.type || "FILE").toUpperCase()}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <DotsHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <DownloadIcon className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleFileSelect(file)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fileData.map((file) => (
            <Card key={file.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleFileSelect(file)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {getFileIcon(file.fileType || file.type)}
                      <h4 className="font-medium text-base">{file.title || file.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {file.fileName || file.name} • {file.fileSize || file.size}
                    </p>
                    <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
                      <p>Uploaded: {file.uploadedDate || new Date(file.uploadedAt).toLocaleDateString()}</p>
                      <p>By: {file.uploadedBy}</p>
                      {file.description && <p className="line-clamp-2">{file.description}</p>}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFileSelect(file)}>
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
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
