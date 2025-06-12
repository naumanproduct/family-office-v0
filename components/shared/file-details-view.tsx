"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  DownloadIcon, 
  FileIcon, 
  FileTextIcon,
  InfoIcon, 
  CalendarIcon,
  UserIcon,
  TagIcon,
  FolderIcon,
  FileTypeIcon,
  CheckCircleIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export interface FileDetailsProps {
  file: any
  isFullScreen?: boolean
}

export function FileDetailsView({ file, isFullScreen = false }: FileDetailsProps) {
  // Helper function to get file icon based on type
  const getFileIcon = (fileType: string) => {
    switch (fileType?.toUpperCase()) {
      case "PDF":
        return <FileTextIcon className="h-5 w-5 text-red-500" />
      case "DOCX":
      case "DOC":
        return <FileTextIcon className="h-5 w-5 text-blue-500" />
      case "XLSX":
      case "XLS":
        return <FileTextIcon className="h-5 w-5 text-green-500" />
      case "PPTX":
      case "PPT":
        return <FileTextIcon className="h-5 w-5 text-orange-500" />
      default:
        return <FileIcon className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className={`flex flex-col gap-4 ${isFullScreen ? 'p-6' : ''}`}>
      {/* Header with download button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getFileIcon(file.fileType || file.type)}
          <div>
            <h3 className="text-lg font-semibold">{file.title || file.name}</h3>
            <p className="text-sm text-muted-foreground">
              {file.fileName || file.name}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
      
      <Separator />

      {/* File info */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center">
                <InfoIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                File Information
              </h4>
              <dl className="space-y-2">
                <div className="flex items-start justify-between">
                  <dt className="text-sm text-muted-foreground">Size</dt>
                  <dd className="text-sm font-medium">{file.fileSize || file.size}</dd>
                </div>
                <div className="flex items-start justify-between">
                  <dt className="text-sm text-muted-foreground">Type</dt>
                  <dd className="text-sm font-medium">
                    <Badge variant="secondary" className="text-xs">
                      {(file.fileType || file.type || "FILE").toUpperCase()}
                    </Badge>
                  </dd>
                </div>
                <div className="flex items-start justify-between">
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd className="text-sm font-medium">
                    <Badge variant="outline" className="text-xs">
                      {file.status || "Draft"}
                    </Badge>
                  </dd>
                </div>
                <div className="flex items-start justify-between">
                  <dt className="text-sm text-muted-foreground">Category</dt>
                  <dd className="text-sm font-medium">{file.category || "Uncategorized"}</dd>
                </div>
              </dl>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center">
                <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                Uploaded Information
              </h4>
              <dl className="space-y-2">
                <div className="flex items-start justify-between">
                  <dt className="text-sm text-muted-foreground">Uploaded By</dt>
                  <dd className="text-sm font-medium">{file.uploadedBy}</dd>
                </div>
                <div className="flex items-start justify-between">
                  <dt className="text-sm text-muted-foreground">Upload Date</dt>
                  <dd className="text-sm font-medium">
                    {file.uploadedDate || new Date(file.uploadedAt).toLocaleDateString()}
                  </dd>
                </div>
                {file.lastModified && (
                  <div className="flex items-start justify-between">
                    <dt className="text-sm text-muted-foreground">Last Modified</dt>
                    <dd className="text-sm font-medium">
                      {file.lastModifiedDate || new Date(file.lastModified).toLocaleDateString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {file.description && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Description</h4>
          <p className="text-sm text-muted-foreground">{file.description}</p>
        </div>
      )}

      {/* Tags */}
      {file.tags && file.tags.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center">
            <TagIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {file.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Related records */}
      {file.relatedTo && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center">
            <FolderIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            Related Records
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded-md border">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-medium">
                  {file.relatedTo.type?.charAt(0) || "R"}
                </div>
                <div>
                  <p className="text-sm font-medium">{file.relatedTo.name}</p>
                  <p className="text-xs text-muted-foreground">{file.relatedTo.type}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 