"use client"
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
import { useState } from "react"

const documents = [
  {
    id: "DOC-1234",
    title: "Investment Agreement - Acme Corp Series B",
    fileName: "acme-corp-series-b-agreement.pdf",
    fileType: "PDF",
    fileSize: "2.4 MB",
    uploadedAt: "2023-05-15T10:30:00Z",
    uploadedBy: "John Smith",
    category: "Legal",
    tags: ["investment", "agreement", "series-b"],
    relatedTo: { type: "Company", name: "Acme Corp" },
    status: "Final",
  },
  {
    id: "DOC-1235",
    title: "Due Diligence Report - XYZ Holdings",
    fileName: "xyz-holdings-dd-report.docx",
    fileType: "DOCX",
    fileSize: "5.1 MB",
    uploadedAt: "2023-05-14T09:15:00Z",
    uploadedBy: "Sarah Johnson",
    category: "Due Diligence",
    tags: ["due diligence", "report", "acquisition"],
    relatedTo: { type: "Entity", name: "XYZ Holdings" },
    status: "Draft",
  },
  {
    id: "DOC-1236",
    title: "Q1 Financial Statements - Tech Innovations Inc",
    fileName: "tech-innovations-q1-financials.xlsx",
    fileType: "XLSX",
    fileSize: "1.8 MB",
    uploadedAt: "2023-05-10T13:45:00Z",
    uploadedBy: "Michael Brown",
    category: "Financial",
    tags: ["financial", "quarterly", "statements"],
    relatedTo: { type: "Company", name: "Tech Innovations Inc" },
    status: "Final",
  },
  {
    id: "DOC-1237",
    title: "Partnership Agreement - Global Ventures",
    fileName: "global-ventures-partnership.pdf",
    fileType: "PDF",
    fileSize: "3.2 MB",
    uploadedAt: "2023-05-08T15:00:00Z",
    uploadedBy: "Emily Davis",
    category: "Legal",
    tags: ["partnership", "agreement", "legal"],
    relatedTo: { type: "Entity", name: "Global Ventures" },
    status: "Under Review",
  },
  {
    id: "DOC-1238",
    title: "Acquisition Proposal - Sunrise Manufacturing",
    fileName: "sunrise-manufacturing-proposal.pptx",
    fileType: "PPTX",
    fileSize: "4.7 MB",
    uploadedAt: "2023-05-05T11:20:00Z",
    uploadedBy: "Robert Wilson",
    category: "Proposal",
    tags: ["acquisition", "proposal", "presentation"],
    relatedTo: { type: "Company", name: "Sunrise Manufacturing" },
    status: "Final",
  },
]

const getFileIcon = (fileType: string) => {
  switch (fileType) {
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

export function DocumentsTable() {
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
              <DropdownMenuCheckboxItem>Title (A-Z)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Title (Z-A)</DropdownMenuCheckboxItem>
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
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Related To</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getFileIcon(document.fileType)}
                      <div>
                        <div className="font-medium">{document.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {document.fileName} • {document.fileSize}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{document.uploadedBy}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {document.relatedTo.type === "Company" ? (
                        <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{document.relatedTo.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{document.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        document.status === "Final" ? "default" : document.status === "Draft" ? "secondary" : "outline"
                      }
                    >
                      {document.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {document.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {document.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{document.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DotsHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <DownloadIcon className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>View</DropdownMenuItem>
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
    </div>
  )
}
