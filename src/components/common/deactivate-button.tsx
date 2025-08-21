import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { deactivateUser, activateUser } from "@/app/actions/deactivateUser";

import { Loader2 } from "lucide-react";
import { useState } from "react";

interface deactivateProps {
    disable: boolean,
    userId: number,
    userName: string,
    userEmail: string,
    onActivateDeactivate?: () => void
}

function DeactivateButton( { disable, userId, userName, userEmail, onActivateDeactivate } : deactivateProps ) {

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDeactivate = async () => {
    setIsSubmitting(true)
    try {
      const response = await deactivateUser(userId);
      if (response.success) {
        toast.success("User Deactivated Successfully");
        onActivateDeactivate?.();
      } else {
        toast.error("Failed to Deactivate User");
      }
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast.error("Failed to deactivate user");
    }
    setIsSubmitting(false)
  }

  const handleActivate = async () => {
    setIsSubmitting(true)
    try {
      const response = await activateUser(userId);
      if (response.success) {
        toast.success("User Activated Successfully");
        onActivateDeactivate?.();
      } else {
        toast.error("Failed to Activate User");
      }
    } catch (error) {
      console.error("Error activating user:", error);
      toast.error("Failed to activate user");
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={`w-24 ${disable ? "bg-red-700" : "bg-green-700 hover:bg-green-600"}`}
          variant={disable ? "destructive" : "default"}
        >
          {disable ? "Deactivate" : "Activate"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {disable
              ? "Deactivate this account?"
              : "Activate this account?"}
          </DialogTitle>
          <DialogDescription>
            {disable
              ? "This action will disable this account."
              : "This action will enable this account."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue={userName}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              defaultValue={userEmail}
              className="col-span-3"
              disabled
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={disable ? handleDeactivate : handleActivate}>
            {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {disable ? "Deactivate" : "Activate"}
                </>
              ) : (
                disable ? "Deactivate" : "Activate"
              )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeactivateButton;
