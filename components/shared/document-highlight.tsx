"use client"

import * as React from "react"
import { SourceHighlight } from "./source-highlight-context"

export interface DocumentSourceHighlightProps {
  highlight: SourceHighlight | null;
}

// Component to display highlights directly on a document
export function DocumentSourceHighlight({ highlight }: DocumentSourceHighlightProps) {
  if (!highlight) return null;
  
  const { documentPosition } = highlight;
  const { top, left, width, height } = documentPosition.rect;
  
  return (
    <div 
      className="absolute bg-blue-200 bg-opacity-50 border-2 border-blue-500 pointer-events-none transition-all duration-300 animate-pulse"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: 50
      }}
    >
      <div className="absolute -top-7 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
        Source: {highlight.value}
      </div>
    </div>
  );
}

// Component that draws a connection line between the field and source
export function ConnectionLine({ highlight }: DocumentSourceHighlightProps) {
  const [position, setPosition] = React.useState({ 
    start: { x: 0, y: 0 }, 
    end: { x: 0, y: 0 } 
  });
  
  React.useEffect(() => {
    if (!highlight) return;
    
    // In a real implementation, this would calculate the position of both elements
    // and draw a line between them. For demo purposes, we're using fixed positions.
    setPosition({
      start: { x: window.innerWidth - 400, y: 400 },
      end: { x: highlight.documentPosition.rect.left + 50, y: highlight.documentPosition.rect.top + 50 }
    });
  }, [highlight]);
  
  if (!highlight) return null;
  
  return (
    <svg 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-40"
      style={{ zIndex: 9990 }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
        </marker>
      </defs>
      <line
        x1={position.start.x}
        y1={position.start.y}
        x2={position.end.x}
        y2={position.end.y}
        stroke="#3b82f6"
        strokeWidth="2"
        strokeDasharray="4"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
}

// Tooltip that appears when a source is highlighted
export function VerificationTooltip({ highlight }: DocumentSourceHighlightProps) {
  if (!highlight) return null;
  
  return (
    <div className="fixed z-[9999] bg-blue-50 border border-blue-200 shadow-lg rounded-md p-3 pointer-events-none transform -translate-x-1/2 max-w-xs">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 text-blue-500">📄</div>
        <span className="text-xs font-medium text-blue-700">Source Document</span>
      </div>
      <div className="text-xs text-blue-600 mt-1">
        Click to view and verify in document
      </div>
    </div>
  );
} 