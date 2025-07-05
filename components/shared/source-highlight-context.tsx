"use client"

import * as React from "react"
import { createContext, useContext, useState } from "react"

// Source Highlight interface for document-based value verification
export interface SourceHighlight {
  fieldId: string;
  sourceId: string;
  documentPosition: {
    page: number;
    rect: { top: number; left: number; width: number; height: number };
  };
  value: string;
}

// Context for managing highlighted sources
interface SourceHighlightContextType {
  highlight: SourceHighlight | null;
  setHighlight: (highlight: SourceHighlight | null) => void;
}

// Create the context with default values
const SourceHighlightContext = createContext<SourceHighlightContextType>({
  highlight: null,
  setHighlight: () => {}
});

// Provider component
export function SourceHighlightProvider({ children }: { children: React.ReactNode }) {
  const [highlight, setHighlight] = useState<SourceHighlight | null>(null);
  
  return (
    <SourceHighlightContext.Provider value={{ highlight, setHighlight }}>
      {children}
    </SourceHighlightContext.Provider>
  );
}

// Hook for using the context
export function useSourceHighlight() {
  return useContext(SourceHighlightContext);
}

// Helper function to mock source positions for field values (in a real app, these would come from backend)
export function getFieldSource(fieldId: string): SourceHighlight | null {
  // Mock source positions for capital call document fields
  const sourceMappings: Record<string, Omit<SourceHighlight, 'fieldId'>> = {
    "call_number": {
      sourceId: "call_number_doc",
      documentPosition: { 
        page: 1, 
        rect: { top: 170, left: 420, width: 60, height: 24 } 
      },
      value: "#4"
    },
    "fund_name": {
      sourceId: "fund_name_doc",
      documentPosition: { 
        page: 1, 
        rect: { top: 180, left: 150, width: 250, height: 24 } 
      },
      value: "KKR North America Fund VII"
    },
    "fund_strategy": {
      sourceId: "fund_strategy_doc",
      documentPosition: { 
        page: 1, 
        rect: { top: 210, left: 150, width: 120, height: 24 } 
      },
      value: "Large Buyout"
    },
    "total_call_amount": {
      sourceId: "total_call_amount_doc",
      documentPosition: { 
        page: 1, 
        rect: { top: 300, left: 280, width: 100, height: 24 } 
      },
      value: "$8,500,000"
    },
    "your_commitment_pct": {
      sourceId: "your_commitment_pct_doc",
      documentPosition: { 
        page: 1, 
        rect: { top: 350, left: 280, width: 60, height: 24 } 
      },
      value: "2.35%"
    },
    "your_call_amount": {
      sourceId: "your_call_amount_doc",
      documentPosition: { 
        page: 1, 
        rect: { top: 400, left: 280, width: 100, height: 24 } 
      },
      value: "$199,750"
    },
    "due_date": {
      sourceId: "due_date_doc",
      documentPosition: { 
        page: 1, 
        rect: { top: 250, left: 280, width: 150, height: 24 } 
      },
      value: "November 15, 2023"
    }
  };
  
  return fieldId in sourceMappings 
    ? { fieldId, ...sourceMappings[fieldId] }
    : null;
} 