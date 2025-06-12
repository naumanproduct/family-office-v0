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
  EyeIcon,
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
import { FileNameCell } from "./file-name-cell"

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

export function FileContent({ 
  data = defaultFiles, 
  viewMode: initialViewMode = "table", 
  onFileSelect,
  title = "Files" 
}: FileContentProps) {
  const [viewMode, setViewMode] = useState(initialViewMode)
  const [isAddFileSheetOpen, setIsAddFileSheetOpen] = useState(false)
  const [fileData, setFileData] = useState(data)

  const handleFileSelect = (file: any) => {
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
                  <TableRow key={file.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.fileType || file.type)}
                        <div>
                          <FileNameCell file={file} />
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
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                            <DotsHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <EyeIcon className="mr-2 h-4 w-4" />
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
                <div 
                  key={file.id} 
                  className="flex items-center justify-between border-b pb-4 cursor-pointer hover:bg-muted/50 rounded-md p-2"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.fileType || file.type)}
                    <div>
                      <FileNameCell file={file} />
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
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <DotsHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <DownloadIcon className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <EyeIcon className="mr-2 h-4 w-4" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {fileData.map((file) => (
            <Card key={file.id} className="cursor-pointer hover:bg-muted/50">
              <CardContent className="p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.fileType || file.type)}
                      <div className="w-full overflow-hidden">
                        <FileNameCell file={file} />
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
                        <DropdownMenuItem>
                          <EyeIcon className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{file.fileSize || file.size}</span>
                    <Badge variant="secondary" className="text-xs">
                      {(file.fileType || file.type || "FILE").toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-auto">
                    Uploaded {file.uploadedDate || new Date(file.uploadedAt).toLocaleDateString()} by {file.uploadedBy}
                  </div>
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
    </div>
  )
}
