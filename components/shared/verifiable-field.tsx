"use client"

import * as React from "react"
import { FileTextIcon } from "lucide-react"
import { useSourceHighlight, getFieldSource } from "@/components/shared/source-highlight-context"

interface VerifiableFieldProps {
  label: string;
  value: React.ReactNode;
  fieldId: string;
  className?: string;
}

// A component for verifiable field values with document source linking
export function VerifiableField({
  label,
  value,
  fieldId,
  className = ""
}: VerifiableFieldProps) {
  const { highlight, setHighlight } = useSourceHighlight();
  const [showTooltip, setShowTooltip] = React.useState(false);
  const fieldRef = React.useRef<HTMLDivElement>(null);

  // Check if this field has document source
  const hasSource = fieldId !== undefined;

  const handleMouseEnter = () => {
    if (hasSource) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleClick = () => {
    if (!hasSource) return;
    
    // Get source details and toggle highlighting
    const source = getFieldSource(fieldId);
    console.log("Field clicked:", fieldId, "Source:", source);
    
    if (source) {
      // Toggle highlight - if same field is clicked again, remove highlight
      if (highlight?.fieldId === fieldId) {
        setHighlight(null);
      } else {
        setHighlight(source);
      }
    }
  };

  return (
    <div
      className="flex items-center relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={fieldRef}
    >
      <span className={`text-xs text-muted-foreground w-28 shrink-0 ml-2 ${className}`}>{label}</span>
      <div
        className={`
          flex-1 text-sm px-2 py-0.5 rounded transition-colors flex items-center gap-1
          ${hasSource ? 'cursor-pointer hover:bg-blue-50 group' : ''}
          ${highlight?.fieldId === fieldId ? 'bg-blue-100 ring-2 ring-blue-300' : ''}
        `}
        onClick={handleClick}
      >
        <span>{value}</span>
        {hasSource && (
          <FileTextIcon
            className={`h-3 w-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity
              ${highlight?.fieldId === fieldId ? 'opacity-100' : ''}
            `}
          />
        )}
      </div>

      {showTooltip && hasSource && fieldRef.current && (
        <div
          className="absolute -top-8 left-32 bg-blue-50 text-blue-700 text-xs py-1 px-2 rounded pointer-events-none z-50"
          style={{ whiteSpace: 'nowrap' }}
        >
          Click to verify source
        </div>
      )}
    </div>
  );
} 