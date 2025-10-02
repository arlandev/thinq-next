"use client";

import React from 'react';
import Link from 'next/link';

import PageLayout from "@/components/common/page-layout";
import NavBar from "@/components/common/navbar";
import RouteProtection from "@/components/common/route-protection";

import { Button } from "@/components/ui/button";
import { House } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Mock data for tickets
const mockTickets = [
  {
    id: 1,
    ticketNumber: "TICK-001",
    subject: "Library Access Issue",
    status: "OPEN",
    lastMessage: "2 days ago"
  },
  {
    id: 2,
    ticketNumber: "TICK-002", 
    subject: "Grade Inquiry",
    status: "RESOLVED",
    lastMessage: "1 week ago"
  },
  {
    id: 3,
    ticketNumber: "TICK-003",
    subject: "Dormitory Maintenance",
    status: "IN_PROGRESS", 
    lastMessage: "3 days ago"
  }
];

const InquirerInbox = () => {
    
    return (
        <>
            <RouteProtection requiredRole="inquirer">
                <PageLayout navbar={<NavBar navBarLink="/inquirer" navBarLinkName="Home" />}>
                    <div className="flex flex-col h-full">
                        <div className="mb-4">
                            <Link href="/inquirer">
                                <Button className="cursor-pointer"><House />Home</Button>
                            </Link>
                        </div>
                        <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
                            <Card className="col-span-3 bg-zinc-200 py-4 rounded-md shadow-lg flex flex-col h-full">
                                <CardHeader className="flex-shrink-0">
                                    <CardTitle className="text-xl">Inbox</CardTitle>
                                    <hr className="h-px bg-zinc-300 border-0 rounded-sm"/>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-y-auto">
                                    <div className="space-y-2">
                                        {mockTickets.map((ticket) => (
                                            <Link key={ticket.id} href={`/inquirer/inbox/${ticket.id}`}>
                                                <div className="p-3 rounded-md cursor-pointer hover:bg-gray-100 bg-white">
                                                    <div className="text-sm font-semibold">{ticket.ticketNumber}</div>
                                                    <div className="text-xs text-gray-600 truncate">{ticket.subject}</div>
                                                    <div className="text-xs text-gray-500">{ticket.lastMessage}</div>
                                                    <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                                                        ticket.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                                                        ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {ticket.status}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="col-span-9 bg-zinc-200 py-4 flex rounded-md shadow-lg h-full">
                                <div className="flex items-center justify-center w-full h-full">
                                    <div className="text-center text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                                        </svg>
                                        <h2 className="text-xl font-semibold text-gray-600 mb-2">Select a ticket</h2>
                                        <p className="text-sm text-gray-500">Choose a conversation from the inbox to view messages</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </PageLayout>
            </RouteProtection>
        </>
    )
}

export default InquirerInbox;