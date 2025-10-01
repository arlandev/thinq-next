// TODO: add update logic
"use client";

import { Button } from "@/components/ui/button";

import { useState } from "react";

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
import { updateUser } from "@/app/actions/updateUser";

interface User {
    id: number,
    firstname: string,
    lastname: string,
    email: string
}

interface EditDialogProps {
    user: User,
    onSave?: (updatedUser: User) => void,
}

function EditDialog( { user, onSave } : EditDialogProps ) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = async () => {
    const hasChanges =
      formData.firstname.trim() !== user.firstname.trim() ||
      formData.lastname.trim() !== user.lastname.trim() ||
      formData.email.trim() !== user.email.trim();

    if (!hasChanges) {
      setOpen(false);
      return;
    }

    const res = await updateUser({ 
      id: user.id, 
      firstname: formData.firstname, 
      lastname: formData.lastname, 
      email: formData.email 
    });
    if (res.success) {
      onSave?.({ ...user, ...formData });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the selected user.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstname" className="text-right">
              First Name
            </Label>
            <Input
              id="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastname" className="text-right">
              Last Name
            </Label>
            <Input
              id="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditDialog;
