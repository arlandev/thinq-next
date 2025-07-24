"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InquiryDetailsDialog from "@/components/common/inquiry-details-dialog";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import React, { useState } from "react";
import NavBar from "@/components/common/navbar";
import WelcomeText from "@/components/common/welcome-text";
import PageLayout from "@/components/common/page-layout";

function DispatcherHome() {
  // add Event Listener for Status column
  // if status is Closed, then status value is clickable and will show a modal
  // else, do nothing

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const inquiries = [
    {
      id: "001",
      referenceNumber: "INQ-2023-001",
      inquirer: "john.doe@example.com",
      concern: "Account Access",
      status: "New",
      assignedTo: "John Doe",
    },
    {
      id: "002",
      referenceNumber: "INQ-2023-002",
      inquirer: "jane.smith@example.com",
      concern: "Password Reset",
      status: "Closed",
      assignedTo: "Jose Rizal",
      closedDate: "2023-11-20",
      closedBy: "Jose Rizal",
      resolutionNotes:
        "User's password was successfully reset and account access was restored.",
    },
  ];

  const handleStatusClick = (_inquiry: unknown) => {
    // if (inquiry.status === "Closed") {
    // if (inquiry === "Closed") {
    //   setSelectedInquiry(inquiry);
    //   setIsDetailsModalOpen(true);
    // }
    setIsDetailsModalOpen(true);
  };

  const ResolutionDetailsModal = () => {
    // if (!selectedInquiry) return null;

    return (
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Resolution Details</DialogTitle>
            <DialogDescription>
              {/* Inquiry #{selectedInquiry.referenceNumber} */}
              003
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div>
              <p className="text-sm font-medium">Closed Date</p>
              {/* <p className="text-sm">{selectedInquiry.closedDate}</p> */}
              2024/01/01
            </div>

            <div>
              <p className="text-sm font-medium">Closed By</p>
              {/* <p className="text-sm">{selectedInquiry.closedBy}</p> */}
              John Rizal
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
    <PageLayout navbar={<NavBar />}>
      {/* Welcome Section */}
      <WelcomeText firstName="Test" lastName="Test" />
      {/* Tabs Container */}
      <Tabs defaultValue="employees" className="flex-grow flex flex-col">
        <div className="p-8 w-full">
          <div className="container mx-auto flex justify-center items-center">
            <TabsList className="w-full max-w-[600px]">
              <TabsTrigger value="employees" className="flex-1 text-2xl py-3">
                EMPLOYEES
              </TabsTrigger>
              <TabsTrigger value="students" className="flex-1 text-2xl py-3">
                STUDENTS
              </TabsTrigger>
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
                  <Button className="w-full">NEW & OPEN</Button>
                  <Button className="w-full">NEW</Button>
                  <Button className="w-full">OPEN</Button>
                  <Button className="w-full">CLOSED</Button>
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
                        <TableHead className="w-[200px]">
                          Inquiry Date
                        </TableHead>
                        <TableHead>Ref. No.</TableHead>
                        <TableHead>Concern</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assignment</TableHead>
                        <TableHead className="text-right">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="h-full">
                      <TableRow>
                        <TableCell className="font-medium">
                          2024/03/12
                        </TableCell>
                        <TableCell>001</TableCell>
                        <TableCell>Account Issue</TableCell>
                        <TableCell id="statusValue">New</TableCell>
                        <TableCell
                          id="assignmentValue"
                          className="text-red-500 font-medium"
                        >
                          Not Yet Assigned
                        </TableCell>
                        <TableCell className="text-right">
                          <InquiryDetailsDialog
                            inquiry={{
                              referenceNumber: "001",
                              inquirerEmail: "john.doe@ust.edu.ph",
                              affiliation: "College of Science",
                              concern: "Account Issues",
                              specificConcern: "Issue with library account",
                              concernDetails:
                                "I cannot log into my library account",
                            }}
                            trigger={<Button variant="outline">...</Button>}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          2024/03/10
                        </TableCell>
                        <TableCell>002</TableCell>
                        <TableCell>Installation Request</TableCell>
                        <TableCell>
                          <span
                            className="text-green-600 cursor-pointer hover:underline"
                            onClick={() => handleStatusClick(inquiries[1])}
                          >
                            Closed
                          </span>
                        </TableCell>
                        <TableCell>Jose Rizal</TableCell>
                        <TableCell className="text-right">
                          <InquiryDetailsDialog
                            inquiry={{
                              referenceNumber: "002",
                              inquirerEmail: "john.doe@ust.edu.ph",
                              affiliation: "College of Science",
                              concern: "Installation Request",
                              specificConcern:
                                "Help with installing a software",
                              concernDetails:
                                "Please help me install Microsoft Word",
                              assignedTo: "Jose Rizal",
                            }}
                            trigger={<Button variant="outline">...</Button>}
                          />
                        </TableCell>
                      </TableRow>
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
                  <Button className="w-full">NEW & OPEN</Button>
                  <Button className="w-full">NEW</Button>
                  <Button className="w-full">OPEN</Button>
                  <Button className="w-full">CLOSED</Button>
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
                        <TableHead className="w-[200px]">
                          Inquiry Date
                        </TableHead>
                        <TableHead>Ref. No.</TableHead>
                        <TableHead>Concern</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assignment</TableHead>
                        <TableHead className="text-right">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="h-full">
                      <TableRow>
                        <TableCell className="font-medium">
                          2024/03/13
                        </TableCell>
                        <TableCell>004</TableCell>
                        <TableCell>Main Concern</TableCell>
                        <TableCell>New</TableCell>
                        <TableCell
                          id="assignmentValue"
                          className="text-red-500 font-medium"
                        >
                          Not Yet Assigned
                        </TableCell>
                        <TableCell className="text-right">
                          <InquiryDetailsDialog
                            inquiry={{
                              referenceNumber: "004",
                              inquirerEmail: "john.doe@ust.edu.ph",
                              affiliation: "College of Science",
                              concern: "Main Concern",
                              specificConcern: "Specific concern",
                              concernDetails: "Concern details",
                            }}
                            trigger={<Button variant="outline">...</Button>}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          2024/03/12
                        </TableCell>
                        <TableCell>003</TableCell>
                        <TableCell>Main Concern</TableCell>
                        <TableCell>Closed</TableCell>
                        <TableCell>John Doe</TableCell>
                        <TableCell className="text-right">
                          <InquiryDetailsDialog
                            inquiry={{
                              referenceNumber: "003",
                              inquirerEmail: "john.doe@ust.edu.ph",
                              affiliation: "College of Science",
                              concern: "Main Concern",
                              specificConcern: "Specific concern",
                              concernDetails: "Concern details",
                              assignedTo: "John Doe",
                            }}
                            trigger={<Button variant="outline">...</Button>}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <ResolutionDetailsModal />
    </PageLayout>
  );
}

export default DispatcherHome;
