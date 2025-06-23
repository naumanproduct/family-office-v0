// Utility functions to centralize mock ActivityItem arrays for details drawers.
// This keeps formatting consistent and makes future edits apply everywhere.

import { ActivityItem } from "./unified-activity-section"

// Helper to get ISO date for "n" days ago
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

export function generatePersonActivities(contact: { firstName: string }) : ActivityItem[] {
  return [
    {
      id: 1,
      type: "note_create",
      objectType: "note",
      actor: "You",
      action: "created a",
      target: "Intro Call Summary",
      url: "/notes/9001",
      timestamp: "2 hours ago",
      date: hoursAgo(2),
    },
    {
      id: 2,
      type: "title_change",
      actor: "James Patel",
      action: `updated ${contact.firstName}'s title`,
      target: "Principal → Managing Partner",
      url: "#title-history",
      timestamp: "3 days ago",
      date: daysAgo(3),
    },
    {
      id: 3,
      type: "company_link",
      objectType: "company",
      actor: "You",
      action: `linked ${contact.firstName} to`,
      target: "Blue Horizon Capital",
      url: "/companies/4001",
      timestamp: "1 week ago",
      date: daysAgo(7),
    },
  ]
}

export function generateCompanyActivities() : ActivityItem[] {
  return [
    {
      id: 1,
      type: "file_link",
      objectType: "file",
      actor: "You",
      action: "linked document to",
      target: "Series C Pitch Deck.pdf",
      url: "/files/5101",
      timestamp: "4 hours ago",
      date: hoursAgo(4),
    },
    {
      id: 2,
      type: "profile_update",
      objectType: "section",
      actor: "Amira Khan",
      action: "updated company profile section",
      target: "Mission Statement",
      url: "#profile-mission-statement",
      timestamp: "2 days ago",
      date: daysAgo(2),
    },
    {
      id: 3,
      type: "task_create",
      objectType: "task",
      actor: "Omar Ali",
      action: "created a",
      target: "Review Partnership Agreement",
      url: "/tasks/3051",
      timestamp: "1 week ago",
      date: daysAgo(7),
    },
  ]
}

export function generateNoteActivities() : ActivityItem[] {
  return [
    {
      id: 1,
      type: "note_update",
      actor: "Sarah Johnson",
      action: "updated",
      objectType: "note",
      target: "content",
      url: "#note-content",
      timestamp: "2 days ago",
      date: daysAgo(2),
    },
    {
      id: 2,
      type: "note_comment",
      actor: "James Patel",
      action: "commented on",
      objectType: "note",
      target: "Intro Call Summary",
      url: "#comments",
      timestamp: "5 days ago",
      date: daysAgo(5),
    },
    {
      id: 3,
      type: "note_create",
      actor: "You",
      action: "created this",
      objectType: "note",
      target: "this note",
      url: "#",
      timestamp: "1 week ago",
      date: daysAgo(7),
    },
  ]
}

// ----- Additional record-type generators -----

export function generateInvestmentActivities() : ActivityItem[] {
  return [
    {
      id: 1,
      type: "task_create",
      objectType: "task",
      actor: "You",
      action: "created a",
      target: "Review Q1 Fund Statement",
      url: "/tasks/6011",
      timestamp: "6 hours ago",
      date: hoursAgo(6),
    },
    {
      id: 2,
      type: "performance_update",
      actor: "Jessica Liu",
      action: "updated performance data for",
      objectType: "investment",
      target: "",
      url: "#performance",
      timestamp: "1 day ago",
      date: daysAgo(1),
    },
    {
      id: 3,
      type: "file_link",
      objectType: "file",
      actor: "You",
      action: "linked document to",
      target: "March 2025 Performance.pdf",
      url: "/files/5201",
      timestamp: "3 days ago",
      date: daysAgo(3),
    },
  ]
}

export function generateEntityActivities() : ActivityItem[] {
  return [
    {
      id: 1,
      type: "report_file",
      objectType: "file",
      actor: "Legal Team",
      action: "filed annual report",
      target: "2024 Annual Report.pdf",
      url: "/files/6101",
      timestamp: "1 week ago",
      date: daysAgo(7),
    },
    {
      id: 2,
      type: "ownership_update",
      actor: "Corporate Secretary",
      action: "updated ownership structure",
      objectType: "chart",
      target: "Ownership Chart v2",
      url: "#ownership-chart",
      timestamp: "2 weeks ago",
      date: daysAgo(14),
    },
  ]
}

export function generateOpportunityActivities() : ActivityItem[] {
  return [
    {
      id: 1,
      type: "stage_move",
      actor: "You",
      action: "moved opportunity stage to",
      objectType: "stage",
      target: "Diligence",
      url: "#stage-history",
      timestamp: "4 hours ago",
      date: hoursAgo(4),
    },
    {
      id: 2,
      type: "note_link",
      objectType: "note",
      actor: "James Patel",
      action: "linked note to opportunity",
      target: "Databricks Crossover Investment",
      url: "/notes/9201",
      timestamp: "3 days ago",
      date: daysAgo(3),
    },
  ]
}

export function generateTaskActivities() : ActivityItem[] {
  return [
    {
      id: 1,
      type: "task_complete",
      actor: "Sarah Malik",
      action: "completed the task",
      objectType: "task",
      target: "Draft LP Summary",
      url: "#task-history",
      timestamp: "1 hour ago",
      date: hoursAgo(1),
    },
    {
      id: 2,
      type: "deadline_update",
      actor: "You",
      action: "updated task deadline",
      objectType: "task",
      target: "Submit Tax Estimates",
      url: "#deadline-history",
      timestamp: "1 day ago",
      date: daysAgo(1),
    },
  ]
}

export function generateFileActivities() : ActivityItem[] {
  return [
    {
      id: 1,
      type: "file_upload",
      actor: "You",
      action: "uploaded a new file",
      objectType: "file",
      target: "KKR Fund XII – Performance.pdf",
      url: "/files/7001",
      timestamp: "30 minutes ago",
      date: hoursAgo(0.5),
    },
    {
      id: 2,
      type: "file_delete",
      actor: "You",
      action: "deleted a file",
      objectType: "file",
      target: "Old Capital Call Schedule.xlsx",
      url: "#deleted-files",
      timestamp: "2 days ago",
      date: daysAgo(2),
    },
  ]
}

export function generateWorkflowActivities() : ActivityItem[] {
  return [
    {
      id: 1,
      type: "task_create",
      objectType: "task",
      actor: "You",
      action: "created a",
      target: "Review financials",
      url: "/tasks/9001",
      timestamp: "3 hours ago",
      date: hoursAgo(3),
    },
    {
      id: 2,
      type: "meeting_schedule",
      objectType: "meeting",
      actor: "Sarah Chen",
      action: "scheduled a",
      target: "Product demo",
      url: "/meetings/9101",
      timestamp: "1 day ago",
      date: daysAgo(1),
    },
    {
      id: 3,
      type: "file_upload",
      objectType: "file",
      actor: "You",
      action: "uploaded a new file",
      target: "TechFlow Pitch Deck.pdf",
      url: "/files/9201",
      timestamp: "2 days ago",
      date: daysAgo(2),
    },
  ]
} 