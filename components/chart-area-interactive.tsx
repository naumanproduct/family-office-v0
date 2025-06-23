"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Asset performance and balance data over time
const assetPerformanceData = [
  { date: "2024-01-01", performance: 0, balance: 22.1 },
  { date: "2024-01-15", performance: 0.8, balance: 22.3 },
  { date: "2024-02-01", performance: 1.2, balance: 22.5 },
  { date: "2024-02-15", performance: 2.5, balance: 22.9 },
  { date: "2024-03-01", performance: 3.1, balance: 23.1 },
  { date: "2024-03-15", performance: 4.2, balance: 23.3 },
  { date: "2024-04-01", performance: 5.8, balance: 23.6 },
  { date: "2024-04-15", performance: 6.3, balance: 23.8 },
  { date: "2024-05-01", performance: 7.9, balance: 24.0 },
  { date: "2024-05-15", performance: 9.5, balance: 24.3 },
  { date: "2024-06-01", performance: 10.8, balance: 24.5 },
  { date: "2024-06-15", performance: 11.6, balance: 24.7 },
  { date: "2024-07-01", performance: 12.4, balance: 24.7 },
]

// Liability data over time
const liabilityData = [
  { date: "2024-01-01", debt: 5.6, interest: 0.022 },
  { date: "2024-01-15", debt: 5.58, interest: 0.022 },
  { date: "2024-02-01", debt: 5.55, interest: 0.022 },
  { date: "2024-02-15", debt: 5.52, interest: 0.022 },
  { date: "2024-03-01", debt: 5.5, interest: 0.022 },
  { date: "2024-03-15", debt: 5.48, interest: 0.022 },
  { date: "2024-04-01", debt: 5.45, interest: 0.023 },
  { date: "2024-04-15", debt: 5.4, interest: 0.023 },
  { date: "2024-05-01", debt: 5.35, interest: 0.024 },
  { date: "2024-05-15", debt: 5.3, interest: 0.024 },
  { date: "2024-06-01", debt: 5.25, interest: 0.024 },
  { date: "2024-06-15", debt: 5.2, interest: 0.025 },
  { date: "2024-07-01", debt: 5.2, interest: 0.025 },
]

const assetChartConfig = {
  performance: {
    label: "Performance (%)",
    color: "hsl(var(--chart-1))",
  },
  balance: {
    label: "AUM ($M)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const liabilityChartConfig = {
  debt: {
    label: "Total Debt ($M)",
    color: "hsl(var(--chart-1))",
  },
  interest: {
    label: "Monthly Interest ($M)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface ChartAreaInteractiveProps {
  viewType?: "assets" | "liabilities";
}

export function ChartAreaInteractive({ viewType: initialViewType = "assets" }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const [viewType, setViewType] = React.useState<"assets" | "liabilities">(initialViewType)
  const [showBalance, setShowBalance] = React.useState(false)
  
  // Update local state when prop changes
  React.useEffect(() => {
    setViewType(initialViewType);
  }, [initialViewType]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Filter data based on selected time range
  const getFilteredData = () => {
    const currentData = viewType === "assets" ? assetPerformanceData : liabilityData
    
    if (timeRange === "30d") {
      return currentData.slice(-3) // Last 30 days (simplified)
    } else if (timeRange === "7d") {
      return currentData.slice(-1) // Last 7 days (simplified)
    }
    
    return currentData // Full 90 days
  }

  const filteredData = getFilteredData()
  const chartConfig = viewType === "assets" ? assetChartConfig : liabilityChartConfig

  return (
    <Card className="@container/card">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{viewType === "assets" ? "Asset Overview" : "Liability Overview"}</CardTitle>
              <CardDescription>
                {viewType === "assets" 
                  ? (showBalance ? "AUM Balance" : "Performance") + " over time" 
                  : "Debt and interest trends"}
              </CardDescription>
            </div>
            
            {viewType === "assets" && (
              <div className="flex items-center space-x-2 z-10">
                <Label htmlFor="performance-toggle" className={`text-sm ${!showBalance ? "font-medium" : ""}`}>
                  Performance
                </Label>
                <Switch 
                  id="performance-toggle" 
                  checked={showBalance}
                  onCheckedChange={setShowBalance}
                />
                <Label htmlFor="performance-toggle" className={`text-sm ${showBalance ? "font-medium" : ""}`}>
                  Balance
                </Label>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="@[767px]/card:flex hidden"
            >
              <ToggleGroupItem value="90d" className="h-8 px-2.5">
                Last 6 months
              </ToggleGroupItem>
              <ToggleGroupItem value="30d" className="h-8 px-2.5">
                Last 3 months
              </ToggleGroupItem>
              <ToggleGroupItem value="7d" className="h-8 px-2.5">
                Last month
              </ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="@[767px]/card:hidden flex w-40"
                aria-label="Select a time range"
              >
                <SelectValue placeholder="Last 6 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Last 6 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last month
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-performance)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-performance)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSecondary" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-balance)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-balance)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatDate}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              width={30}
              tickFormatter={(value) => {
                if (viewType === "assets") {
                  return showBalance ? `${value}M` : `${value}%`;
                } else {
                  return value < 1 ? `${(value * 100).toFixed(0)}K` : `${value}M`;
                }
              }}
            />
            {viewType === "assets" ? (
              showBalance ? (
                <Area
                  dataKey="balance"
                  stroke="var(--color-balance)"
                  fill="url(#fillSecondary)"
                  strokeWidth={2}
                />
              ) : (
                <Area
                  dataKey="performance"
                  stroke="var(--color-performance)"
                  fill="url(#fillPrimary)"
                  strokeWidth={2}
                />
              )
            ) : (
              <>
                <Area
                  dataKey="debt"
                  stroke="var(--color-debt)"
                  fill="url(#fillPrimary)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="interest"
                  stroke="var(--color-interest)"
                  fill="url(#fillSecondary)"
                  strokeWidth={2}
                />
              </>
            )}
            <ChartTooltip
              formatter={(value) => {
                if (viewType === "assets") {
                  return [showBalance ? `$${value}M` : `${value}%`, showBalance ? "AUM Balance" : "Performance"];
                } else {
                  return [`$${(value as number) < 1 ? `${((value as number) * 1000).toFixed(0)}K` : `${value}M`}`, (value as number) < 1 ? "Interest" : "Debt"];
                }
              }}
              labelFormatter={(label) => formatDate(label as string)}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
