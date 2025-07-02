"use client"
import { useState } from "react"
import {
  CalendarIcon,
  ChevronDownIcon,
  MoreVerticalIcon,
  SearchIcon,
  SortAscIcon,
  TagIcon,
  UserIcon,
  BuildingIcon,
  FileTextIcon,
  PlusIcon,
  LayoutGridIcon,
  ListIcon,
  TableIcon,
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
import { ViewModeSelector } from "@/components/shared/view-mode-selector"
import { RecordListItem } from "@/components/shared/record-list-item"
import { RecordCard } from "@/components/shared/record-card"
import { formatDate } from "@/lib/utils"

// Define the Note type without priority
type Note = {
  id: string
  title: string
  topic: string
  createdAt: string
  updatedAt: string
  date: string
  lastModified: string
  author: string
  content: string
}

// Function to get context-specific notes based on task title
export function getContextualNotes(taskTitle?: string) {
  // Main task: Update capital schedule – Call #4
  if (!taskTitle || taskTitle.includes("Update capital schedule – Call #4")) {
    return [
      {
        id: "NOTE-4001",
        title: "Capital Call #4 Fund Parameters",
        topic: "Call #4 is for $15M to fund the acquisition of TechVantage Solutions. This represents 15% of total commitments. Fund has $65M called to date (65%), with $35M remaining uncalled capital (35%).",
        createdAt: "2023-10-18T09:30:00Z",
        updatedAt: "2023-10-18T14:45:00Z",
        date: "4 days ago",
        lastModified: "4 days ago",
        author: "Michael Chen",
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
      },
      {
        id: "NOTE-4002",
        title: "TechVantage Acquisition Terms",
        topic: "TechVantage Solutions acquisition - $28M total consideration with $15M from this capital call and $13M from existing fund reserves. Deal expected to close on November 15th pending final regulatory approvals.",
        createdAt: "2023-10-17T11:20:00Z",
        updatedAt: "2023-10-17T15:10:00Z",
        date: "5 days ago",
        lastModified: "5 days ago",
        author: "Sarah Johnson",
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
      },
      {
        id: "NOTE-4003",
        title: "Capital Call #4 Timeline",
        topic: "Capital Call #4 schedule: Capital call notices to be issued by Oct 25th, payment due by Nov 10th (15 day period), with company acquisition closing scheduled for Nov 15th.",
        createdAt: "2023-10-16T14:15:00Z",
        updatedAt: "2023-10-16T16:20:00Z",
        date: "6 days ago",
        lastModified: "6 days ago",
        author: "Emily Watson",
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
      },
    ];
  }
  
  // Subtask 1: Calculate pro-rata allocation
  else if (taskTitle.includes("Calculate pro-rata allocation")) {
    return [
      {
        id: "NOTE-4101",
        title: "LP Commitment Percentages",
        topic: "Current LP commitment breakdown: Apex Capital Partners (25%), Summit Ventures LLC (20%), Ridge Family Office (15%), Meridian Holdings (40%). Updated after Ridge's secondary sale of 5% to Meridian last quarter.",
        createdAt: "2023-10-19T10:30:00Z",
        updatedAt: "2023-10-19T14:45:00Z",
        date: "3 days ago",
        lastModified: "3 days ago",
        author: "Michael Chen",
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
      },
      {
        id: "NOTE-4102",
        title: "Call #4 Calculation Notes",
        topic: "For Call #4 ($15M), calculated amounts are: Apex Capital ($3.75M), Summit Ventures ($3M), Ridge Family ($2.25M), Meridian Holdings ($6M). Confirmed with accounting department on October 19.",
        createdAt: "2023-10-19T13:15:00Z",
        updatedAt: "2023-10-19T16:20:00Z",
        date: "3 days ago",
        lastModified: "3 days ago",
        author: "David Park",
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
      }
    ];
  }
  
  // Subtask 2: Update LP capital accounts
  else if (taskTitle.includes("Update LP capital accounts")) {
    return [
      {
        id: "NOTE-4201",
        title: "Capital Account Update Process",
        topic: "Remember to update both committed capital percentage and the called capital tracking in the LP portal. System requires update to fund data first, then individual LP records.",
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
        createdAt: "2023-10-20T09:45:00Z",
        updatedAt: "2023-10-20T11:30:00Z",
        date: "2 days ago",
        lastModified: "2 days ago",
        author: "Jessica Martinez",
      },
      {
        id: "NOTE-4202",
        title: "Historical Capital Account Data",
        topic: "Call #1: $10M (10%), Call #2: $25M (25%), Call #3: $30M (30%), Current Call #4: $15M (15%). Total called after this call will be $80M (80%).",
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
        createdAt: "2023-10-20T14:20:00Z",
        updatedAt: "2023-10-20T16:40:00Z",
        date: "2 days ago",
        lastModified: "2 days ago",
        author: "Michael Chen",
      }
    ];
  }
  
  // Subtask 3: Generate capital call notices
  else if (taskTitle.includes("Generate capital call notices")) {
    return [
      {
        id: "NOTE-4301",
        title: "Call Notice Template Updates",
        topic: "Using updated capital call template approved by legal in September. New template includes expanded wire instructions section and digital signature capability.",
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
        createdAt: "2023-10-21T08:15:00Z",
        updatedAt: "2023-10-21T10:20:00Z",
        date: "Yesterday",
        lastModified: "Yesterday",
        author: "Emily Watson",
      },
      {
        id: "NOTE-4302",
        title: "LP Special Instructions",
        topic: "Remember Meridian Holdings requires 2 business days advance notice before formal call notice. Ridge Family Office needs notice copied to their new administrative email: admin@ridgefamily.com",
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
        createdAt: "2023-10-21T13:40:00Z",
        updatedAt: "2023-10-21T15:10:00Z",
        date: "Yesterday",
        lastModified: "Yesterday",
        author: "Sarah Johnson",
      }
    ];
  }
  
  // Subtask 4: Update fund commitment tracker
  else if (taskTitle.includes("Update fund commitment tracker")) {
    return [
      {
        id: "NOTE-4401",
        title: "Fund Tracker Spreadsheet Location",
        topic: "Latest version of commitment tracker is in the shared drive: Finance/Fund III/Capital Calls/Tracker_v3.4.xlsx - Make sure to back up before updating.",
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
        createdAt: "2023-10-22T09:10:00Z",
        updatedAt: "2023-10-22T09:30:00Z",
        date: "Today",
        lastModified: "Today",
        author: "Michael Chen",
      },
      {
        id: "NOTE-4402",
        title: "New Reporting Requirements",
        topic: "After Call #4, we'll exceed 75% called capital threshold, triggering quarterly reporting requirements to Investment Committee on uncalled capital plans.",
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
        createdAt: "2023-10-22T11:45:00Z",
        updatedAt: "2023-10-22T14:15:00Z",
        date: "Today",
        lastModified: "Today",
        author: "Thomas Wong",
      }
    ];
  }
  
  // Subtask 5: Reconcile capital schedule
  else if (taskTitle.includes("Reconcile capital schedule")) {
    return [
      {
        id: "NOTE-4501",
        title: "Previous Reconciliation Issues",
        topic: "Last reconciliation for Call #3 found a $50K discrepancy in Apex Capital's account. Issue was due to FX conversion rate difference. Confirm with accounting on any similar watch items for Call #4.",
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
        createdAt: "2023-10-22T15:30:00Z",
        updatedAt: "2023-10-22T17:20:00Z",
        date: "Today",
        lastModified: "Today",
        author: "Jessica Martinez",
      },
      {
        id: "NOTE-4502",
        title: "Reconciliation Checklist",
        topic: "Steps for reconciliation: 1) Compare LP management system data vs. accounting system, 2) Verify total called amounts match fund admin records, 3) Check individual LP records match capital accounts, 4) Confirm percentages align with LP agreements, 5) Document and resolve any discrepancies.",
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
        createdAt: "2023-10-22T16:15:00Z",
        updatedAt: "2023-10-22T16:45:00Z",
        date: "Today",
        lastModified: "Today",
        author: "David Park",
      }
    ];
  }
  
  // Default case - return general notes
  else {
    return defaultNotes;
  }
}

// Default mock data, can be overridden by passing data prop
const defaultNotes: Note[] = [
  {
    id: "NOTE-1001",
    title: "Investment Committee Meeting Notes",
    topic: "Discussed the new venture capital opportunity with TechFlow Inc. The committee agreed to proceed with due diligence. Key concerns include market competition and burn rate.",
    createdAt: "2023-10-20T10:30:00Z",
    updatedAt: "2023-10-20T14:45:00Z",
    date: "2 days ago",
    lastModified: "2 days ago",
    author: "Sarah Johnson",
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
  },
  {
    id: "NOTE-1002",
    title: "Tax Planning Strategy 2024",
    topic: "Review of tax optimization strategies for the family office. Considering establishing a new trust structure for international investments.",
    createdAt: "2023-10-19T09:15:00Z",
    updatedAt: "2023-10-19T16:20:00Z",
    date: "3 days ago",
    lastModified: "3 days ago",
    author: "Michael Chen",
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
  },
  {
    id: "NOTE-1003",
    title: "Portfolio Rebalancing Analysis",
    topic: "Q3 portfolio performance exceeded expectations. Recommend increasing allocation to emerging markets by 5% and reducing fixed income exposure.",
    createdAt: "2023-10-18T13:45:00Z",
    updatedAt: "2023-10-18T15:30:00Z",
    date: "4 days ago",
    lastModified: "4 days ago",
    author: "You",
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
  },
];

export type NoteContentProps = {
  data?: any[] // Optional - if not provided, uses default mock data
  viewMode?: "table" | "card" | "list" // Optional - defaults to table
  onNoteSelect?: (note: any) => void // Optional - callback when a note is selected
  title?: string // Optional - section title
  taskTitle?: string // Optional - used to contextually filter notes
}

export function NoteContent({ 
  data, 
  viewMode: initialViewMode = "table", 
  onNoteSelect,
  title = "Notes",
  taskTitle
}: NoteContentProps) {
  // Use contextual notes if no data is provided
  const initialData = data || getContextualNotes(taskTitle);
  const [notes, setNotes] = useState<any[]>(initialData);
  const [selectedNote, setSelectedNote] = useState<any>(null)
  const [viewMode, setViewMode] = useState(initialViewMode)

  const handleNoteSelect = (note: any) => {
    if (onNoteSelect) {
      onNoteSelect(note)
    } else {
      setSelectedNote(note)
    }
  }

  const createNewNote = () => {
    const newNote = {
      id: `NOTE-${Math.floor(1000 + Math.random() * 9000)}`,
      title: "New Note",
      topic: "Click to edit this note...",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      date: "Just now",
      lastModified: "Just now",
      author: "You",
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
    };
    
    // Add the new note to the beginning of the array
    setNotes([newNote, ...notes]);
    
    // Select the new note to open the drawer
    handleNoteSelect(newNote);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search notes..." className="w-full bg-background pl-8" />
        </div>
        <div className="flex items-center gap-2">
          <ViewModeSelector viewMode={viewMode} onViewModeChange={setViewMode} />
          <Button size="sm" onClick={createNewNote}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>
      </div>

      {viewMode === "table" && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.map((note) => (
                <TableRow 
                  key={note.id} 
                  className="group cursor-pointer hover:bg-muted/50" 
                  onClick={() => handleNoteSelect(note)}
                >
                  <TableCell className="w-12">
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="font-medium text-sm">{note.title}</TableCell>
                  <TableCell className="text-sm">{note.author}</TableCell>
                  <TableCell className="text-sm">{note.date || formatDate(new Date(note.createdAt))}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                          <MoreVerticalIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleNoteSelect(note);
                        }}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
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
      )}

      {viewMode === "list" && (
        <div className="divide-y">
          {notes.map((note) => (
            <RecordListItem
              key={note.id}
              title={note.title}
              primaryMetadata={[]}
              secondaryMetadata={{
                left: note.author || "",
                right: note.date || formatDate(new Date(note.createdAt))
              }}
              onClick={() => handleNoteSelect(note)}
              actions={[
                { label: "View", onClick: () => handleNoteSelect(note) },
                { label: "Edit", onClick: () => {} },
                { label: "Delete", onClick: () => {}, variant: "destructive" as const },
              ]}
              leadingElement={<FileIcon className="h-4 w-4 text-muted-foreground" />}
            />
          ))}
        </div>
      )}

      {viewMode === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <RecordCard
              key={note.id}
              title={note.title}
              primaryMetadata={[]}
              secondaryMetadata={{
                left: note.author || "",
                right: note.date || formatDate(new Date(note.createdAt))
              }}
              onClick={() => handleNoteSelect(note)}
              actions={[
                { label: "View", onClick: () => handleNoteSelect(note) },
                { label: "Edit", onClick: () => {} },
                { label: "Delete", onClick: () => {}, variant: "destructive" as const },
              ]}
              leadingElement={<FileIcon className="h-4 w-4 text-muted-foreground" />}
            />
          ))}
        </div>
      )}
    </div>
  )
}
