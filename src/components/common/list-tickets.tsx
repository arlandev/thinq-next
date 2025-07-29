'use client'

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { readTickets } from "@/app/actions/readTickets";
import { TableRow, TableCell} from "../ui/table";
import InquiryDetailsDialog from "./inquiry-details-dialog";
import { Button } from "../ui/button";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";


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
}

const defaultTicket: Ticket = {
    ticket_id:0,
    ticket_submitteddate: new Date(),
    inquirer_id:0,
    concern_id:0,
    ticket_concern:"",
    ticket_details:"",
    ticket_subconcern:"",
    ticket_attachment:[],
    ticket_status:"CLOSED",
    assignee_id:0,
}

interface TicketListProps {
    user_type: string;
}

export default function TicketList({user_type}:TicketListProps) {

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [resolvedTicket, setResolvedTicket] = useState<[Ticket,string,string]>([defaultTicket,"",""]);


    useEffect(() => {
        let isMounted = true;
        
        const fetchTickets = async () => {
          try {
            const tickets = await readTickets();
            if (isMounted) {
              setTickets(tickets as unknown as Ticket[]);
              console.log(tickets)
              toast.success("Tickets loaded successfully");
            }
          } catch (error) {
            console.error("Error fetching tickets:", error);
            if (isMounted) {
              toast.error("Failed to load tickets");
            }
          }
        };
    
        fetchTickets();
    
        return () => {
          isMounted = false;
        };
      }, []);


  const handleStatusClick = (_inquiry: Ticket, assignee_fname: string, assignee_lname: string) => {
    // if (inquiry.status === "Closed") {
    // if (inquiry === "Closed") {
    //   setSelectedInquiry(inquiry);
    //   setIsDetailsModalOpen(true);
    // }
    setResolvedTicket([_inquiry,assignee_fname,assignee_lname])
    setIsDetailsModalOpen(true);
  };

  const ResolutionDetailsModal = () => {
    // if (!selectedInquiry) return null;

    return (
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Resolution Details</DialogTitle>
            <DialogDescription>{/* Inquiry #{selectedInquiry.referenceNumber} */}{resolvedTicket[0].ticket_id}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div>
              <p className="text-sm font-medium">Closed Date</p>
                resolved date
            </div>

            <div>
              <p className="text-sm font-medium">Closed By</p>
              {/* <p className="text-sm">{selectedInquiry.closedBy}</p> */}
              {resolvedTicket[1] + resolvedTicket[2]} {/* need to add closedBy column since we don't know if ticket is closed by inquirer/assignee */}
            </div>

            <div>
              <p className="text-sm font-medium">Resolution Notes</p>
              <p className="text-sm whitespace-pre-wrap">
                {/* {selectedInquiry.resolutionNotes} */}
                Resolution Notes here.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

    return (
        <>
            {tickets.filter(ticket => ticket.inquirer?.user_type===user_type).map((ticket: Ticket) => (
                <TableRow key={ticket.ticket_id}>
                    <TableCell className="font-medium">{ticket.ticket_submitteddate.toLocaleDateString('en-CA').replace(/-/g, '/')}</TableCell>
                        <TableCell>{ticket.ticket_id}</TableCell>
                        <TableCell>{ticket.ticket_concern}</TableCell>
                        {ticket.ticket_status==='CLOSED'?
                            <TableCell 
                                className="text-green-600 cursor-pointer hover:underline"
                                onClick={() => handleStatusClick(ticket, ticket.assignee?.user_firstname ?? '', ticket.assignee?.user_lastname ?? '')}>
                                    {ticket.ticket_status}
                            </TableCell> :
                            <TableCell>{ticket.ticket_status}</TableCell> 
                        }
                        <TableCell id="assignmentValue" className="text-red-500 font-medium">{ticket.assignee_id===null?'Not Yet Assigned':ticket.assignee_id}</TableCell>
                        <TableCell className="text-right">
                          <InquiryDetailsDialog
                            inquiry={{
                              referenceNumber: ticket.ticket_id.toString(),
                              inquirerEmail: ticket.inquirer?.user_email ?? '',
                              affiliation: ticket.inquirer?.user_affiliation ?? '',
                              concern: ticket.ticket_concern,
                              specificConcern: ticket.ticket_subconcern,
                              concernDetails: ticket.ticket_details,
                            }}
                            trigger={<Button variant="outline">...</Button>}
                          />
                        </TableCell>
                </TableRow>
            ))}
        <ResolutionDetailsModal />

        </>
    )
}