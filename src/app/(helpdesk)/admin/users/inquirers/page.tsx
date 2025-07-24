'use client';

import PageLayout from "@/components/common/page-layout";
import WelcomeText from "@/components/common/welcome-text";
import NavBar from "@/components/common/navbar";
import AccountsPageTitle from "@/components/common/accounts-page-title";

import AddUserDialog from "@/components/common/add-user-dialog";

import { Button } from "@/components/ui/button";
import DeactivateButton from "@/components/common/deactivate-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import EditDialog from "@/components/common/edit-dialog";
import BatchDeactivateDialog from "@/components/common/batch-deactivate-dialog";

// sample users for testing
const users = [
  {
    id: 1,
    email: "john.doe@ust.edu.ph",
    role: "Student",
    isActive: true,
    hasActiveTickets: true,
  },
  {
    id: 2,
    email: "jane.smith@ust.edu.ph",
    role: "Teacher",
    isActive: true,
    hasActiveTickets: false,
  },
  {
    id: 3,
    email: "john.legend@ust.edu.ph",
    role: "Staff",
    isActive: false,
    hasActiveTickets: false,
  },
];

function InquirerAccountsPage() {
  // TODO: Add Edit Dialog

  return (
    <PageLayout navbar={<NavBar navBarLink="" navBarLinkName="" />}>
      <div className="flex justify-between items-start mb-8">
        <WelcomeText firstName="First" lastName="Last" />
        <Button className="flex items-center gap-2">
          Downloadables
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </Button>
      </div>

      <AccountsPageTitle userType="INQUIRER"/>

      <div className="flex-grow flex flex-col">
        <div className="bg-white rounded-lg shadow-xl flex-grow flex flex-col">
          <div className="flex flex-col h-full">
            <Table className="h-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/12"></TableHead>
                  <TableHead className="w-1/12">User ID</TableHead>
                  <TableHead className="w-2/12">Name</TableHead>
                  <TableHead className="w-3/12">Email</TableHead>
                  <TableHead className="w-2/12">Role</TableHead>
                  <TableHead className="w-1/12">Status</TableHead>
                  <TableHead className="w-3/12 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="h-full">
                <TableRow>
                  <TableCell>
                    <EditDialog
                      user={{
                        id: 1,
                        name: "John Doe",
                        email: "john.doe@ust.edu.ph",
                      }}
                      onSave={(updatedUser: unknown) => {
                        console.log("User updated:", updatedUser);
                        // TODO: update logic
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">00001</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>john.doe@ust.edu.ph</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell className="text-right">
                    <DeactivateButton
                      disable={true}
                      inquirerName="John Doe"
                      inquirerEmail="john.doe@ust.edu.ph"
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Button>Edit</Button>
                  </TableCell>
                  <TableCell className="font-medium">00002</TableCell>
                  <TableCell>Mark Cruz</TableCell>
                  <TableCell>mark.cruz@ust.edu.ph</TableCell>
                  <TableCell>Staff</TableCell>
                  <TableCell>Inactive</TableCell>
                  <TableCell className="text-right">
                    <DeactivateButton
                      disable={false}
                      inquirerName="Mark Cruz"
                      inquirerEmail="mark.cruz@ust.edu.ph"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex justify-center gap-10 mt-5">
          <AddUserDialog addType="inquirer" />
          <BatchDeactivateDialog users={users} />
        </div>
      </div>
    </PageLayout>
  );
}

export default InquirerAccountsPage;
