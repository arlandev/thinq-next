'use client'

import NavBar from "@/components/common/navbar";
import WelcomeText from "@/components/common/welcome-text";
import PageLayout from "@/components/common/page-layout";
import { useState , useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TableSkeleton } from "@/components/common/table-skeleton";
import { PendingCountSkeleton } from "@/components/common/pending-count-skeleton";
import PersonnelInquiryDialog from "@/components/common/personnel-inquiry-dialog";

import { Button } from "@/components/ui/button";
import { readTickets } from "@/app/actions/readTickets";
import { toast } from "sonner";
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

  inquirer?: {
    user_type: string;
    user_firstname: string;
    user_lastname: string;
    user_email: string;
    user_affiliation: string;
  };
}



function PersonnelHomePage() {


  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [userSession, setUserSession] = useState<any>(null)

  const fetchTickets = async () => {
    try {
      setIsLoading(true)
      const tickets = await readTickets () as unknown as Ticket[]
      setTickets(tickets)
      console.log(tickets)
      toast.success("Tickets loaded successfully")
    } catch (error) {
      console.error("Error fetching tickets:", error)
      toast.error("Failed to load tickets")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const session = getUserSession();
    setUserSession(session);
  }, []);

  useEffect( () => {
    let isMounted = true;

    const loadTickets = async () => {
      try {
        setIsLoading(true)
        const tickets = await readTickets () as unknown as Ticket[]
        if (isMounted) {
          setTickets(tickets)
          console.log(tickets)
          toast.success("Tickets loaded successfully")
        }
      } catch (error) {
        console.error("Error fetching tickets:", error)
        toast.error("Failed to load tickets")
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadTickets()

    return () => {
      isMounted = false
    }
  }, [])

  // Recompute pending count whenever tickets or user session changes
  useEffect(() => {
    const currentUserId = userSession?.id as number | undefined;
    if (!currentUserId) {
      setPendingCount(0);
      return;
    }

    const count = tickets.filter(ticket =>
      (ticket.ticket_status === "NEW" || ticket.ticket_status === "OPEN") &&
      ticket.assignee_id === currentUserId
    ).length;
    setPendingCount(count);
  }, [tickets, userSession]);

  // Filter tickets based on selected status
  const filteredTickets = tickets.filter(ticket => {
    if (statusFilter === "ALL") return true
    return ticket.ticket_status === statusFilter
  })

  return (
    <PageLayout navbar={<NavBar navBarLink="/inbox" navBarLinkName="Inbox" />}> 
      {/* Welcome Section */}
      <WelcomeText 
        firstName={userSession?.user_firstname || "User"} 
        lastName={userSession?.user_lastname || ""} 
      />

      {/* Respondent Desk Title */}
      <div className="text-center text-3xl font-bold mb-10">
        RESPONDENT DESK
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-8 flex-grow">
        {/* Left Column */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-8">
          {/* Pending Count Box */}
          {isLoading ? (
            <PendingCountSkeleton />
          ) : (
            <div className="bg-black rounded-xl py-6 text-center">
              <div className="text-white">
                <div className="font-black text-5xl mb-2">
                  {pendingCount}
                </div>
                <div className="font-bold">Pending</div>
              </div>
            </div>
          )}

          {/* Status Buttons */}
          <div className="space-y-4">
            <div className="font-medium">FILTER BY STATUS</div>
            <div className="space-y-2">
              <Button 
                className={`w-full ${statusFilter === "ALL" ? "opacity-60" : ""}`}
                onClick={() => setStatusFilter("ALL")}
              >
                ALL
              </Button>
              <Button 
                className={`w-full ${statusFilter === "NEW" ? "opacity-60" : ""}`}
                onClick={() => setStatusFilter("NEW")}
              >
                NEW
              </Button>
              <Button 
                className={`w-full ${statusFilter === "OPEN" ? "opacity-60" : ""}`}
                onClick={() => setStatusFilter("OPEN")}
              >
                OPEN
              </Button>
              <Button 
                className={`w-full ${statusFilter === "CLOSED" ? "opacity-60" : ""}`}
                onClick={() => setStatusFilter("CLOSED")}
              >
                CLOSED
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Table */}
        <div className="flex-grow flex flex-col">
          <div className="bg-white rounded-lg shadow-xl flex-grow flex flex-col">
            <div className="flex flex-col h-full">
            { isLoading ? <TableSkeleton rows={5}/> : (
                
              <Table className="h-full">
              
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Inquiry Date</TableHead>
                      <TableHead>Ticket No.</TableHead>
                      <TableHead>Concern</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Resolution</TableHead>
                      <TableHead>Resolved Date</TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="h-full">
                    { filteredTickets.filter( ticket => {
                      const currentUserId = userSession?.id as number | undefined;
                      return currentUserId ? ticket.assignee_id === currentUserId : false;
                    }).map ( (ticket) => {
                      return (
                        <TableRow key={ticket.ticket_id}>
                          <TableCell>{ticket.ticket_submitteddate.toLocaleDateString()}</TableCell>
                          <TableCell>{ticket.ticket_id}</TableCell>
                          <TableCell>{ticket.ticket_concern}</TableCell>
                          <TableCell>{ticket.ticket_status}</TableCell>
                          <TableCell>
                            {
                              ticket.ticket_resolution ? "Resolved" : "Pending"
                            }
                          </TableCell>
                          <TableCell>
                            {
                              ticket.ticket_resolveddate ? ticket.ticket_resolveddate.toLocaleDateString() : "N/A"
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            <PersonnelInquiryDialog
                              inquiry={{
                                referenceNumber: ticket.ticket_id.toString(),
                                inquirerEmail: ticket.inquirer?.user_email ?? '',
                                inquirerName: `${ticket.inquirer?.user_firstname ?? ''} ${ticket.inquirer?.user_lastname ?? ''}`,
                                affiliation: ticket.inquirer?.user_affiliation ?? '',
                                concern: ticket.ticket_concern,
                                specificConcern: ticket.ticket_subconcern,
                                concernDetails: ticket.ticket_details,
                                submittedDate: ticket.ticket_submitteddate.toLocaleDateString(),
                                status: ticket.ticket_status,
                                resolution: ticket.ticket_resolution,
                                resolvedDate: ticket.ticket_resolveddate ? ticket.ticket_resolveddate.toLocaleDateString() : undefined,
                              }}
                              trigger={<Button variant="outline">...</Button>}
                              onResolutionComplete={() => {
                                // Refresh tickets after resolution is saved
                                fetchTickets()
                                console.log("Resolution completed, refresh data if needed")
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
              </Table>

            )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default PersonnelHomePage;
