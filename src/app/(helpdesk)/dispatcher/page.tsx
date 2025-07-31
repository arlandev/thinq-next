"use client";

import React, { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {Table, TableBody, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/common/navbar";
import WelcomeText from "@/components/common/welcome-text";
import PageLayout from "@/components/common/page-layout";
import TicketList from "@/components/common/list-tickets";

function DispatcherHome() {
  // add Event Listener for Status column
  // if status is Closed, then status value is clickable and will show a modal
  // else, do nothing

  const [selectedFilter, setSelectedFilter] = useState<string[]>([])
  const [selected, setSelected] = useState<string>('');
  
  // const inquiries = [
  //   {
  //     id: "001",
  //     referenceNumber: "INQ-2023-001",
  //     inquirer: "john.doe@example.com",
  //     concern: "Account Access",
  //     status: "New",
  //     assignedTo: "John Doe",
  //   },
  //   {
  //     id: "002",
  //     referenceNumber: "INQ-2023-002",
  //     inquirer: "jane.smith@example.com",
  //     concern: "Password Reset",
  //     status: "Closed",
  //     assignedTo: "Jose Rizal",
  //     closedDate: "2023-11-20",
  //     closedBy: "Jose Rizal",
  //     resolutionNotes:
  //       "User's password was successfully reset and account access was restored.",
  //   },
  // ];

  return (
    <PageLayout navbar={<NavBar />}>
      {/* Welcome Section */}
      <WelcomeText firstName="Test" lastName="Test" />
      {/* Tabs Container */}
      <Tabs defaultValue="employees" className="flex-grow flex flex-col">
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
            <div className="w-full md:w-64 flex-shrink-0 space-y-8">
              {/* Status Buttons */}
              <div className="space-y-4">
                <div className="font-medium">FILTER BY STATUS</div>
                <div className="space-y-2">
                  <Button className={selected==='NEWOPEN'?'w-full opacity-60':'w-full'} onClick={() => {setSelectedFilter(['NEW','OPEN']);setSelected('NEWOPEN')}}>NEW & OPEN</Button>
                  <Button className={selected==='NEW'?'w-full opacity-60':'w-full'} onClick={() => {setSelectedFilter(['NEW']);setSelected('NEW')}}>NEW</Button>
                  <Button className={selected==='OPEN'?'w-full opacity-60':'w-full'} onClick={() => {setSelectedFilter(['OPEN']);setSelected('OPEN')}}>OPEN</Button>
                  <Button className={selected==='CLOSED'?'w-full opacity-60':'w-full'} onClick={() => {setSelectedFilter(['CLOSED']);setSelected('CLOSED')}}>CLOSED</Button>
                  <Button className={selected===''?'pointer-events-none opacity-50 w-full':'w-full bg-blue-500 text-white hover:bg-blue-500 hover:opacity-80'} onClick={() => {setSelectedFilter([]);setSelected('')}}>CLEAR</Button>
                </div>
              </div>
            </div>

            {/* Right Column - Employees Table */}
            <div className="flex-grow flex flex-col">
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
                      <TicketList user_type="EMPLOYEE" filter_status={selectedFilter}/>
                    </TableBody>
                  </Table>
                </div>
              </div>
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
                <div className="space-y-2">
                  <Button className={selected==='NEWOPEN'?'w-full opacity-60':'w-full'} onClick={() => {setSelectedFilter(['NEW','OPEN']);setSelected('NEWOPEN')}}>NEW & OPEN</Button>
                  <Button className={selected==='NEW'?'w-full opacity-60':'w-full'} onClick={() => {setSelectedFilter(['NEW']);setSelected('NEW')}}>NEW</Button>
                  <Button className={selected==='OPEN'?'w-full opacity-60':'w-full'} onClick={() => {setSelectedFilter(['OPEN']);setSelected('OPEN')}}>OPEN</Button>
                  <Button className={selected==='CLOSED'?'w-full opacity-60':'w-full'} onClick={() => {setSelectedFilter(['CLOSED']);setSelected('CLOSED')}}>CLOSED</Button>
                  <Button className={selected===''?'pointer-events-none opacity-50 w-full':'w-full bg-blue-500 text-white hover:bg-blue-500 hover:opacity-80'} onClick={() => {setSelectedFilter([]);setSelected('')}}>CLEAR</Button>
                </div>
              </div>
            </div>

            {/* Right Column - Employees Table */}
            <div className="flex-grow flex flex-col">
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
                      <TicketList user_type="STUDENT" filter_status={selectedFilter}/>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}

export default DispatcherHome;
