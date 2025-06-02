"use client"

import * as React from "react"
import { XIcon, DownloadIcon, ShareIcon, PrinterIcon, ZoomInIcon, ZoomOutIcon, RotateCwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Document {
  id: string
  title: string
  fileName: string
  fileType: string
  fileSize: string
  uploadedAt: string
  uploadedBy: string
  category: string
  tags: string[]
  relatedTo: { type: string; name: string }
  status: string
}

interface DocumentViewerDrawerProps {
  document: Document | null
  isOpen: boolean
  onClose: () => void
}

export function DocumentViewerDrawer({ document, isOpen, onClose }: DocumentViewerDrawerProps) {
  const [zoom, setZoom] = React.useState(100)
  const [rotation, setRotation] = React.useState(0)

  if (!document) return null

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)

  const renderDocumentPreview = () => {
    switch (document.fileType) {
      case "PDF":
        return (
          <div className="flex-1 bg-gray-100 flex items-center justify-center">
            <div
              className="bg-white shadow-lg border rounded-lg p-8 max-w-4xl w-full mx-4"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: "center center",
              }}
            >
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="space-y-2 mt-8">
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                </div>
              </div>
              <div className="mt-8 text-center text-sm text-gray-500">PDF Preview - {document.fileName}</div>
            </div>
          </div>
        )
      case "DOCX":
        return (
          <div className="flex-1 bg-blue-50 flex items-center justify-center">
            <div
              className="bg-white shadow-lg border rounded-lg p-8 max-w-4xl w-full mx-4"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: "center center",
              }}
            >
              <div className="space-y-3">
                <div className="h-6 bg-blue-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-6 space-y-2">
                  <div className="h-5 bg-blue-100 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                </div>
              </div>
              <div className="mt-8 text-center text-sm text-gray-500">Word Document Preview - {document.fileName}</div>
            </div>
          </div>
        )
      case "XLSX":
        return (
          <div className="flex-1 bg-green-50 flex items-center justify-center">
            <div
              className="bg-white shadow-lg border rounded-lg p-4 max-w-4xl w-full mx-4"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: "center center",
              }}
            >
              <div className="grid grid-cols-4 gap-1">
                {/* Header row */}
                <div className="h-8 bg-green-200 rounded flex items-center justify-center text-xs font-medium">A</div>
                <div className="h-8 bg-green-200 rounded flex items-center justify-center text-xs font-medium">B</div>
                <div className="h-8 bg-green-200 rounded flex items-center justify-center text-xs font-medium">C</div>
                <div className="h-8 bg-green-200 rounded flex items-center justify-center text-xs font-medium">D</div>
                {/* Data rows */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <React.Fragment key={i}>
                    <div className="h-6 bg-gray-100 rounded"></div>
                    <div className="h-6 bg-gray-100 rounded"></div>
                    <div className="h-6 bg-gray-100 rounded"></div>
                    <div className="h-6 bg-gray-100 rounded"></div>
                  </React.Fragment>
                ))}
              </div>
              <div className="mt-8 text-center text-sm text-gray-500">
                Excel Spreadsheet Preview - {document.fileName}
              </div>
            </div>
          </div>
        )
      case "PPTX":
        return (
          <div className="flex-1 bg-orange-50 flex items-center justify-center">
            <div
              className="bg-white shadow-lg border rounded-lg p-8 max-w-4xl w-full mx-4"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: "center center",
              }}
            >
              <div className="space-y-6">
                <div className="h-8 bg-orange-200 rounded w-3/4 mx-auto"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-100 rounded w-4/5"></div>
                </div>
              </div>
              <div className="mt-8 text-center text-sm text-gray-500">
                PowerPoint Presentation Preview - {document.fileName}
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex-1 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="h-24 w-24 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-gray-400">📄</span>
              </div>
              <p className="text-gray-500">Preview not available for this file type</p>
              <p className="text-sm text-gray-400 mt-1">{document.fileName}</p>
            </div>
          </div>
        )
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] flex flex-col p-0 [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-background px-6 py-4">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-semibold">{document.title}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{document.fileName}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>{document.fileSize}</span>
                <Separator orientation="vertical" className="h-4" />
                <Badge variant="outline">{document.fileType}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
              <ZoomOutIcon className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[3rem] text-center">{zoom}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
              <ZoomInIcon className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="outline" size="sm" onClick={handleRotate}>
              <RotateCwIcon className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="outline" size="sm">
              <PrinterIcon className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <ShareIcon className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="icon" onClick={onClose}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Document Preview */}
        <div className="flex-1 overflow-auto">{renderDocumentPreview()}</div>

        {/* Footer with document info */}
        <div className="border-t bg-muted/50 px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span>Uploaded by {document.uploadedBy}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Category: {document.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Related to:</span>
              <Badge variant="secondary">{document.relatedTo.name}</Badge>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
