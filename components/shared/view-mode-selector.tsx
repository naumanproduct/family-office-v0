import * as React from "react"
import { LayoutGridIcon, ListIcon, TableIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ViewModeSelectorProps {
  viewMode: "card" | "list" | "table"
  onViewModeChange: (mode: "card" | "list" | "table") => void
  excludeModes?: ("card" | "list" | "table")[]
  className?: string
}

export function ViewModeSelector({ 
  viewMode, 
  onViewModeChange, 
  excludeModes = [],
  className = ""
}: ViewModeSelectorProps) {
  const modes = [
    { id: "card" as const, icon: LayoutGridIcon },
    { id: "list" as const, icon: ListIcon },
    { id: "table" as const, icon: TableIcon },
  ].filter(mode => !excludeModes.includes(mode.id))

  return (
    <div className={`flex items-center gap-1 rounded-lg border p-1 ${className}`}>
      {modes.map((mode) => (
        <Button
          key={mode.id}
          variant={viewMode === mode.id ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange(mode.id)}
          className="h-7 px-2"
        >
          <mode.icon className="h-3 w-3" />
        </Button>
      ))}
    </div>
  )
}
