"use client"
import {
  CalendarIcon,
  ChevronDownIcon,
  MoreVerticalIcon,
  SearchIcon,
  SortAscIcon,
  TagIcon,
  UserIcon,
  BuildingIcon,
  PlusIcon,
  FilterIcon,
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
import React, { useState } from "react"

const notesData = [
  {
    id: 1,
    title: "Investment Committee Meeting Notes",
    topic:
      "Discussed the new venture capital opportunity with TechFlow Inc. The committee agreed to proceed with due diligence. Key concerns include market competition and burn rate.",
    content: `The Investment Committee convened on October 20th to review several promising investment opportunities, with particular focus on TechFlow Inc., a B2B SaaS company specializing in workflow automation for enterprise clients.

Key Discussion Points:
1. Market Analysis: TechFlow operates in the rapidly growing workflow automation sector, currently valued at $8.5B with projected CAGR of 23% through 2028. The company has demonstrated strong product-market fit with 150+ enterprise clients including three Fortune 500 companies.

2. Financial Performance: The company achieved $12M ARR in 2023, representing 180% YoY growth. Monthly burn rate is currently $450K with 18 months runway based on existing capital. Gross margins are healthy at 82%, in line with top-tier SaaS companies.

3. Competitive Landscape: Main competitors include established players like Zapier and Make.com, but TechFlow's enterprise-focused approach and superior API integration capabilities provide clear differentiation. The committee noted their recent partnership with Salesforce as a significant competitive advantage.

4. Due Diligence Requirements: The committee approved proceeding with comprehensive due diligence, with particular emphasis on:
   - Technical architecture review and scalability assessment
   - Customer reference calls with at least 10 enterprise clients
   - Detailed financial audit including revenue recognition practices
   - Management team background checks and reference verification
   - Legal review of IP portfolio and existing contracts

5. Investment Terms: Preliminary discussions suggest a Series B round of $40M at a $200M pre-money valuation. Our potential allocation would be $8-10M, representing 4-5% ownership stake post-money.

6. Risk Factors Identified:
   - High customer concentration with top 5 clients representing 35% of revenue
   - Dependency on key technical talent, particularly the CTO
   - Potential platform risk with heavy reliance on AWS infrastructure
   - Increasing competition from well-funded competitors

Next Steps:
- Due diligence team formation by October 25th
- Initial findings presentation scheduled for November 15th
- Final investment decision expected by November 30th

The committee unanimously agreed to proceed with due diligence, with Sarah Johnson appointed as deal lead and Michael Chen providing technical assessment support.`,
    author: "Sarah Johnson",
    date: "2 hours ago",
    lastModified: "1 hour ago",
  },
  {
    id: 2,
    title: "Tax Planning Strategy 2024",
    topic:
      "Review of tax optimization strategies for the family office. Considering establishing a new trust structure for international investments.",
    content: `The Investment Committee convened on October 20th to review several promising investment opportunities, with particular focus on TechFlow Inc., a B2B SaaS company specializing in workflow automation for enterprise clients.

Key Discussion Points:
1. Market Analysis: TechFlow operates in the rapidly growing workflow automation sector, currently valued at $8.5B with projected CAGR of 23% through 2028. The company has demonstrated strong product-market fit with 150+ enterprise clients including three Fortune 500 companies.

2. Financial Performance: The company achieved $12M ARR in 2023, representing 180% YoY growth. Monthly burn rate is currently $450K with 18 months runway based on existing capital. Gross margins are healthy at 82%, in line with top-tier SaaS companies.

3. Competitive Landscape: Main competitors include established players like Zapier and Make.com, but TechFlow's enterprise-focused approach and superior API integration capabilities provide clear differentiation. The committee noted their recent partnership with Salesforce as a significant competitive advantage.

4. Due Diligence Requirements: The committee approved proceeding with comprehensive due diligence, with particular emphasis on:
   - Technical architecture review and scalability assessment
   - Customer reference calls with at least 10 enterprise clients
   - Detailed financial audit including revenue recognition practices
   - Management team background checks and reference verification
   - Legal review of IP portfolio and existing contracts

5. Investment Terms: Preliminary discussions suggest a Series B round of $40M at a $200M pre-money valuation. Our potential allocation would be $8-10M, representing 4-5% ownership stake post-money.

6. Risk Factors Identified:
   - High customer concentration with top 5 clients representing 35% of revenue
   - Dependency on key technical talent, particularly the CTO
   - Potential platform risk with heavy reliance on AWS infrastructure
   - Increasing competition from well-funded competitors

Next Steps:
- Due diligence team formation by October 25th
- Initial findings presentation scheduled for November 15th
- Final investment decision expected by November 30th

The committee unanimously agreed to proceed with due diligence, with Sarah Johnson appointed as deal lead and Michael Chen providing technical assessment support.`,
    author: "Michael Chen",
    date: "Yesterday",
    lastModified: "Yesterday",
  },
  {
    id: 3,
    title: "Portfolio Rebalancing Analysis",
    topic:
      "Q3 portfolio performance exceeded expectations. Recommend increasing allocation to emerging markets by 5% and reducing fixed income exposure.",
    content: `The Investment Committee convened on October 20th to review several promising investment opportunities, with particular focus on TechFlow Inc., a B2B SaaS company specializing in workflow automation for enterprise clients.

Key Discussion Points:
1. Market Analysis: TechFlow operates in the rapidly growing workflow automation sector, currently valued at $8.5B with projected CAGR of 23% through 2028. The company has demonstrated strong product-market fit with 150+ enterprise clients including three Fortune 500 companies.

2. Financial Performance: The company achieved $12M ARR in 2023, representing 180% YoY growth. Monthly burn rate is currently $450K with 18 months runway based on existing capital. Gross margins are healthy at 82%, in line with top-tier SaaS companies.

3. Competitive Landscape: Main competitors include established players like Zapier and Make.com, but TechFlow's enterprise-focused approach and superior API integration capabilities provide clear differentiation. The committee noted their recent partnership with Salesforce as a significant competitive advantage.

4. Due Diligence Requirements: The committee approved proceeding with comprehensive due diligence, with particular emphasis on:
   - Technical architecture review and scalability assessment
   - Customer reference calls with at least 10 enterprise clients
   - Detailed financial audit including revenue recognition practices
   - Management team background checks and reference verification
   - Legal review of IP portfolio and existing contracts

5. Investment Terms: Preliminary discussions suggest a Series B round of $40M at a $200M pre-money valuation. Our potential allocation would be $8-10M, representing 4-5% ownership stake post-money.

6. Risk Factors Identified:
   - High customer concentration with top 5 clients representing 35% of revenue
   - Dependency on key technical talent, particularly the CTO
   - Potential platform risk with heavy reliance on AWS infrastructure
   - Increasing competition from well-funded competitors

Next Steps:
- Due diligence team formation by October 25th
- Initial findings presentation scheduled for November 15th
- Final investment decision expected by November 30th

The committee unanimously agreed to proceed with due diligence, with Sarah Johnson appointed as deal lead and Michael Chen providing technical assessment support.`,
    author: "You",
    date: "3 days ago",
    lastModified: "2 days ago",
  },
  {
    id: 4,
    title: "Real Estate Acquisition Proposal",
    topic:
      "Identified prime commercial property in downtown. Cap rate of 7.5%, stable tenant base. Requires $15M initial investment.",
    content: `The Investment Committee convened on October 20th to review several promising investment opportunities, with particular focus on TechFlow Inc., a B2B SaaS company specializing in workflow automation for enterprise clients.

Key Discussion Points:
1. Market Analysis: TechFlow operates in the rapidly growing workflow automation sector, currently valued at $8.5B with projected CAGR of 23% through 2028. The company has demonstrated strong product-market fit with 150+ enterprise clients including three Fortune 500 companies.

2. Financial Performance: The company achieved $12M ARR in 2023, representing 180% YoY growth. Monthly burn rate is currently $450K with 18 months runway based on existing capital. Gross margins are healthy at 82%, in line with top-tier SaaS companies.

3. Competitive Landscape: Main competitors include established players like Zapier and Make.com, but TechFlow's enterprise-focused approach and superior API integration capabilities provide clear differentiation. The committee noted their recent partnership with Salesforce as a significant competitive advantage.

4. Due Diligence Requirements: The committee approved proceeding with comprehensive due diligence, with particular emphasis on:
   - Technical architecture review and scalability assessment
   - Customer reference calls with at least 10 enterprise clients
   - Detailed financial audit including revenue recognition practices
   - Management team background checks and reference verification
   - Legal review of IP portfolio and existing contracts

5. Investment Terms: Preliminary discussions suggest a Series B round of $40M at a $200M pre-money valuation. Our potential allocation would be $8-10M, representing 4-5% ownership stake post-money.

6. Risk Factors Identified:
   - High customer concentration with top 5 clients representing 35% of revenue
   - Dependency on key technical talent, particularly the CTO
   - Potential platform risk with heavy reliance on AWS infrastructure
   - Increasing competition from well-funded competitors

Next Steps:
- Due diligence team formation by October 25th
- Initial findings presentation scheduled for November 15th
- Final investment decision expected by November 30th

The committee unanimously agreed to proceed with due diligence, with Sarah Johnson appointed as deal lead and Michael Chen providing technical assessment support.`,
    author: "David Park",
    date: "Last week",
    lastModified: "5 days ago",
  },
  {
    id: 5,
    title: "Risk Assessment Update",
    topic:
      "Updated risk models show increased exposure to currency fluctuations. Recommend hedging strategy for EUR and GBP positions.",
    content: `The Investment Committee convened on October 20th to review several promising investment opportunities, with particular focus on TechFlow Inc., a B2B SaaS company specializing in workflow automation for enterprise clients.

Key Discussion Points:
1. Market Analysis: TechFlow operates in the rapidly growing workflow automation sector, currently valued at $8.5B with projected CAGR of 23% through 2028. The company has demonstrated strong product-market fit with 150+ enterprise clients including three Fortune 500 companies.

2. Financial Performance: The company achieved $12M ARR in 2023, representing 180% YoY growth. Monthly burn rate is currently $450K with 18 months runway based on existing capital. Gross margins are healthy at 82%, in line with top-tier SaaS companies.

3. Competitive Landscape: Main competitors include established players like Zapier and Make.com, but TechFlow's enterprise-focused approach and superior API integration capabilities provide clear differentiation. The committee noted their recent partnership with Salesforce as a significant competitive advantage.

4. Due Diligence Requirements: The committee approved proceeding with comprehensive due diligence, with particular emphasis on:
   - Technical architecture review and scalability assessment
   - Customer reference calls with at least 10 enterprise clients
   - Detailed financial audit including revenue recognition practices
   - Management team background checks and reference verification
   - Legal review of IP portfolio and existing contracts

5. Investment Terms: Preliminary discussions suggest a Series B round of $40M at a $200M pre-money valuation. Our potential allocation would be $8-10M, representing 4-5% ownership stake post-money.

6. Risk Factors Identified:
   - High customer concentration with top 5 clients representing 35% of revenue
   - Dependency on key technical talent, particularly the CTO
   - Potential platform risk with heavy reliance on AWS infrastructure
   - Increasing competition from well-funded competitors

Next Steps:
- Due diligence team formation by October 25th
- Initial findings presentation scheduled for November 15th
- Final investment decision expected by November 30th

The committee unanimously agreed to proceed with due diligence, with Sarah Johnson appointed as deal lead and Michael Chen providing technical assessment support.`,
    author: "Risk Team",
    date: "2 weeks ago",
    lastModified: "1 week ago",
  },
]

export function NotesTable({ onNoteSelect }: { onNoteSelect?: (note: any) => void }) {
  const [notes, setNotes] = useState(notesData)
  const [selectedNote, setSelectedNote] = React.useState<any>(null)

  // Handle note selection
  const handleNoteClick = (note: any) => {
    setSelectedNote(note)
    onNoteSelect?.(note)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input className="h-8 w-[250px]" placeholder="Search notes..." />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filter
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuCheckboxItem>Created (Newest)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Created (Oldest)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Modified (Recent)</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem>Title (A-Z)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Title (Z-A)</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem>Author (A-Z)</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Author (Z-A)</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <TagIcon className="mr-2 h-4 w-4" />
                Tags
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuLabel className="text-xs">Tags</DropdownMenuLabel>
              <DropdownMenuCheckboxItem>investment</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>research</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>legal</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>financial</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>meeting</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button size="sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes.map((note) => (
              <TableRow
                key={note.id}
                className="group cursor-pointer hover:bg-muted/50"
                onClick={() => handleNoteClick(note)}
              >
                <TableCell className="font-medium">{note.title}</TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="truncate text-sm text-muted-foreground">{note.topic}</p>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{note.date}</p>
                    <p className="text-xs text-muted-foreground">Modified: {note.lastModified}</p>
                  </div>
                </TableCell>
                <TableCell>{note.author}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVerticalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
      </div>
    </div>
  )
}
