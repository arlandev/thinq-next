// TODO: Add affiliation field to the form

'use client';

import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageLayout from "@/components/common/page-layout";
import WelcomeText from "@/components/common/welcome-text";
import NavBar from "@/components/common/navbar";
import AccountsPageTitle from "@/components/common/accounts-page-title";

import AddUserDialog from "@/components/common/add-user-dialog";

import { Button } from "@/components/ui/button";
// import DeactivateButton from "@/components/common/deactivate-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// import EditDialog from "@/components/common/edit-dialog";
import BatchDeactivateDialog from "@/components/common/batch-deactivate-dialog";

import UserList from "@/components/common/list-users";

import { addUser } from "@/app/actions/addUser";
import { readInquirerUsers } from "@/app/actions/adminReadInquirers";


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

interface InquirerUser {
  id: number;
  user_email: string;
  user_firstname: string;
  user_lastname: string;
  user_role: string;
  user_type: string;
  user_affiliation: string;
  user_status: string;
}

// user_email       String     @unique
//   user_firstname   String
//   user_lastname    String
//   user_dob         DateTime   @db.Date
//   user_status      UserStatus @default(ACTIVE)
//   user_password    String
//   user_role        UserRole
//   user_type        UserType
//   user_affiliation String

function InquirerAccountsPage() {
  // TODO: Add Edit Dialog

  const [inquirerUsers, setInquirerUsers] = useState<InquirerUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await readInquirerUsers();
        // console.log("Fetched inquirer users:", users);
        toast.success("Users loaded successfully");
        setInquirerUsers(users as unknown as InquirerUser[]);
      } catch (error) {
        console.error("Error fetching inquirer users:", error);
        toast.error("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  return (
    <PageLayout navbar={<NavBar navBarLink="" navBarLinkName="" />}>
      <div className="flex justify-between items-start mb-8">
        <WelcomeText firstName="First" lastName="Last" />
        <Button className="flex items-center gap-2">
          Downloadables
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
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
                  <TableHead className="w-3/12">Email</TableHead>
                  <TableHead className="w-1/12">First Name</TableHead>
                  <TableHead className="w-1/12">Last Name</TableHead>
                  <TableHead className="w-2/12">Type</TableHead>
                  <TableHead className="w-1/12">Affiliation</TableHead>
                  <TableHead className="w-1/12">Status</TableHead>
                  <TableHead className="w-3/12 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="h-full">
                <UserList users={inquirerUsers} user_role="INQUIRER"/>
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex justify-center gap-10 mt-5">
          <AddUserDialog addType="inquirer" addUser={async (email, firstname, lastname, dob, role, type) => {
            try {
              const result = await addUser(email, firstname, lastname, dob, role, type, "CICS");
              toast.success("User added successfully");
              return result;
            } catch (error) {
              console.error("Error adding user:", error);
              toast.error("Failed to add user");
              throw error;
            }
          }}/>
          <BatchDeactivateDialog users={users} />
        </div>
      </div>
    </PageLayout>
  );
}

export default InquirerAccountsPage;
