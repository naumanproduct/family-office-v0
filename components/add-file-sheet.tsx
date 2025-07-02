"use client"

import { MasterCreationDialog } from "./master-creation-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { XIcon, FileIcon, FileTextIcon } from "lucide-react"
import { useState } from "react"

// Mock selected files for demonstration
const mockSelectedFiles = [
  {
    id: "file-1",
    name: "quarterly-report-q1-2024.pdf",
    type: "PDF",
    size: "1.2 MB",
    uploadedDate: "2024-05-21",
  },
  {
    id: "file-2",
    name: "financial-analysis.xlsx",
    type: "XLSX",
    size: "850 KB",
    uploadedDate: "2024-05-21",
  },
  {
    id: "file-3",
    name: "contract-draft-v2.docx",
    type: "DOCX",
    size: "540 KB",
    uploadedDate: "2024-05-21",
  }
]

// File source options
const fileTypes = [
  {
    id: "local",
    name: "My Computer",
    description: "Upload files from your device.",
    category: "Local",
    isCustom: true,
  },
  {
    id: "box",
    name: "Box",
    description: "Import files from your Box account.",
    category: "Integrations",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Import files from your Dropbox account.",
    category: "Integrations",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Import files from your Google Drive account.",
    category: "Integrations",
  },
  {
    id: "onedrive",
    name: "OneDrive",
    description: "Import files from your OneDrive account.",
    category: "Integrations",
  },
]

// Helper function to get file icon based on type
const getFileIcon = (fileType: string) => {
  switch (fileType.toUpperCase()) {
    case "PDF":
      return <FileTextIcon className="h-4 w-4 text-red-500" />
    case "DOCX":
    case "DOC":
      return <FileTextIcon className="h-4 w-4 text-blue-500" />
    case "XLSX":
    case "XLS":
      return <FileTextIcon className="h-4 w-4 text-green-500" />
    case "PPTX":
    case "PPT":
      return <FileTextIcon className="h-4 w-4 text-orange-500" />
    default:
      return <FileIcon className="h-4 w-4 text-gray-500" />
  }
}

// Selected Files Table Component
const SelectedFilesTable = ({ files, onRemoveFile }: { files: any[], onRemoveFile?: (id: string) => void }) => {
  if (!files || files.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No files selected</p>
  }
  
  return (
    <Card className="mb-6">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <div className="font-medium">{file.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {file.type.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>
                  {onRemoveFile && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => onRemoveFile(file.id)}
                    >
                      <XIcon className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Mock data for dropdowns
const mockInvestments = [
  { label: "Acme Corp Series A", value: "inv-1" },
  { label: "TechStart Seed Round", value: "inv-2" },
  { label: "GreenEnergy Series B", value: "inv-3" }
]

const mockOpportunities = [
  { label: "NewTech Acquisition", value: "opp-1" },
  { label: "Expansion Capital Raise", value: "opp-2" },
  { label: "Strategic Partnership", value: "opp-3" }
]

const mockEntities = [
  { label: "Acme Corporation", value: "ent-1" },
  { label: "XYZ Holdings", value: "ent-2" },
  { label: "ABC Ventures", value: "ent-3" }
]

// Define FormField type to match what MasterCreationDialog expects
interface FormField {
  id: string
  label: string
  type: "text" | "textarea" | "select" | "number" | "date" | "readonly"
  placeholder?: string
  required?: boolean
  options?: string[] | { value: string; label: string }[]
  defaultValue?: string
  rows?: number
  min?: number
  max?: number
  step?: number
  gridCols?: number
}

// Form fields configuration
const fileFormFields: FormField[] = [
  {
    id: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter file description",
    rows: 3,
  },
  {
    id: "category",
    label: "Category",
    type: "select",
    placeholder: "Select category",
    options: ["Legal", "Financial", "Due Diligence", "Marketing", "Agreements", "Other"],
  },
  {
    id: "relatedInvestment",
    label: "Related Investment",
    type: "select",
    placeholder: "Select investment",
    options: mockInvestments.map(i => ({ value: i.value, label: i.label })),
  },
  {
    id: "relatedOpportunity",
    label: "Related Opportunity",
    type: "select",
    placeholder: "Select opportunity",
    options: mockOpportunities.map(o => ({ value: o.value, label: o.label })),
  },
  {
    id: "relatedEntity",
    label: "Related Entity",
    type: "select",
    placeholder: "Select entity",
    options: mockEntities.map(e => ({ value: e.value, label: e.label })),
  },
  {
    id: "tags",
    label: "Tags",
    type: "text",
    placeholder: "Enter tags separated by commas",
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    placeholder: "Select status",
    options: ["Draft", "Under Review", "Final", "Approved"],
    defaultValue: "Draft",
  },
]

export interface FileFormData {
  name?: string;
  description?: string;
  category?: string;
  relatedInvestment?: string;
  relatedOpportunity?: string;
  relatedEntity?: string;
  tags?: string;
  status?: string;
  files?: File[];
  file?: File | null;
  source?: string;
  fileType?: string;
}

export interface AddFileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: FileFormData) => void;
}

export function AddFileSheet({ open, onOpenChange, onSubmit }: AddFileSheetProps) {
  const [selectedFiles, setSelectedFiles] = useState(mockSelectedFiles);

  const handleRemoveFile = (fileId: string) => {
    setSelectedFiles(selectedFiles.filter(file => file.id !== fileId));
  };

  const handleSave = (data: any) => {
    console.log("File data saved:", data)
    // Call the onSubmit callback with the data
    if (onSubmit) {
      onSubmit({
        ...data,
        files: selectedFiles
      });
    }
  }

  const handleTypeSelect = (type: any) => {
    // Return any type-specific default values
    return {
      fileType: type.id,
      source: type.id,
    }
  }

  // Files table to display in form header
  const filesTableContent = (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2">Selected Files</h3>
      <SelectedFilesTable files={selectedFiles} onRemoveFile={handleRemoveFile} />
    </div>
  );

  return (
    <MasterCreationDialog
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onSave={handleSave}
      title="Add New File"
      description="Upload a new file to the system"
      recordType="File"
      avatarLetter="F"
      avatarColor="bg-blue-600"
      types={fileTypes}
      typeSelectionTitle="Choose File Source"
      formFields={fileFormFields}
      formHeaderContent={filesTableContent}
      requiredFields={[]}
      onTypeSelect={handleTypeSelect}
    />
  )
}
