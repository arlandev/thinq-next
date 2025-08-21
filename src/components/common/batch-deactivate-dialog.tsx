"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useState } from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { batchDeactivateUsers } from "@/app/actions/deactivateUser"

import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Define the User type based on your database schema
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

interface BatchDeactivateDialogProps {
  users?: User[];
  user_role: string;
  onUsersDeactivated?: () => void;
}

export default function BatchDeactivateDialog({ users = [], user_role, onUsersDeactivated }: BatchDeactivateDialogProps) {
  // State to control open and close of dialog
  const [open, setOpen] = useState(false)

  // Only get active users to show in the table
  const activeUsers = users.filter((user) => user.user_status === "ACTIVE" && user.user_role === user_role)

  const [selectedUsers, setSelectedUsers] = useState<Record<number, boolean>>({})

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update selectedUsers by flipping a switch for the userId
  const handleCheckboxChange = (userId: number) => {
    setSelectedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true)
    e.preventDefault()

    // Load array of user IDs to deactivate
    const userIdsToDeactivate = Object.keys(selectedUsers)
      .filter((userId) => selectedUsers[Number(userId)])
      .map(Number)

    if (userIdsToDeactivate.length === 0) {
      console.log("No users selected")
      return
    }

    // TODO: Call API for deactivation
    // console.log("Deactivating users with IDs:", userIdsToDeactivate)
    const result = await batchDeactivateUsers(userIdsToDeactivate)
    if (result.success) {
      toast.success("Users deactivated successfully")
      // Trigger callback to refresh the users list
      onUsersDeactivated?.()
    } else {
      toast.error("Failed to deactivate users")
    }

    // Reset selected users
    setSelectedUsers({})

    // Close the dialog
    setOpen(false)
    setIsSubmitting(false)
  }

  const selectedCount = Object.values(selectedUsers).filter(Boolean).length

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Batch Deactivate</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Deactivate Users</DialogTitle>
          <DialogDescription>Deactivate multiple selected users. This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <span className="sr-only">Select</span>
                  </TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  {/* <TableHead className="text-right">Active Tickets</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeUsers.length > 0 ? (
                  activeUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={!!selectedUsers[user.id]}
                          onChange={() => handleCheckboxChange(user.id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          aria-label={`Select user ${user.user_email}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.user_email}</TableCell>
                      <TableCell className="capitalize">{user.user_role}</TableCell>
                      {/* <TableCell className="text-right">
                        {user.hasActiveTickets ? (
                          <span className="text-amber-600">Yes</span>
                        ) : (
                          <span className="text-green-600">No</span>
                        )}
                      </TableCell> */}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No active users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={selectedCount === 0 || isSubmitting} className="min-w-[100px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deactivating...
                </>
              ) : (
                `Deactivate ${selectedCount > 0 ? `(${selectedCount})` : ""}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
