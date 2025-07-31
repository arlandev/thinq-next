"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { readUsers } from "@/app/actions/adminReadUsers"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// Define the Inquiry type
interface Inquiry {
  referenceNumber: string
  inquirerEmail: string
  affiliation: string
  concern: string
  specificConcern: string
  concernDetails: string
  assignedTo?: string
}

interface InquiryDetailsDialogProps {
  inquiry?: Inquiry
  trigger?: React.ReactNode
}

const defaultInquiry: Inquiry = {
  referenceNumber: "",
  inquirerEmail: "",
  affiliation: "",
  concern: "",
  specificConcern: "",
  concernDetails: "",
  assignedTo: "",
}

interface Personnel {
  id: number;
  user_email: string;
  user_firstname: string;
  user_lastname: string;
  user_role: string;
  user_type: string;
  user_affiliation: string;
  user_status: string;
}

export default function InquiryDetailsDialog({ inquiry = defaultInquiry, trigger }: InquiryDetailsDialogProps) {
  
  const [personnels, setPersonnels] = useState<Personnel[]>([]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchUsers = async () => {
      try {
        const users = await readUsers();
        if (isMounted) {
          setPersonnels(users as unknown as Personnel[]);
          toast.success("Available Personnels loaded successfully");
          console.log(users)
        }
      } catch (error) {
        console.error("Error fetching personnels:", error);
        if (isMounted) {
          toast.error("Failed to load personnels");
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);
  
  const [open, setOpen] = useState(false)
  const [selectedAssignee, setSelectedAssignee] = useState<string>(inquiry.assignedTo ?? "")

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving inquiry with assignee:", selectedAssignee)
    setOpen(false)
  }

  const handleCancel = () => {
    // Reset any changes
    setSelectedAssignee(inquiry.assignedTo ?? "")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button variant="outline">View Details</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inquiry Details</DialogTitle>
          <DialogDescription>View the complete information for this inquiry.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Row 1 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="referenceNumber" className="text-right font-medium">Reference Number</Label>
            <Input id="referenceNumber" value={inquiry.referenceNumber} className="col-span-3" disabled />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="inquirerEmail" className="text-right font-medium">Inquirer</Label>
            <Input id="inquirerEmail" value={inquiry.inquirerEmail} className="col-span-3" disabled />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="affiliation" className="text-right font-medium">Affiliation</Label>
            <Input id="affiliation" value={inquiry.affiliation} className="col-span-3" disabled />
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="concern" className="text-right font-medium">Concern</Label>
            <Input id="concern" value={inquiry.concern} className="col-span-3" disabled />
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="specificConcern" className="text-right font-medium pt-2">Specific Concern</Label>
            <div className="col-span-3">
              <Textarea
                id="specificConcern"
                value={inquiry.specificConcern}
                className="min-h-[100px] resize-none"
                disabled
              />
            </div>
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="concernDetails" className="text-right font-medium pt-2">Concern Details</Label>
            <div className="col-span-3">
              <Textarea
                id="concernDetails"
                value={inquiry.concernDetails}
                className="min-h-[150px] bg-muted resize-none"
                disabled
              />
            </div>
          </div>

          {/* Row 7 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignTo" className="text-right font-medium">
              Assign To
            </Label>
            <div className="col-span-3">
              {!inquiry.assignedTo ? (
                <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Assign this inquiry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Personnel</SelectLabel>
                      {personnels.filter(user => user.user_role==='PERSONNEL').map(personnel => (
                        <SelectItem key={personnel.id} value={personnel.id.toString()} onClick={() => setSelectedAssignee(personnel.id.toString())}>{personnel.user_firstname} {personnel.user_lastname}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="font-medium">{inquiry.assignedTo}</div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedAssignee("")}>
                    Reassign
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
          <Button variant="default" type="button" onClick={handleSave}disabled={!selectedAssignee && !inquiry.assignedTo}>
            Save & Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
