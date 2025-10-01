"use client";

import React, { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {Table, TableBody, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/common/navbar";
import WelcomeText from "@/components/common/welcome-text";
import PageLayout from "@/components/common/page-layout";
import TicketList, { TicketListWithSearch } from "@/components/common/list-tickets";
import { TableSkeleton } from "@/components/common/table-skeleton";
import { readTickets } from "@/app/actions/readTickets";
import { readTicketsPaginated, type TicketPaginationParams } from "@/app/actions/readTicketsPaginated";
import { getTicketCounts, type TicketCounts } from "@/app/actions/getTicketCounts";
import { toast } from "sonner";
import { Card,CardHeader,CardDescription,CardTitle,CardFooter } from "@/components/ui/card";
import { getUserSession } from "@/lib/session";

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
    reference_number: string;
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

function DispatcherHome() {
  // add Event Listener for Status column
  // if status is Closed, then status value is clickable and will show a modal
  // else, do nothing

  const [selectedFilter, setSelectedFilter] = useState<string[]>([])
  const [selected, setSelected] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [userSession, setUserSession] = useState<any>(null);
  
  // Server-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationInfo, setPaginationInfo] = useState<any>(null);
  const [ticketCache, setTicketCache] = useState<Map<string, {tickets: Ticket[], pagination: any}>>(new Map());
  const [totalTickets, setTotalTickets] = useState(0);
  const [ticketCounts, setTicketCounts] = useState<TicketCounts>({
    total: 0,
    new: 0,
    open: 0,
    closed: 0,
    newAndOpen: 0
  });
  const [currentUserType, setCurrentUserType] = useState('EMPLOYEE');
  
  useEffect(() => {
    const session = getUserSession();
    setUserSession(session);
  }, []);

  // Function to generate cache key
  const getCacheKey = (userType: string, page: number, statusFilters: string[], search: string) => {
    return `${userType}-${page}-${statusFilters.join(',')}-${search}`;
  };

  // Function to fetch tickets with caching
  const fetchTicketsPaginated = async (userType: string, page: number, statusFilters: string[], search: string = '') => {
    const cacheKey = getCacheKey(userType, page, statusFilters, search);
    
    // Check cache first
    if (ticketCache.has(cacheKey)) {
      const cachedData = ticketCache.get(cacheKey)!;
      setTickets(cachedData.tickets);
      setPaginationInfo(cachedData.pagination);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch both tickets and counts in parallel
      const [result, counts] = await Promise.all([
        readTicketsPaginated({
          page,
          pageSize: 10,
          userType,
          statusFilters,
          searchQuery: search
        }),
        getTicketCounts(userType, statusFilters, search)
      ]);

      if (result) {
        setTickets(result.tickets);
        setPaginationInfo(result.pagination);
        setTotalTickets(result.pagination.totalItems);
        setTicketCounts(counts);
        
        // Cache the results
        setTicketCache(prev => new Map(prev.set(cacheKey, {
          tickets: result.tickets,
          pagination: result.pagination
        })));
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to Load Tickets");
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data for both user types
  useEffect(() => {
    fetchTicketsPaginated('EMPLOYEE', 1, selectedFilter, searchQuery);
  }, [selectedFilter, searchQuery]);

  // Function to handle tab changes
  const handleTabChange = (value: string) => {
    const userType = value === 'employees' ? 'EMPLOYEE' : 'STUDENT';
    setCurrentUserType(userType);
    setCurrentPage(1);
    fetchTicketsPaginated(userType, 1, selectedFilter, searchQuery);
  };

  // Function to handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTicketsPaginated(currentUserType, page, selectedFilter, searchQuery);
  };

  // Function to handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchTicketsPaginated(currentUserType, 1, selectedFilter, query);
  };

  const handleAssignmentCompletion = () => {
    // Clear cache and refetch current page
    setTicketCache(new Map());
    fetchTicketsPaginated(currentUserType, currentPage, selectedFilter, searchQuery);
    toast.success("Tickets Refreshed Successfully");
  }


  return (
    <PageLayout navbar={<NavBar />}>
      {/* Welcome Section */}
      <WelcomeText 
        firstName={userSession?.user_firstname || "User"} 
        lastName={userSession?.user_lastname || ""} 
      />
      {/* Tabs Container */}
      <Tabs defaultValue="employees" className="flex-grow flex flex-col" onValueChange={handleTabChange}>
        <div className="p-8 w-full">
          <div className="container mx-auto flex justify-center items-center">
            <TabsList className="w-full max-w-[600px]">
              <TabsTrigger value="employees" className="flex-1 text-2xl py-3">EMPLOYEES</TabsTrigger>
              <TabsTrigger value="students" className="flex-1 text-2xl py-3">STUDENTS</TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Employees Tab Content */}
        <TabsContent value="employees" className="flex-grow flex flex-col mt-0">
          <div className="flex flex-col md:flex-row gap-8 flex-grow">
            {/* Left Column */}
            <div className="w-full md:w-64 flex-shrink-0 space-y-8 row-start-2">
              {/* Status Buttons */}
              <div className="space-y-4">
                <div className="font-medium">FILTER BY STATUS</div>
                <div className="space-y-2 w-3/4">
                  <Card className={selected==='NEWOPEN'?'py-3 gap-0 pointer-events-none opacity-60 invert':'py-3 gap-0 cursor-pointer invert'} onClick={() => {setSelectedFilter(['NEW','OPEN']);setSelected('NEWOPEN')}}>
                    <CardHeader><CardTitle className="text-5xl text-center">{ticketCounts.newAndOpen}</CardTitle></CardHeader>
                    <CardFooter className="px-0"><p className="text-sm text-center w-full">NEW & OPEN</p></CardFooter>
                  </Card>
                  <Card className={selected==='NEW'?'py-3 gap-0 pointer-events-none opacity-60 invert':'py-3 gap-0 cursor-pointer invert'} onClick={() => {setSelectedFilter(['NEW']);setSelected('NEW')}}>
                    <CardHeader><CardTitle className="text-5xl text-center">{ticketCounts.new}</CardTitle></CardHeader>
                    <CardFooter className="px-0"><p className="text-sm text-center w-full">NEW</p></CardFooter>
                  </Card>
                  <Card className={selected==='OPEN'?'py-3 gap-0 pointer-events-none opacity-60 invert':'py-3 gap-0 cursor-pointer invert'} onClick={() => {setSelectedFilter(['OPEN']);setSelected('OPEN')}}>
                    <CardHeader><CardTitle className="text-5xl text-center">{ticketCounts.open}</CardTitle></CardHeader>
                    <CardFooter className="px-0"><p className="text-sm text-center w-full">OPEN</p></CardFooter>
                  </Card>
                  <Card className={selected==='CLOSED'?'py-3 gap-0 pointer-events-none opacity-60 invert':'py-3 gap-0 cursor-pointer invert'} onClick={() => {setSelectedFilter(['CLOSED']);setSelected('CLOSED')}}>
                    <CardHeader><CardTitle className="text-5xl text-center">{ticketCounts.closed}</CardTitle></CardHeader>
                    <CardFooter className="px-0"><p className="text-sm text-center w-full">CLOSED</p></CardFooter>
                  </Card>
                  <Button className={selected===''?'pointer-events-none opacity-50 w-full':'w-full bg-blue-500 text-white hover:bg-blue-500 hover:opacity-80'} onClick={() => {setSelectedFilter([]);setSelected('')}}>CLEAR</Button>
                </div>
              </div>
            </div>

            {/* Right Column - Employees Table */}
            <div className="flex-grow flex flex-col">
              {isLoading ? (
                <TableSkeleton rows={6} />
              ) : (
                <div className="bg-white rounded-lg shadow-xl flex-grow flex flex-col">
                  <TicketListWithSearch 
                    user_type="EMPLOYEE" 
                    filter_status={selectedFilter} 
                    tickets={tickets} 
                    onAssignmentComplete={handleAssignmentCompletion}
                    showSearchAndPagination={true}
                    pageSize={10}
                    paginationInfo={paginationInfo}
                    onPageChange={handlePageChange}
                    onSearch={handleSearch}
                    searchQuery={searchQuery}
                  />
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Students Tab Content */}
        <TabsContent value="students" className="flex-grow flex flex-col mt-0">
          <div className="flex flex-col md:flex-row gap-8 flex-grow">
            {/* Left Column */}
            <div className="w-full md:w-64 flex-shrink-0 space-y-8">
              {/* Status Buttons */}
              <div className="space-y-4">
                <div className="font-medium">FILTER BY STATUS</div>
                <div className="space-y-2 w-3/4">
                  <Card className={selected==='NEWOPEN'?'py-3 gap-0 pointer-events-none opacity-60 invert':'py-3 gap-0 cursor-pointer invert'} onClick={() => {setSelectedFilter(['NEW','OPEN']);setSelected('NEWOPEN')}}>
                    <CardHeader><CardTitle className="text-5xl text-center">{ticketCounts.newAndOpen}</CardTitle></CardHeader>
                    <CardFooter className="px-0"><p className="text-sm text-center w-full">NEW & OPEN</p></CardFooter>
                  </Card>
                  <Card className={selected==='NEW'?'py-3 gap-0 pointer-events-none opacity-60 invert':'py-3 gap-0 cursor-pointer invert'} onClick={() => {setSelectedFilter(['NEW']);setSelected('NEW')}}>
                    <CardHeader><CardTitle className="text-5xl text-center">{ticketCounts.new}</CardTitle></CardHeader>
                    <CardFooter className="px-0"><p className="text-sm text-center w-full">NEW</p></CardFooter>
                  </Card>
                  <Card className={selected==='OPEN'?'py-3 gap-0 pointer-events-none opacity-60 invert':'py-3 gap-0 cursor-pointer invert'} onClick={() => {setSelectedFilter(['OPEN']);setSelected('OPEN')}}>
                    <CardHeader><CardTitle className="text-5xl text-center">{ticketCounts.open}</CardTitle></CardHeader>
                    <CardFooter className="px-0"><p className="text-sm text-center w-full">OPEN</p></CardFooter>
                  </Card>
                  <Card className={selected==='CLOSED'?'py-3 gap-0 pointer-events-none opacity-60 invert':'py-3 gap-0 cursor-pointer invert'} onClick={() => {setSelectedFilter(['CLOSED']);setSelected('CLOSED')}}>
                    <CardHeader><CardTitle className="text-5xl text-center">{ticketCounts.closed}</CardTitle></CardHeader>
                    <CardFooter className="px-0"><p className="text-sm text-center w-full">CLOSED</p></CardFooter>
                  </Card>
                  <Button className={selected===''?'pointer-events-none opacity-50 w-full':'w-full bg-blue-500 text-white hover:bg-blue-500 hover:opacity-80'} onClick={() => {setSelectedFilter([]);setSelected('')}}>CLEAR</Button>
                </div>
              </div>
            </div>

            {/* Right Column - Students Table */}
            <div className="flex-grow flex flex-col">
              {isLoading ? (
                <TableSkeleton rows={6} />
              ) : (
                <div className="bg-white rounded-lg shadow-xl flex-grow flex flex-col">
                  <TicketListWithSearch 
                    user_type="STUDENT" 
                    filter_status={selectedFilter} 
                    tickets={tickets} 
                    onAssignmentComplete={handleAssignmentCompletion}
                    showSearchAndPagination={true}
                    pageSize={10}
                    paginationInfo={paginationInfo}
                    onPageChange={handlePageChange}
                    onSearch={handleSearch}
                    searchQuery={searchQuery}
                  />
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}

export default DispatcherHome;
