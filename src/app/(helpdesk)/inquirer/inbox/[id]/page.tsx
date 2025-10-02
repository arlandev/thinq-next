"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import PageLayout from "@/components/common/page-layout";
import NavBar from "@/components/common/navbar";
import RouteProtection from "@/components/common/route-protection";

import { Button } from "@/components/ui/button";
import { House, SendHorizontal } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// Mock data for tickets
const mockTickets = [
  {
    id: 1,
    ticketNumber: "TICK-001",
    subject: "Library Access Issue",
    status: "OPEN",
    lastMessage: "2 days ago",
    messages: [
      { id: 1, sender: "You", content: "I'm having trouble accessing the online library resources", timestamp: "2 days ago", isUser: true },
      { id: 2, sender: "Support", content: "We're looking into this issue. Can you provide more details about the error message?", timestamp: "1 day ago", isUser: false },
      { id: 3, sender: "You", content: "I get a 'Access Denied' error when trying to login", timestamp: "1 day ago", isUser: true }
    ]
  },
  {
    id: 2,
    ticketNumber: "TICK-002", 
    subject: "Grade Inquiry",
    status: "RESOLVED",
    lastMessage: "1 week ago",
    messages: [
      { id: 1, sender: "You", content: "I have a question about my final grade in CS101", timestamp: "1 week ago", isUser: true },
      { id: 2, sender: "Professor", content: "Your grade has been updated. Please check your student portal.", timestamp: "1 week ago", isUser: false }
    ]
  },
  {
    id: 3,
    ticketNumber: "TICK-003",
    subject: "Dormitory Maintenance",
    status: "IN_PROGRESS", 
    lastMessage: "3 days ago",
    messages: [
      { id: 1, sender: "You", content: "The air conditioning in my room is not working properly", timestamp: "3 days ago", isUser: true },
      { id: 2, sender: "Maintenance", content: "We've scheduled a technician to visit your room tomorrow", timestamp: "2 days ago", isUser: false }
    ]
  }
];

const InquirerTicketDetail = () => {
    const [text, setText] = useState('');
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const params = useParams();
    const ticketId = params?.id;

    useEffect(() => {
        if (ticketId) {
            const ticket = mockTickets.find(t => t.id === parseInt(ticketId as string));
            setSelectedTicket(ticket);
        }
    }, [ticketId]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        if (newText.length <= 250) {
            setText(newText);
        }
    };

    const remainingChars = 250 - text.length;

    if (!selectedTicket) {
        return (
            <RouteProtection requiredRole="inquirer">
                <PageLayout navbar={<NavBar navBarLink="/inquirer" navBarLinkName="Home" />}>
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center text-gray-500">
                            <h2 className="text-xl font-semibold">Ticket not found</h2>
                            <p className="text-sm">The requested ticket could not be found.</p>
                            <Link href="/inquirer/inbox">
                                <Button className="mt-4">Back to Inbox</Button>
                            </Link>
                        </div>
                    </div>
                </PageLayout>
            </RouteProtection>
        );
    }

    return (
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
                                                <div className={`p-3 rounded-md cursor-pointer hover:bg-gray-100 ${
                                                    selectedTicket?.id === ticket.id ? 'bg-blue-100 border border-blue-300' : 'bg-white'
                                                }`}>
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
                                <div className="flex flex-col w-full h-full">
                                    <CardHeader className="flex-shrink-0">
                                        <Card className="py-3 rounded-md">
                                            <CardContent className="grid grid-cols-2 place-content-center">
                                                <div className="grid grid-rows-*">
                                                    <h1 className="content-center text-md text-zinc-600">
                                                        <b>{selectedTicket.ticketNumber} <span className="opacity-75 text-xs">({selectedTicket.lastMessage})</span></b>
                                                    </h1>
                                                    <p className="text-xs text-zinc-500 italic">
                                                        <b>Status: </b>{selectedTicket.status}
                                                    </p>
                                                </div>
                                                <div className="text-end content-center">
                                                    <Button className="cursor-pointer">CLOSE TICKET</Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </CardHeader>
                                    <CardContent className="flex-1 overflow-y-auto">
                                        <div className="space-y-4">
                                            {selectedTicket.messages.map((message: any) => (
                                                <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                        message.isUser 
                                                            ? 'bg-blue-600 text-white' 
                                                            : 'bg-white text-gray-800'
                                                    }`}>
                                                        <div className="text-sm">{message.content}</div>
                                                        <div className={`text-xs mt-1 ${
                                                            message.isUser ? 'text-blue-100' : 'text-gray-500'
                                                        }`}>
                                                            {message.timestamp}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex-shrink-0 grid grid-rows-* gap-1">
                                        <div className="flex gap-3 w-full">
                                            <div className="grow">
                                                <Textarea 
                                                    maxLength={250} 
                                                    value={text} 
                                                    onChange={handleChange} 
                                                    className="flex min-h-[50px] max-h-[80px] resize-none overflow-auto border border-primary/20 shadow-md" 
                                                    placeholder="Type your message here"
                                                />
                                            </div>
                                            <div className="justify-self-center content-center">
                                                {remainingChars === 250 ? 
                                                    (
                                                        <button className="opacity-50" disabled><SendHorizontal/></button>
                                                    ) : (
                                                        <button className="cursor-pointer hover:text-blue-600"><SendHorizontal/></button>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <p className={remainingChars <= 10 ? "text-red-500 text-xs mt-2 opacity-75" : "text-xs mt-1 opacity-75"}>
                                            {remainingChars}/250 characters remaining
                                        </p>
                                    </CardFooter>
                                </div>
                            </Card>
                        </div>
                    </div>
            </PageLayout>
        </RouteProtection>
    );
};

export default InquirerTicketDetail;
