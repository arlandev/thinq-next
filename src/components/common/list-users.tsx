// TODO: Add affiliation field to the form

'use client';

import { useEffect, useState } from "react";
import { toast } from "sonner";

import PageLayout from "@/components/common/page-layout";
import WelcomeText from "@/components/common/welcome-text";
import NavBar from "@/components/common/navbar";
import AccountsPageTitle from "@/components/common/accounts-page-title";
import AddUserDialog from "@/components/common/add-user-dialog";
import { TableSkeleton } from "@/components/common/table-skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BatchDeactivateDialog from "@/components/common/batch-deactivate-dialog";
import DeactivateButton from "./deactivate-button";
import EditDialog from "./edit-dialog";

import { readUsers } from "@/app/actions/adminReadUsers";


// sample users for testing
const usersSample = [
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

interface User {
  id: number;
  user_email: string;
  user_firstname: string;
  user_lastname: string;
  user_role: string;
  user_type: string;
  user_affiliation: string;
  user_status: string;
}

interface UserListProps {
    user_role: string;
}

export default function UserList({user_role}:UserListProps) {
  // TODO: Add Edit Dialog

  const [completeUsers, setCompleteUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const users = await readUsers();
        if (isMounted) {
          setCompleteUsers(users as unknown as User[]);
          toast.success("Users Loaded Successfully");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        if (isMounted) {
          toast.error("Failed to Load Users");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleActivateDeactivate = async () => {
    let isMounted = true;
    
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const users = await readUsers();
        if (isMounted) {
          setCompleteUsers(users as unknown as User[]);
          toast.success("Users Loaded Successfully");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        if (isMounted) {
          toast.error("Failed to Load Users");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();
  }

  return (
    <PageLayout navbar={<NavBar navBarLink="/admin" navBarLinkName="Home" />}>
      <div className="flex justify-between items-start mb-8">
        <WelcomeText firstName="First" lastName="Last" />
        <Button className="flex items-center gap-2">
          Dashboard
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path fill="#ffffff" d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/>
          </svg>
        </Button>
      </div>

      <AccountsPageTitle userType={user_role}/>

      <div className="flex-grow flex flex-col">
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : (
          <>
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
                  {completeUsers.filter((user: User) => user.user_role===user_role).map((user: User) => (
                    <TableRow key={user.id}>
                        <TableCell>
                            <EditDialog user={{
                                id: user.id,
                                name: `${user.user_firstname} ${user.user_lastname}`,
                                email: user.user_email,
                            }} />
                        </TableCell>
                        <TableCell>{user.id}</TableCell>
                            <TableCell>{user.user_email}</TableCell>
                            <TableCell>{user.user_firstname}</TableCell>
                            <TableCell>{user.user_lastname}</TableCell>
                            <TableCell>{user.user_type}</TableCell>
                            <TableCell>{user.user_affiliation}</TableCell>
                            <TableCell>{user.user_status}</TableCell>
                            <TableCell className="text-right">
                            <DeactivateButton
                                disable={user.user_status === "ACTIVE"}
                                userId={user.id}
                                userName={`${user.user_firstname} ${user.user_lastname}`}
                                userEmail={user.user_email}
                                onActivateDeactivate={handleActivateDeactivate}
                            />
                            </TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="flex justify-center gap-10 mt-5">
              <AddUserDialog 
                addType={user_role} 
                onUserAdded={() => {
                  // Refresh the users list after adding a new user
                  const fetchUsers = async () => {
                    try {
                      setIsLoading(true);
                      const users = await readUsers();
                      setCompleteUsers(users as unknown as User[]);
                      toast.success("Users List Refreshed");
                    } catch (error) {
                      console.error("Error fetching users:", error);
                      toast.error("Failed to Refresh Users List");
                    } finally {
                      setIsLoading(false);
                    }
                  };
                  fetchUsers();
                }}
                userType={user_role}
              />
              <BatchDeactivateDialog users={usersSample} />
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}