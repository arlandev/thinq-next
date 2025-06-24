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

// Define the User type based on your database schema
interface User {
  id: number
  email: string
  role: string
  isActive: boolean
  hasActiveTickets: boolean
}

interface BatchDeactivateDialogProps {
  users?: User[]
}

export default function BatchDeactivateDialog({ users = [] }: BatchDeactivateDialogProps) {
  // State to control open and close of dialog
  const [open, setOpen] = useState(false)

  // Only get active users to show in the table
  const activeUsers = users.filter((user) => user.isActive)

  const [selectedUsers, setSelectedUsers] = useState<Record<number, boolean>>({})

  // Update selectedUsers by flipping a switch for the userId
  const handleCheckboxChange = (userId: number) => {
    setSelectedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
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
    console.log("Deactivating users with IDs:", userIdsToDeactivate)

    // Reset selected users
    setSelectedUsers({})

    // Close the dialog
    setOpen(false)
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
                  <TableHead className="text-right">Active Tickets</TableHead>
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
                          aria-label={`Select user ${user.email}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell className="text-right">
                        {user.hasActiveTickets ? (
                          <span className="text-amber-600">Yes</span>
                        ) : (
                          <span className="text-green-600">No</span>
                        )}
                      </TableCell>
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
            <Button type="submit" disabled={selectedCount === 0} className="min-w-[100px]">
              Deactivate {selectedCount > 0 ? `(${selectedCount})` : ""}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
