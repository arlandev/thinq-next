"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

import { submitResolution } from "@/app/actions/submitResolution"

// Define the Inquiry type
interface Inquiry {
  referenceNumber: string
  inquirerEmail: string
  inquirerName: string
  affiliation: string
  concern: string
  specificConcern: string
  concernDetails: string
  submittedDate: string
  status: string
  resolution?: string
  resolvedDate?: string
}

interface PersonnelInquiryDialogProps {
  inquiry?: Inquiry
  trigger?: React.ReactNode
  onResolutionComplete?: () => void
}

const defaultInquiry: Inquiry = {
  referenceNumber: "",
  inquirerEmail: "",
  inquirerName: "",
  affiliation: "",
  concern: "",
  specificConcern: "",
  concernDetails: "",
  submittedDate: "",
  status: "",
  resolution: "",
  resolvedDate: "",
}

export default function PersonnelInquiryDialog({ inquiry = defaultInquiry, trigger, onResolutionComplete }: PersonnelInquiryDialogProps) {
  
  const [open, setOpen] = useState(false)
  const [resolutionNotes, setResolutionNotes] = useState<string>(inquiry.resolution ?? "")

  const handleSave = async () => {
    // TODO: Implement the API call to save resolution notes
    const personnelId = 7; // TODO: Get user ID from session

    try {
      // Placeholder for now - replace with actual API call
      console.log("Saving resolution for ticket:", inquiry.referenceNumber)
      console.log("Resolution notes:", resolutionNotes)
      const result = await submitResolution(parseInt(inquiry.referenceNumber), personnelId, resolutionNotes)

      if (result) {
        toast.success("Resolution notes saved successfully")
        onResolutionComplete?.()
      } else {
        toast.error("Failed to save resolution notes")
      }
      
    } catch (error) {
      console.error("Error saving resolution:", error)
      toast.error("Failed to save resolution notes")
    }
  }

  const handleCancel = () => {
    // Reset any changes
    setResolutionNotes(inquiry.resolution ?? "")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button variant="outline">View Details</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inquiry Details</DialogTitle>
          <DialogDescription>View inquiry details and add resolution notes.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Row 1 - Ticket Number */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="referenceNumber" className="text-right font-medium">Ticket Number</Label>
            <Input id="referenceNumber" value={inquiry.referenceNumber || ""} className="col-span-3" disabled />
          </div>

          {/* Row 2 - Submission Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="submittedDate" className="text-right font-medium">Date Submitted</Label>
            <Input id="submittedDate" value={inquiry.submittedDate || ""} className="col-span-3" disabled />
          </div>

          {/* Row 3 - Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right font-medium">Status</Label>
            <Input id="status" value={inquiry.status || ""} className="col-span-3" disabled />
          </div>

          {/* Row 4 - Inquirer Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="inquirerName" className="text-right font-medium">Inquirer Name</Label>
            <Input id="inquirerName" value={inquiry.inquirerName || ""} className="col-span-3" disabled />
          </div>

          {/* Row 5 - Inquirer Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="inquirerEmail" className="text-right font-medium">Inquirer Email</Label>
            <Input id="inquirerEmail" value={inquiry.inquirerEmail || ""} className="col-span-3" disabled />
          </div>

          {/* Row 6 - Affiliation */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="affiliation" className="text-right font-medium">Affiliation</Label>
            <Input id="affiliation" value={inquiry.affiliation || ""} className="col-span-3" disabled />
          </div>

          {/* Row 7 - Concern */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="concern" className="text-right font-medium">Concern</Label>
            <Input id="concern" value={inquiry.concern || ""} className="col-span-3" disabled />
          </div>

          {/* Row 8 - Specific Concern */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="specificConcern" className="text-right font-medium pt-2">Specific Concern</Label>
            <div className="col-span-3">
              <Textarea
                id="specificConcern"
                value={inquiry.specificConcern || ""}
                className="min-h-[100px] resize-none"
                disabled
              />
            </div>
          </div>

          {/* Row 9 - Concern Details */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="concernDetails" className="text-right font-medium pt-2">Concern Details</Label>
            <div className="col-span-3">
              <Textarea
                id="concernDetails"
                value={inquiry.concernDetails || ""}
                className="min-h-[150px] bg-muted resize-none"
                disabled
              />
            </div>
          </div>

          {/* Row 10 - Resolution Notes (Editable) */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="resolutionNotes" className="text-right font-medium pt-2">
              Resolution Notes
            </Label>
            <div className="col-span-3">
              <Textarea
                id="resolutionNotes"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="min-h-[150px] resize-none"
                placeholder="Enter resolution notes for the inquirer..."
              />
            </div>
          </div>

          {/* Row 11 - Resolved Date (if exists) */}
          {inquiry.resolvedDate && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resolvedDate" className="text-right font-medium">Resolved Date</Label>
              <Input id="resolvedDate" value={inquiry.resolvedDate} className="col-span-3" disabled />
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
          <Button variant="default" type="button" onClick={handleSave}>
            Save Resolution
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 