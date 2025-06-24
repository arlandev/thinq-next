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

interface deactivateProps {
    disable: boolean,
    inquirerName: string,
    inquirerEmail: string
}

function DeactivateButton( { disable, inquirerName, inquirerEmail } : deactivateProps ) {
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
              defaultValue={inquirerName}
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
              defaultValue={inquirerEmail}
              className="col-span-3"
              disabled
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            {disable ? "Deactivate" : "Activate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeactivateButton;
