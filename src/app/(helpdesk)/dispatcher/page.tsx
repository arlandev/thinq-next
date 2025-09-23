"use client";

import React, { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {Table, TableBody, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/common/navbar";
import WelcomeText from "@/components/common/welcome-text";
import PageLayout from "@/components/common/page-layout";
import TicketList from "@/components/common/list-tickets";
import { TableSkeleton } from "@/components/common/table-skeleton";
import { readTickets } from "@/app/actions/readTickets";
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
  const [ isLoading , setIsLoading ] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [userSession, setUserSession] = useState<any>(null);
  
  useEffect(() => {
    const session = getUserSession();
    setUserSession(session);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const ticketsData = await readTickets();
        console.log(ticketsData);
        if (isMounted) {
          setTickets(ticketsData as unknown as Ticket[]);
          toast.success("Tickets Loaded Successfully");
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
        if (isMounted) {
          toast.error("Failed to Load Tickets");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTickets();

    return () => {
      isMounted = false;
    };
  }, []);

  // Function to handle tab changes - no longer needs to trigger loading
  const handleTabChange = (value: string) => {
    // Tab change no longer triggers data fetching
  };

  const handleAssignmentCompletion = () => {
    let isMounted = true;
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const ticketsData = await readTickets();
        if (isMounted) {
          setTickets(ticketsData as unknown as Ticket[]);
          toast.success("Tickets Refreshed Successfully");
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
        if (isMounted) {
          toast.error("Failed to Refresh Tickets");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTickets();
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
                    <CardHeader><CardTitle className="text-5xl text-center">{tickets.filter(ticket => (ticket.ticket_status==='NEW' || ticket.ticket_status==='OPEN') && ticket.inquirer?.user_type==='EMPLOYEE').length}</CardTitle></CardHeader>
                    <CardFooter className="px-0"><p className="text-sm text-center w-full">NEW & OPEN</p></CardFooter>
                  </Card>
                  <Card className={selected==='NEW'?'py-3 gap-0 pointer-events-none opacity-60 invert':'py-3 gap-0 cursor-pointer invert'} onClick={() => {setSelectedFilter(['NEW']);setSelected('NEW')}}>
                    <CardHeader><CardTitle className="text-5xl text-center">{tickets.filter(ticket => (ticket.ticket_status==='NEW') && ticket.inquirer?.user_type==='EMPLOYEE').length}</CardTitle></CardHeader>
                    <CardFooter className="px-0"><p className="text-sm text-center w-full">NEW</p></CardFooter>
                  </Card>
                  <Card className={selected==='OPEN'?'py-3 gap-0 pointer-events-none opacity-60 invert':'py-3 gap-0 cursor-pointer invert'} onClick={() => {setSelectedFilter(['OPEN']);setSelected('OPEN')}}>
                    <CardHeader><CardTitle className="text-5xl text-center">{tickets.filter(ticket => (ticket.ticket_status==='OPEN') && ticket.inquirer?.user_type==='EMPLOYEE').length}</CardTitle></CardHeader>
                    <CardFooter className="px-0"><p className="text-sm text-center w-full">OPEN</p></CardFooter>
                  </Card>
                  <Card className={selected==='CLOSED'?'py-3 gap-0 pointer-events-none opacity-60 invert':'py-3 gap-0 cursor-pointer invert'} onClick={() => {setSelectedFilter(['CLOSED']);setSelected('CLOSED')}}>
                    <CardHeader><CardTitle className="text-5xl text-center">{tickets.filter(ticket => (ticket.ticket_status==='CLOSED') && ticket.inquirer?.user_type==='EMPLOYEE').length}</CardTitle></CardHeader>
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
                  <div className="flex flex-col h-full">
                    <Table className="h-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Inquiry Date</TableHead>
                          <TableHead>Ref. No.</TableHead>
                          <TableHead>Concern</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Assignment</TableHead>
                          <TableHead className="text-right">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="h-full">
                        <TicketList user_type="EMPLOYEE" filter_status={selectedFilter} tickets={tickets} onAssignmentComplete={handleAssignmentCompletion}/>
                      </TableBody>
                    </Table>
                  </div>
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
                    <CardHeader><CardTitle className="text-5xl text-center">{tickets.filter(ticket => (ticket.ticket_status==='NEW' || ticket.ticket_status==='OPEN') && ticket.inquirer?.user_type==='STUDENT').length}</CardTitle></CardHeader>
                    <CardFooter className="px-0"><p className="text-sm text-center w-full">NEW & OPEN</p></CardFooter>
                  </Card>
                  <Card className={selected==='NEW'?'py-3 gap-0 pointer-events-none opacity-60 invert':'py-3 gap-0 cursor-pointer invert'} onClick={() => {setSelectedFilter(['NEW']);setSelected('NEW')}}>
                    <CardHeader><CardTitle className="text-5xl text-center">{tickets.filter(ticket => (ticket.ticket_status==='NEW') && ticket.inquirer?.user_type==='STUDENT').length}</CardTitle></CardHeader>
                    <CardFooter className="px-0"><p className="text-sm text-center w-full">NEW</p></CardFooter>
                  </Card>
                  <Card className={selected==='OPEN'?'py-3 gap-0 pointer-events-none opacity-60 invert':'py-3 gap-0 cursor-pointer invert'} onClick={() => {setSelectedFilter(['OPEN']);setSelected('OPEN')}}>
                    <CardHeader><CardTitle className="text-5xl text-center">{tickets.filter(ticket => (ticket.ticket_status==='OPEN') && ticket.inquirer?.user_type==='STUDENT').length}</CardTitle></CardHeader>
                    <CardFooter className="px-0"><p className="text-sm text-center w-full">OPEN</p></CardFooter>
                  </Card>
                  <Card className={selected==='CLOSED'?'py-3 gap-0 pointer-events-none opacity-60 invert':'py-3 gap-0 cursor-pointer invert'} onClick={() => {setSelectedFilter(['CLOSED']);setSelected('CLOSED')}}>
                    <CardHeader><CardTitle className="text-5xl text-center">{tickets.filter(ticket => (ticket.ticket_status==='CLOSED') && ticket.inquirer?.user_type==='STUDENT').length}</CardTitle></CardHeader>
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
                  <div className="flex flex-col h-full">
                    <Table className="h-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Inquiry Date</TableHead>
                          <TableHead>Ref. No.</TableHead>
                          <TableHead>Concern</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Assignment</TableHead>
                          <TableHead className="text-right">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="h-full">
                        <TicketList user_type="STUDENT" filter_status={selectedFilter} tickets={tickets} onAssignmentComplete={handleAssignmentCompletion}/>
                      </TableBody>
                    </Table>
                  </div>
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
