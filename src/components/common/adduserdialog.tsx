import React, { useState } from "react";

import { CirclePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateInput } from "@/components/ui/dateinput";

export default function AddUserDialog(user: any) {
  const [newUser, setNewUser] = useState([
    {
      id: Date.now(),
      firstname: "",
      lastname: "",
      email: "",
      dob: "",
    },
  ]);

  const isAddMany = newUser.length > 1;

  const addUserForm = () => {
    const newUserForm = {
      id: Date.now(),
      firstname: "",
      lastname: "",
      email: "",
      dob: "",
    };

    setNewUser([...newUser, newUserForm]);
  };

  const removeUserForm = (id: any) => {
    if (newUser.length > 1) {
      setNewUser(newUser.filter((newUser) => newUser.id !== id));
    }
  };

  const handleInputChange = (id: any, field: any, value: any) => {
    setNewUser(
      newUser.map((newUser) =>
        newUser.id === id ? { ...newUser, [field]: value } : newUser,
      ),
    );
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    newUser.forEach(async (user) => {
      console.log("User added to database:", user);
    });
  };

return (
    <Dialog>
        <DialogTrigger asChild>
            <Button>Add User</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-1/2">
            <DialogHeader>
            <DialogTitle>ADD {user.addType.toUpperCase()}</DialogTitle>
            <DialogDescription>
                This action will add a user to our database.
            </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
                <div className="overflow-auto h-57"> {newUser.map((form, index) => (
                    <div className="grid gap-4 py-4" key={form.id}>
                        <h3 className={!isAddMany ? "hidden" : "font-bold"}>Inquirer User {index + 1}</h3>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" className="text-right">First Name</Label>
                            <Input id="firstName" name="firstName" className="col-span-3" value={form.firstname} onChange={(e) => handleInputChange(form.id, "firstname", e.target.value)}/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" className="text-right">Last Name</Label>
                            <Input id="lastName" name="lastName" className="col-span-3" value={form.lastname} onChange={(e) => handleInputChange(form.id, "lastname", e.target.value)} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email Address</Label>
                            <div className="col-span-3 flex items-center">
                                <Input id="email" type="text" name="email" className="rounded-r-none" value={form.email} onChange={(e) => handleInputChange(form.id, "email", e.target.value)} />
                                <div className="dark:bg-input/30 border-input flex h-9 rounded-r-md border border-l-0 bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] text-gray-500 group-hover:border-gray-400">@ust.edu.ph</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dob" className="text-right">Date of Birth</Label>
                            <DateInput name="dob" id="dob" value={form.dob} onChange={(value: any) => handleInputChange(form.id, "dob", value)} />
                            <Button className="col-start-4 bg-red-700 hover:bg-red-600 cursor-pointer" disabled={!isAddMany} onClick={() => removeUserForm(form.id)}>Remove</Button>
                        </div>
                        <hr className={!isAddMany ? "hidden" : "mt-6 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"}/>
                    </div>
                    ))}
                </div>

                <div className="w-full grid grid-rows-* place-items-center gap-6 mt-5">
                    <div className="grid grid-cols-13 w-full items-center hover:opacity-75">
                        <hr className="col-span-6 h-1 bg-primary border-0 rounded-sm dark:bg-gray-700" />
                        <button>
                            <CirclePlus className="col-start-7 col-span-1 justify-self-center cursor-pointer" strokeWidth={3} onClick={(e) => {addUserForm(); e.preventDefault();}}/>
                        </button>
                        <hr className="col-span-6 h-1 bg-primary border-0 rounded-sm dark:bg-gray-700" />
                    </div>

                    <div className="grid grid-cols-4 gap-2 w-ful">
                        <Button className="col-start-2 cursor-pointer" onClick={(e) => e.preventDefault()}>CSV Import</Button>
                        <Button className="col-start-3 cursor-pointer" type="submit">Add</Button>
                    </div>
                </div>
            </form>
        </DialogContent>
    </Dialog>
    );
}