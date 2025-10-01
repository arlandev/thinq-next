'use client'

import { useState, useMemo } from "react";
import { TableRow, TableCell, Table, TableHeader, TableHead, TableBody} from "../ui/table";
import InquiryDetailsDialog from "./inquiry-details-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import Pagination, { type PaginationInfo } from "./pagination";
import { Search } from "lucide-react";


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
    reference_number: "N/A",
}

interface TicketListProps {
    user_type: string;
    filter_status: string[];
    tickets: Ticket[];
    onAssignmentComplete: () => void;
    showSearchAndPagination?: boolean;
    pageSize?: number;
}

interface TicketListWithSearchProps extends Omit<TicketListProps, 'pageSize'> {
    showSearchAndPagination: true;
    pageSize: number;
    paginationInfo?: any;
    onPageChange?: (page: number) => void;
    onSearch?: (query: string) => void;
    searchQuery?: string;
}

export default function TicketList({
    user_type, 
    filter_status, 
    tickets, 
    onAssignmentComplete,
    showSearchAndPagination = false,
    pageSize = 10
}: TicketListProps) {

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [resolvedTicket, setResolvedTicket] = useState<[Ticket,string,string]>([defaultTicket,"",""]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);


  // Filter and search logic
  const filteredAndSearchedTickets = useMemo(() => {
    let filtered = tickets.filter(ticket => 
      (filter_status.length === 0 || filter_status.includes(ticket.ticket_status)) && 
      ticket.inquirer?.user_type === user_type
    );

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.reference_number?.toLowerCase().includes(searchLower) ||
        ticket.ticket_concern?.toLowerCase().includes(searchLower) ||
        ticket.ticket_subconcern?.toLowerCase().includes(searchLower) ||
        ticket.ticket_details?.toLowerCase().includes(searchLower) ||
        ticket.inquirer?.user_firstname?.toLowerCase().includes(searchLower) ||
        ticket.inquirer?.user_lastname?.toLowerCase().includes(searchLower) ||
        ticket.inquirer?.user_email?.toLowerCase().includes(searchLower) ||
        ticket.assignee?.user_firstname?.toLowerCase().includes(searchLower) ||
        ticket.assignee?.user_lastname?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [tickets, filter_status, user_type, searchTerm]);

  // Pagination logic
  const paginatedTickets = useMemo(() => {
    if (!showSearchAndPagination) {
      return filteredAndSearchedTickets;
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSearchedTickets.slice(startIndex, endIndex);
  }, [filteredAndSearchedTickets, currentPage, pageSize, showSearchAndPagination]);

  // Pagination info
  const paginationInfo: PaginationInfo = useMemo(() => {
    const totalItems = filteredAndSearchedTickets.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = showSearchAndPagination ? (currentPage - 1) * pageSize + 1 : 1;
    const endIndex = showSearchAndPagination ? Math.min(currentPage * pageSize, totalItems) : totalItems;

    return {
      totalItems,
      totalPages,
      currentPage,
      pageSize,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      startIndex,
      endIndex
    };
  }, [filteredAndSearchedTickets.length, currentPage, pageSize, showSearchAndPagination]);

  // Reset to first page when search term changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusClick = (_inquiry: Ticket, assignee_fname: string, assignee_lname: string) => {
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
          {/* Ticket Rows - Only valid table elements */}
          {paginatedTickets.map((ticket: Ticket) => (
            <TableRow key={ticket.ticket_id}>
              <TableCell className="font-medium">{ticket.ticket_submitteddate.toLocaleDateString('en-CA').replace(/-/g, '/')}</TableCell>
              <TableCell>
                {ticket.reference_number === null ? "N/A" : ticket.reference_number}
              </TableCell>
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
                    ticketId: ticket.ticket_id,
                    referenceNumber: ticket.reference_number,
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

          {/* No Results Message */}
          {paginatedTickets.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                {searchTerm.trim() ? 'No tickets found matching your search.' : 'No tickets available.'}
              </TableCell>
            </TableRow>
          )}

          <ResolutionDetailsModal />
        </>
    )
}

// Wrapper component that handles search and pagination outside the table
export function TicketListWithSearch(props: TicketListWithSearchProps) {
  const [searchTerm, setSearchTerm] = useState(props.searchQuery || "");

  // Use server-side pagination info if provided
  const paginationInfo = props.paginationInfo || {
    totalItems: props.tickets.length,
    totalPages: 1,
    currentPage: 1,
    pageSize: props.pageSize,
    hasNextPage: false,
    hasPreviousPage: false,
    startIndex: 1,
    endIndex: props.tickets.length
  };


  // Handle search with server-side search
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (props.onSearch) {
      props.onSearch(value);
    }
  };

  // Handle page changes with server-side pagination
  const handlePageChange = (page: number) => {
    if (props.onPageChange) {
      props.onPageChange(page);
    }
  };

  return (
    <>
      {/* Search Bar - Outside table */}
      <div className="p-4 border-b bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search tickets by reference number, concern, inquirer name, or email..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table with server-side paginated tickets */}
      <div className="flex-grow flex flex-col">
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
            <TicketList 
              {...props}
              tickets={props.tickets}
              showSearchAndPagination={false}
            />
          </TableBody>
        </Table>
      </div>

      {/* Pagination - Outside table */}
      {paginationInfo.totalPages > 1 && (
        <div className="p-4 border-t bg-gray-50">
          <Pagination 
            pagination={paginationInfo} 
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}