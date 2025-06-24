"use client"

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { MoreHorizontal, Filter } from "lucide-react";

// Activity types with their corresponding badge colors
const ACTIVITY_TYPES = {
  note: { label: "Note", color: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  task: { label: "Task", color: "bg-purple-100 text-purple-800 hover:bg-purple-100" },
  meeting: { label: "Meeting", color: "bg-green-100 text-green-800 hover:bg-green-100" },
  email: { label: "Email", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  document: { label: "Document", color: "bg-orange-100 text-orange-800 hover:bg-orange-100" },
  investment: { label: "Investment", color: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100" },
  company: { label: "Company", color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" },
  entity: { label: "Entity", color: "bg-pink-100 text-pink-800 hover:bg-pink-100" },
  person: { label: "Person", color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" },
  opportunity: { label: "Opportunity", color: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
};

// Record types for context
const RECORD_TYPES = {
  note: "note",
  task: "task",
  meeting: "meeting",
  email: "email",
  document: "document",
  investment: "investment",
  company: "company",
  entity: "entity",
  person: "person",
  opportunity: "opportunity",
};

interface GlobalActivityItem {
  id: string;
  type: keyof typeof ACTIVITY_TYPES;
  action: string;
  timestamp: Date;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  recordName: string;
  recordType: keyof typeof RECORD_TYPES;
  recordUrl: string;
  commentCount?: number;
}

// Mock data generator
const generateMockActivities = (count: number): GlobalActivityItem[] => {
  const activities: GlobalActivityItem[] = [];
  const actions = ["created", "updated", "deleted", "commented on", "completed", "assigned", "shared"];
  const users = [
    { id: "1", name: "You", avatar: "/placeholder-user.jpg" },
    { id: "2", name: "Alex Johnson", avatar: "/placeholder-user.jpg" },
    { id: "3", name: "Sarah Miller", avatar: "/placeholder-user.jpg" },
  ];
  
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastMonth = new Date(now);
  lastMonth.setDate(lastMonth.getDate() - 30);
  
  const recordNames = {
    note: ["Quarterly Meeting Notes", "Investment Strategy", "Due Diligence Findings", "Client Call Summary"],
    task: ["Review Financial Statements", "Prepare Tax Documents", "Schedule Board Meeting", "Follow up with LP"],
    meeting: ["Annual Review", "Investment Committee", "Portfolio Review", "Strategy Session"],
    email: ["Q3 Performance Update", "Capital Call Notice", "Distribution Announcement", "LP Communication"],
    document: ["Partnership Agreement", "Subscription Documents", "K-1 Forms", "Quarterly Report"],
    investment: ["TechFlow Ventures Series C", "Horizon Growth Fund", "Blue Ocean Real Estate", "Green Energy Partners"],
    company: ["Acme Corp", "TechSolutions Inc", "Global Innovations", "Future Mobility"],
    entity: ["Family Trust LLC", "Investment Holdings LP", "Tax Entity 2023", "Charitable Foundation"],
    person: ["John Smith", "Maria Rodriguez", "David Chen", "Elizabeth Taylor"],
    opportunity: ["Healthcare Tech Fund", "European Expansion", "Sustainable Agriculture", "AI Startup"],
  };

  for (let i = 0; i < count; i++) {
    const type = Object.keys(ACTIVITY_TYPES)[Math.floor(Math.random() * Object.keys(ACTIVITY_TYPES).length)] as keyof typeof ACTIVITY_TYPES;
    const user = users[Math.floor(Math.random() * users.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    // Generate timestamp - distribute across today, yesterday, last week, last month
    let timestamp;
    const timeDistribution = Math.random();
    if (timeDistribution < 0.3) {
      // Today
      timestamp = new Date(now);
      timestamp.setHours(now.getHours() - Math.floor(Math.random() * 12));
    } else if (timeDistribution < 0.5) {
      // Yesterday
      timestamp = new Date(yesterday);
      timestamp.setHours(Math.floor(Math.random() * 24));
    } else if (timeDistribution < 0.8) {
      // Last week
      timestamp = new Date(lastWeek);
      timestamp.setDate(timestamp.getDate() + Math.floor(Math.random() * 7));
    } else {
      // Last month
      timestamp = new Date(lastMonth);
      timestamp.setDate(timestamp.getDate() + Math.floor(Math.random() * 30));
    }
    
    const recordType = type as keyof typeof RECORD_TYPES;
    const possibleNames = recordNames[recordType] || recordNames.note;
    const recordName = possibleNames[Math.floor(Math.random() * possibleNames.length)];
    
    activities.push({
      id: `activity-${i}`,
      type,
      action,
      timestamp,
      user,
      recordName,
      recordType,
      recordUrl: `/${recordType}s/${i}`,
      commentCount: Math.random() > 0.7 ? Math.floor(Math.random() * 10) + 1 : 0,
    });
  }
  
  // Sort by timestamp descending
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Group activities by time period
const groupActivitiesByTimePeriod = (activities: GlobalActivityItem[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeekStart = new Date(today);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  
  return {
    today: activities.filter(activity => activity.timestamp >= today),
    yesterday: activities.filter(activity => 
      activity.timestamp >= yesterday && activity.timestamp < today
    ),
    thisWeek: activities.filter(activity => 
      activity.timestamp >= lastWeekStart && activity.timestamp < yesterday
    ),
    older: activities.filter(activity => activity.timestamp < lastWeekStart),
  };
};

// Activity item component
const ActivityItem = ({ activity }: { activity: GlobalActivityItem }) => {
  const typeInfo = ACTIVITY_TYPES[activity.type];
  
  // Format time as relative
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'MMM d');
    }
  };
  
  return (
    <div className="flex gap-3 py-2.5">
      <Avatar className="h-8 w-8">
        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
        <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-0.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-medium">{activity.user.name === "You" ? "You" : activity.user.name}</span>
          <span className="text-sm text-muted-foreground">{activity.action}</span>
          <Badge variant="outline" className={`${typeInfo.color} text-xs font-normal py-0.5 h-5`}>
            {typeInfo.label}
          </Badge>
          <Link href={activity.recordUrl} className="text-sm font-medium hover:underline">
            {activity.recordName}
          </Link>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{getRelativeTime(activity.timestamp)}</span>
        </div>
      </div>
      
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <MoreHorizontal className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

// Time period section
const TimePeriodSection = ({ title, activities }: { title: string; activities: GlobalActivityItem[] }) => {
  if (activities.length === 0) return null;
  
  return (
    <div className="space-y-1 mb-4">
      <h3 className="text-xs uppercase tracking-wider font-medium bg-muted/70 py-1.5 px-2 rounded-sm -mx-1">{title}</h3>
      <div>
        {activities.map(activity => (
          <React.Fragment key={activity.id}>
            <ActivityItem activity={activity} />
            <Separator className="my-1" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Filter options
const FilterOption = ({ 
  label, 
  isActive, 
  onClick 
}: { 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
}) => (
  <Button 
    variant={isActive ? "default" : "secondary"} 
    size="sm" 
    onClick={onClick}
    className={`h-7 text-xs px-2.5 ${isActive ? "" : "bg-muted hover:bg-muted/80"}`}
  >
    {label}
  </Button>
);

// Main component
export function HomeActivityFeed() {
  const [filter, setFilter] = useState<string>("all");
  const [activities] = useState<GlobalActivityItem[]>(generateMockActivities(30));
  
  // Apply filters
  const filteredActivities = activities.filter(activity => {
    if (filter === "all") return true;
    if (filter === "for-me") return activity.user.name === "You";
    if (filter === "created") return activity.action === "created";
    return activity.type === filter;
  });
  
  const groupedActivities = groupActivitiesByTimePeriod(filteredActivities);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <FilterOption 
            label="For me" 
            isActive={filter === "for-me"} 
            onClick={() => setFilter("for-me")} 
          />
          <FilterOption 
            label="Created" 
            isActive={filter === "created"} 
            onClick={() => setFilter("created")} 
          />
          <FilterOption 
            label="All" 
            isActive={filter === "all"} 
            onClick={() => setFilter("all")} 
          />
        </div>
        
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Filter className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <div className="relative">
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md border">
          <Avatar className="h-7 w-7">
            <AvatarImage src="/placeholder-user.jpg" alt="Your avatar" />
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <input 
              type="text"
              placeholder="What do you want to share?"
              className="w-full bg-transparent border-none focus:outline-none text-xs"
            />
          </div>
          <Button size="sm" className="h-7 text-xs px-2.5">Post</Button>
        </div>
      </div>
      
      <div>
        <TimePeriodSection title="Today" activities={groupedActivities.today} />
        <TimePeriodSection title="Yesterday" activities={groupedActivities.yesterday} />
        <TimePeriodSection title="This Week" activities={groupedActivities.thisWeek} />
        <TimePeriodSection title="Older" activities={groupedActivities.older} />
      </div>
    </div>
  );
}
