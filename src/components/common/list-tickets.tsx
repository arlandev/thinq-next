'use client'

import { useState } from "react";
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
    ticket_resolution:"",
    ticket_closedby:0,
    ticket_resolveddate: new Date(),
}

interface TicketListProps {
    user_type: string;
    filter_status: string[];
    tickets: Ticket[];
    onAssignmentComplete: () => void;
}

export default function TicketList({user_type, filter_status, tickets, onAssignmentComplete}:TicketListProps) {

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [resolvedTicket, setResolvedTicket] = useState<[Ticket,string,string]>([defaultTicket,"",""]);


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

    return (
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Resolution Details</DialogTitle>
            <DialogDescription>{resolvedTicket[0].ticket_id}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div>
              <p className="text-sm font-medium">Closed Date</p>
                {resolvedTicket[0].ticket_resolveddate.toLocaleDateString('en-CA').replace(/-/g, '/')}
            </div>

            <div>
              <p className="text-sm font-medium">Closed By</p>
              {resolvedTicket[1] + resolvedTicket[2]}
            </div>

            <div>
              <p className="text-sm font-medium">Resolution Notes</p>
              <p className="text-sm whitespace-pre-wrap">
                {`${resolvedTicket[0].closedby?.user_firstname ?? ''} ${resolvedTicket[0].closedby?.user_lastname ?? ''}`}
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
              {tickets.filter(ticket => (filter_status.length === 0 || filter_status.includes(ticket.ticket_status)) && ticket.inquirer?.user_type === user_type).map((ticket: Ticket) => (
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
                        <TableCell id="assignmentValue" className= {ticket.assignee_id === null ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>
                          {ticket.assignee_id === null 
                            ? 'Not Yet Assigned' 
                            : ticket.assignee 
                              ? `${ticket.assignee.user_firstname} ${ticket.assignee.user_lastname}`
                              : `ID: ${ticket.assignee_id}`
                          }
                        </TableCell>
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
                            onAssignmentComplete={onAssignmentComplete}
                          />
                        </TableCell>
                </TableRow>
              ))}
          <ResolutionDetailsModal />
        </>
    )
}