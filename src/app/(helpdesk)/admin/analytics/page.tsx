'use client'

import Link from "next/link";
import { differenceInDays } from "date-fns";
import { useState, useEffect } from "react";
import PageLayout from "@/components/common/page-layout";
import NavBar from "@/components/common/navbar";
import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NumberCard from "@/components/common/number-card";
import type { ChartConfig } from "@/components/ui/chart"
import PieChartVisual from "@/components/common/pie-chart";
import BarChartVisualHorizontal from "@/components/common/bar-chart-horizontal";
import BarChartVisualVertical from "@/components/common/bar-char-vertical";
import AreaChartVisual from "@/components/common/area-chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { readTickets } from "@/app/actions/readTickets";

interface Ticket {
  ticket_id: number;
  ticket_submitteddate: Date;
  inquirer_id: number;
  concern_id: number;
  ticket_concern: string;
  ticket_details: string;
  ticket_subconcern: string;
  ticket_attachment: String[];
  ticket_status: string;
  assignee_id: number | null;
  ticket_resolution: string;
  ticket_closedby: number | null;
  ticket_resolveddate: Date;
  ticket_rating: number;

  inquirer?: {
      user_type: string;
      user_firstname: string;
      user_lastname: string;
      user_email: string;
      user_affiliation: string;
  };
  assignee?: {
      user_type: string;
      user_firstname: string;
      user_lastname: string;
      user_email: string;
  };
  closedby?: {
    user_firstname: string;
    user_lastname: string;
    user_email: string;
  }
}

export default function AdminAnalyticsPage() {

  //filters
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [concernFilter, setConcernFilter] = useState<string>('')
  //data
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);

  //fetch tickets
  useEffect(() => {
    let isMounted = true;
    
    const fetchTickets = async () => {
      try {
        const ticketsData = await readTickets();
        if (isMounted) {
          setTickets(ticketsData as unknown as Ticket[]);
          toast.success("Dashboard loaded successfully");
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        if (isMounted) {
          toast.error("Failed to load dashboard");
        }
      }
    };

    fetchTickets();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const filtered = tickets.filter(ticket => {
      const selectedStatus = statusFilter==='' || ticket.ticket_status===statusFilter;
      const selectedConcern = concernFilter==='' || ticket.ticket_concern===concernFilter;
      
      return selectedStatus && selectedConcern
    })

    setFilteredTickets(filtered)
  }, [tickets, statusFilter, concernFilter])

  // -------------------COLORS
  const STATUS_COLORS: Record<string, string> = {
    NEW: "var(--color-new)",
    OPEN: "var(--color-open)",
    CLOSED: "var(--color-closed)",
  };

  const RATING_COLORS: Record<string, string> = {
    "1 star": "var(--color-one)",
    "2 stars": "var(--color-two)",
    "3 stars": "var(--color-three)",
    "4 stars": "var(--color-four)",
    "5 stars": "var(--color-five)",
  };

  //-------------------SET & GET CHART DATA

  //status
  const setTicketStatusCount = filteredTickets.reduce((acc, ticket) => {
    const status = ticket.ticket_status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartDataStatus = Object.entries(setTicketStatusCount).map(([status, count]) => ({
    status,
    tickets: count,
    fill: STATUS_COLORS[status] || "#ccc",
  }));

  const setConcernCount = filteredTickets.reduce((acc, ticket) => {
    const concern = ticket.ticket_concern;
    acc[concern] = (acc[concern] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartDataConcerns = Object.entries(setConcernCount).map(([concern, count]) => ({
    concern,
    tickets: count
  }))
  .sort((a, b) => b.tickets - a.tickets)
  .slice(0, 5);

  const setTicketRatingCount = filteredTickets.reduce((acc, ticket) => {
    const rating = ticket.ticket_rating;
    if (typeof rating === "number") {
      rating > 1 ? 
      acc[rating + " stars"] = (acc[rating + " stars"] || 0) + 1 :
      acc[rating + " star"] = (acc[rating + " star"] || 0) + 1
    }
    return acc;
  }, {} as Record<string, number>);

  const chartDataRating = Object.entries(setTicketRatingCount).map(([rating, count]) => ({
    rating,
    tickets: count,
    fill: RATING_COLORS[rating] || "#ccc",
  }));

  const customBins = [
    { min: 0, max: 5, label: "0-5" },
    { min: 6, max: 10, label: "6-10" },
    { min: 11, max: 15, label: "11-15" },
    { min: 16, max: 20, label: "11-15" },
  ];

  function getCustomBin(value: number, bins: { min: number; max: number; label: string }[]): string {
    const found = bins.find(bin => value >= bin.min && value <= bin.max);
    return found ? found.label : ">20";
  }

  const setResolutionCount = filteredTickets.reduce((acc, ticket) => {

    if(ticket.ticket_resolveddate instanceof Date) {
      const daysResolved = differenceInDays(ticket.ticket_resolveddate, ticket.ticket_submitteddate);
      const binLabel = getCustomBin(daysResolved, customBins);
      acc[binLabel] = (acc[binLabel] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const chartDataResolution = Object.entries(setResolutionCount).map(([days, count]) => ({
    days,
    tickets: count
  }));

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const setPendingCount = filteredTickets.filter(ticket => ticket.ticket_status==='NEW' || ticket.ticket_status==='OPEN').reduce((acc, ticket) => {

    const date = new Date(ticket.ticket_submitteddate);
    const monthName = months[date.getMonth()] ?? '';
  
    acc[monthName] = (acc[monthName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const setClosedCount = filteredTickets.filter(ticket => ticket.ticket_status==='CLOSED').reduce((acc, ticket) => {

    const date = new Date(ticket.ticket_submitteddate);
    const monthName = months[date.getMonth()] ?? '';
  
    acc[monthName] = (acc[monthName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  
  const chartDataOpenClosed = months.map((month) => ({
    month,
    pending: setPendingCount[month] || 0,
    closed: setClosedCount[month] || 0
  }));

  //-------------------CONFIG

  //status
  const chartConfigStatus = {
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

  //ticket rating
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

  //concern
  const chartConfigConcern = {
    concern: {
      label: "Concern",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  //days to resolve
  const chartConfigResolution = {
    concern: {
      label: "Concern",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  //open closed
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


  const ratedTickets = filteredTickets.filter(ticket => typeof ticket.ticket_rating === "number");
  const totalRating = ratedTickets.reduce((sum, ticket) => sum + ticket.ticket_rating, 0);

  return (
    <PageLayout navbar={<NavBar navBarLink="/admin" navBarLinkName="" />}>
      <div className="grid grid-cols-7 grid-rows-auto gap-5">
        <div className="row-start-1">
          <Link href="/admin"><Button variant="default" className="">Back</Button></Link>
        </div>

        {/* filter */}
        <div className="row-start-1 col-end-8 place-items-end">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ticket Status"/>
            </SelectTrigger>
            <SelectContent>
              {[...new Set(tickets.map(ticket => ticket.ticket_status))].map((status) => (
                <SelectItem key={status} value={status} onClick={() => setStatusFilter(status)}>{status}</SelectItem>
              ))}
              <Separator className="my-1"/>
              <a className="ml-2 text-xs opacity-50 hover:opacity-25 cursor-pointer" onClick={() => setStatusFilter('')}>Clear Selection</a>
            </SelectContent>
          </Select>
        </div>

        <div className="row-start-1 col-end-7 col-span-2 place-items-end">
          <Select value={concernFilter} onValueChange={setConcernFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Concern"/>
            </SelectTrigger>
            <SelectContent>
              {[...new Set(tickets.map(ticket => ticket.ticket_concern))].map((concern) => (
                <SelectItem key={concern} value={concern} onClick={() => setConcernFilter(concern)}>{concern}</SelectItem>
              ))}
              <Separator className="my-1"/>
              <a className="ml-2 text-xs opacity-50 hover:opacity-25 cursor-pointer" onClick={() => setConcernFilter('')}>Clear Selection</a>
            </SelectContent>
          </Select>
        </div>


        {/* number cards */}
        <div className="row-start-2 col-span-1">
          <NumberCard count={filteredTickets.filter(ticket => ticket.ticket_status==='NEW'||ticket.ticket_status==='OPEN').length} title="Pending Tickets" />
        </div>
        <div className="row-start-3 col-span-1">
          <NumberCard count={filteredTickets.filter(ticket => ticket.assignee_id===null).length} title="Unassigned Tickets" />
        </div>
        <div className="row-start-4 col-span-1">
          <NumberCard count={filteredTickets.filter(ticket => ticket.ticket_status==='CLOSED').length} title="Resolved Tickets" />
        </div>
        <div className="row-start-5 col-span-1">
          <NumberCard count={ratedTickets.length > 0 ? Number((totalRating/ratedTickets.length).toFixed(1)) : 0} title="Average Ticket Rating" />
        </div>

        {/* pie chart ticket status */}
        <div className="row-start-2 row-span-2 col-span-2 col-start-2">
          <PieChartVisual 
            title="No. of Tickers per Status"
            chartConfig={chartConfigStatus}
            chartData={chartDataStatus}
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
              title="No. of Tickets per Rating"
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
