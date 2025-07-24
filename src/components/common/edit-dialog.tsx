// TODO: add update logic

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

interface User {
    id: string,
    name: string,
    email: string
}

interface EditDialogProps {
    user: User,
    onSave: (updatedUser: User) => void,
}

function EditDialog( { user, onSave } : EditDialogProps ) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement saving of edit

    // console.log(user.name);
    // console.log(user.email);
    // console.log(formData.name);
    // console.log(formData.email);

    const hasChanges =
      formData.name.trim() !== user.name.trim() ||
      formData.email.trim() !== user.email.trim();

    if (hasChanges && onSave) {
      onSave({ ...user, ...formData });
      console.log("Changes saved:", formData);
    } else {
      console.log("No changes detected.");
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
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
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
