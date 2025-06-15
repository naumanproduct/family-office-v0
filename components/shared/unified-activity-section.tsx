"use client"

import * as React from "react"
import { ChevronRight, ChevronDown } from "lucide-react"

export interface ActivityItem {
  id: number
  type: string
  actor: string
  action: string
  target: string
  timestamp: string
  date?: string
  content?: string
  details?: any
}

interface UnifiedActivitySectionProps {
  activities: ActivityItem[]
}

export function UnifiedActivitySection({ activities }: UnifiedActivitySectionProps) {
  const [expandedActivity, setExpandedActivity] = React.useState<number | null>(null)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "update":
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>
      case "stage_change":
      case "status_change":
        return <div className="h-2 w-2 rounded-full bg-orange-500"></div>
      case "creation":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>
      case "distribution":
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>
      case "investment":
        return <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
      case "meeting":
        return <div className="h-2 w-2 rounded-full bg-violet-500"></div>
      case "comment":
        return <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
      case "funding":
        return <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
      case "partnership":
        return <div className="h-2 w-2 rounded-full bg-pink-500"></div>
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>
    }
  }

  const formatActivityText = (activity: ActivityItem) => {
    return (
      <span className="text-sm">
        <span className="font-medium">{activity.actor}</span>{" "}
        <span>{activity.action}</span>{" "}
        <span className="font-medium">{activity.target}</span>
      </span>
    )
  }

  const renderExpandedDetails = (activity: ActivityItem) => {
    if (!activity.details && !activity.content) return null

    if (activity.content) {
      return (
        <div className="mt-4">
          <p className="text-sm">{activity.content}</p>
        </div>
      )
    }

    switch (activity.type) {
      case "distribution":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Distribution Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Amount:</span>{" "}
                  <span>{activity.details.amount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  <span>{activity.details.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Per Share:</span>{" "}
                  <span>{activity.details.perShare}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Shares:</span>{" "}
                  <span>{activity.details.totalShares}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Payment Date</h5>
              <p className="text-sm text-muted-foreground">{activity.details.paymentDate}</p>
            </div>
          </div>
        )

      case "investment":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Investment Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Amount:</span>{" "}
                  <span>{activity.details.amount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  <span>{activity.details.investmentType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Sector:</span>{" "}
                  <span>{activity.details.sector}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Geography:</span>{" "}
                  <span>{activity.details.geography}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Approval Date:</span>{" "}
                <span>{activity.details.approvalDate}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Funding Date:</span>{" "}
                <span>{activity.details.fundingDate}</span>
              </div>
            </div>
          </div>
        )

      case "stage_change":
      case "status_change":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Change Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Previous:</span>{" "}
                  <span>{activity.details.previousStage || activity.details.previousStatus}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">New:</span>{" "}
                  <span>{activity.details.newStage || activity.details.newStatus}</span>
                </div>
                {activity.details.reason && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Reason:</span>{" "}
                    <span>{activity.details.reason}</span>
                  </div>
                )}
              </div>
            </div>
            {activity.details.nextSteps && (
              <div>
                <h5 className="text-sm font-medium mb-1">Next Steps</h5>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {activity.details.nextSteps.map((step: string, index: number) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )

      case "meeting":
        return (
          <div className="mt-4 space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-2">Meeting Details</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  <span>{activity.details.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>{" "}
                  <span>{activity.details.duration}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Topics</h5>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {activity.details.topics.map((topic: string, index: number) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Outcome</h5>
              <p className="text-sm text-muted-foreground">{activity.details.outcome}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">Next Steps</h5>
              <p className="text-sm text-muted-foreground">{activity.details.nextSteps}</p>
            </div>
          </div>
        )

      default:
        return (
          <div className="mt-4 space-y-3">
            {Object.entries(activity.details || {}).map(([key, value]) => (
              <div key={key}>
                <h5 className="text-sm font-medium mb-1">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</h5>
                {Array.isArray(value) ? (
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    {(value as any[]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">{value as string}</p>
                )}
              </div>
            ))}
          </div>
        )
    }
  }

  return (
    <div className="space-y-2">
      {activities.map((activity) => {
        const isExpanded = expandedActivity === activity.id;
        
        return (
          <div 
            key={activity.id} 
            className={`${
              isExpanded ? 'border rounded-lg overflow-hidden' : ''
            }`}
          >
            <div 
              className={`flex items-center ${isExpanded ? 'p-3 border-b bg-muted/20' : 'py-2 px-3'} cursor-pointer`}
              onClick={() => setExpandedActivity(isExpanded ? null : activity.id)}
            >
              <div className="flex items-center flex-1">
                {getActivityIcon(activity.type)}
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div>{formatActivityText(activity)}</div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
              </div>
              <div className="ml-2">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
            
            {isExpanded && (
              <div className="p-3">
                {renderExpandedDetails(activity)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
