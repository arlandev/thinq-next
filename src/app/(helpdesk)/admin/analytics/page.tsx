'use client'

import PageLayout from "@/components/common/page-layout";
import NavBar from "@/components/common/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NumberCard from "@/components/common/number-card";
import type { ChartConfig } from "@/components/ui/chart"
import PieChartVisual from "@/components/common/pie-chart";
import BarChartVisualHorizontal from "@/components/common/bar-chart-horizontal";
import BarChartVisualVertical from "@/components/common/bar-char-vertical";
import AreaChartVisual from "@/components/common/area-chart";
import { Select } from "@/components/ui/select";

export default function AdminAnalyticsPage() {
  // ticket status
  const chartData = [
    { status: "New", tickets: 13, fill: "var(--color-new)" },
    { status: "Open", tickets: 7, fill: "var(--color-open)" },
    { status: "Closed", tickets: 37, fill: "var(--color-closed)" },
  ]

  const chartConfig = {
    tickets: {
      label: "Tickets",
    },
    new: {
      label: "New",
      color: "var(--chart-1)",
    },
    open: {
      label: "Open",
      color: "var(--chart-2)",
    },
    closed: {
      label: "Closed",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig

  // ticket rating
  const chartDataRating = [
    { rating: "5 stars", tickets: 45, fill: "var(--color-five)" },
    { rating: "4 stars", tickets: 3, fill: "var(--color-four)" },
    { rating: "3 stars", tickets: 2, fill: "var(--color-three)" },
    { rating: "2 stars", tickets: 0, fill: "var(--color-two)" },
    { rating: "1 stars", tickets: 0, fill: "var(--color-one)" },
  ]

  const chartConfigRating = {
    tickets: {
      label: "Tickets",
    },
    five: {
      label: "5 stars",
      color: "var(--chart-1)",
    },
    four: {
      label: "4 stars",
      color: "var(--chart-2)",
    },
    third: {
      label: "3 stars",
      color: "var(--chart-3)",
    },
    two: {
      label: "2 stars",
      color: "var(--chart-4)",
    },
    one: {
      label: "1 star",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig

  // concerns
  const chartDataConcerns = [
    { concern: "Con. 1", tickets: 26},
    { concern: "Con. 2", tickets: 19},
    { concern: "Con. 3", tickets: 9},
    { concern: "Con. 4", tickets: 7},
    { concern: "Con. 5", tickets: 3},
  ]

  const chartConfigConcern = {
    concern: {
      label: "Concern",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  // days to resolve
  const chartDataResolution = [
    { days: "0-5", tickets: 18},
    { days: "6-10", tickets: 14},
    { days: "11-15", tickets: 4},
    { days: "16-20", tickets: 21},
    { days: ">20", tickets: 8},
  ]

  const chartConfigResolution = {
    concern: {
      label: "Concern",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  // days to resolve
  const chartDataOpenClosed = [
    { month: "January", pending: 47, closed: 22 },
    { month: "February", pending: 74, closed: 36 },
    { month: "March", pending: 63, closed: 41 },
    { month: "April", pending: 91, closed: 27 },
    { month: "May", pending: 58, closed: 66 },
    { month: "June", pending: 104, closed: 80 },
    { month: "July", pending: 79, closed: 95 },
    { month: "August", pending: 66, closed: 39 },
    { month: "September", pending: 112, closed: 53 },
    { month: "October", pending: 87, closed: 46 },
    { month: "November", pending: 99, closed: 61 },
    { month: "December", pending: 72, closed: 38 },
  ]

  const chartConfigOpenClosed = {
    pending: {
      label: "Pending",
      color: "var(--chart-2)",
    },
    closed: {
      label: "Closed",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  return (
    <PageLayout navbar={<NavBar navBarLink="/admin" navBarLinkName="" />}>
      <div className="grid grid-cols-7 grid-rows-auto gap-5">
        <div className="row-start-1">
          <Button variant="default" className="">Back</Button>
        </div>

        {/* filter */}
        <div className="row-start-1 col-end-7">
          
        </div>

        {/* number cards */}
        <div className="row-start-2 col-span-1">
          <NumberCard count={20} title="Pending Tickets" />
        </div>
        <div className="row-start-3 col-span-1">
          <NumberCard count={13} title="Unassigned Tickets" />
        </div>
        <div className="row-start-4 col-span-1">
          <NumberCard count={57} title="Resolved Tickets" />
        </div>
        <div className="row-start-5 col-span-1">
          <NumberCard count={4.9} title="Average Ticket Rating" />
        </div>

        {/* pie chart ticket status */}
        <div className="row-start-2 row-span-2 col-span-2 col-start-2">
          <PieChartVisual 
            title="No. of Tickers per Status"
            chartConfig={chartConfig}
            chartData={chartData}
            dataKey="tickets"
            nameKey="status"
          />
        </div>

        {/* area chart */}
        <div className="row-start-2 row-span-3 col-span-4 col-start-4">
          <AreaChartVisual 
            title="No. of Pending & Closed Ticket Over Time"
            chartConfig={chartConfigOpenClosed}
            chartData={chartDataOpenClosed}
            dataKey="month"
            dataKey1="pending"
            dataKey2="closed"
            fill1={chartConfigOpenClosed.pending.color}
            fill2={chartConfigOpenClosed.closed.color}
          />
        </div>

        {/* bar chart top 5 concerns */}
        <div className="row-start-4 row-span-3 col-span-2 col-start-2">
          <BarChartVisualHorizontal 
            title="Top 5 Concerns"
            chartConfig={chartConfigConcern}
            chartData={chartDataConcerns}
            dataKeyX="tickets"
            dataKeyY="concern"
            fill={chartConfigConcern.concern.color}
          />
        </div>

        {/* histogram */}
        <div className="row-start-5 row-span-2 col-span-2 col-start-4">
          <BarChartVisualVertical
            title="No. of Days to Resolve Ticket"
            chartConfig={chartConfigResolution}
            chartData={chartDataResolution}
            dataKeyX="days"
            dataKeyY="tickets"
            fill={chartConfigResolution.concern.color}
          />
        </div>

        {/* pie chart ticket rating */}
        <div className="row-start-5 row-span-2 col-span-2 col-start-6">
          <PieChartVisual 
              title="No. of Tickets per Status"
              chartConfig={chartConfigRating}
              chartData={chartDataRating.filter(rating => rating.tickets > 0)}
              dataKey="tickets"
              nameKey="rating"
            />
        </div>

      </div>
    </PageLayout>
  )
}
