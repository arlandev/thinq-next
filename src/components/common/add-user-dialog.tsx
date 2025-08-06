"use client";

import React, { useState } from "react";
import type { JSX } from "react";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateInput } from "@/components/ui/dateinput";
import { toast } from "sonner";
import { addUser } from "@/app/actions/addUser";

type AddUserDialogProps = {
  addType: string;
  onUserAdded?: () => void;
  userType: string;
}

const affiliationList = [
  {
    value: "CICS",
    label: "College of Information and Computing Sciences"
  },
  {
    value: "CTHM",
    label: "College of Tourism and Hospitality Management"
  },
  {
    value: "AMV-COA",
    label: "AMV College of Accountancy"
  },
  {
    value: "COE",
    label: "College of Engineering"
  },
]

export default function AddUserDialog( {addType, onUserAdded, userType}: AddUserDialogProps): JSX.Element {
  const [newUser, setNewUser] = useState([
    {
      id: Date.now(),
      firstname: "",
      lastname: "",
      email: "",
      dob: "",
      type: "",
      affiliation: "",
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
      type: "",
      affiliation: "",
    };

    setNewUser([...newUser, newUserForm]);
  };

  const removeUserForm = (id: number) => {
    if (newUser.length > 1) {
      setNewUser(newUser.filter((newUser) => newUser.id !== id));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        console.log(text);
        // Parse the text content
      };
      reader.readAsText(file);
    }
  };

  const handleInputChange = (id: number, field: string, value: string) => {
    setNewUser(
      newUser.map((newUser) =>
        newUser.id === id ? { ...newUser, [field]: value } : newUser,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("User to be added to database:", newUser);
    
    try {
      for (const user of newUser) {
        // TODO: Add role, type, affiliation fields to the form
        const userType = addType.toLowerCase();

        let user_role: number;
        switch (userType) {
          case "inquirer":
            user_role = 1;
            break;
          case "dispatcher":
            user_role = 2;
            break;
          case "personnel":
            user_role = 3;
            break;
          default:
            user_role = 1;
            break;
        }

        let inquirer_type: number = 0;
        switch (user.type) {
          case "Student":
            inquirer_type = 1;
            break;
          case "Employee":
            inquirer_type = 2;
            break;
          default:
            inquirer_type = 0;
            break;
        }

        const user_email = user.email;
        const user_firstname = user.firstname;
        const user_lastname = user.lastname;
        const user_dob = user.dob;
        const user_type = inquirer_type;
        const user_affiliation = user.affiliation;

        const successfulAdd = await addUser(user_email, user_firstname, user_lastname, user_dob, user_role, user_type, user_affiliation);
        if (successfulAdd) {
          console.log("User added to database:", successfulAdd);
        } else {
          console.log("User not added to database:", successfulAdd);
        }
      }
      
      toast.success("User(s) added successfully");
      onUserAdded?.(); // Call the callback to refresh the list
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user");
    }
  };

return (
    <Dialog>
        <DialogTrigger asChild>
            <Button>Add User</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-1/2">
            <DialogHeader>
            <DialogTitle>ADD {addType.toUpperCase()}</DialogTitle>
            <DialogDescription>
                This action will add a user to our database.
            </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
                <div className="overflow-auto h-57"> {newUser.map((form, index) => (
                    <div className="grid gap-4 py-4" key={form.id}>
                        <h3 className={!isAddMany ? "hidden" : "font-bold"}>{userType.charAt(0).toUpperCase() + userType.slice(1).toLowerCase()} User {index + 1}</h3>
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
                            <Label htmlFor="affiliation" className="text-right">Affiliation</Label>
                            <Select 
                              value={form.affiliation} 
                              onValueChange={(value) => handleInputChange(form.id, "affiliation", value)}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select affiliation" />
                              </SelectTrigger>
                              <SelectContent>
                                {affiliationList.map((affiliation) => (
                                  <SelectItem key={affiliation.value} value={affiliation.value}>{affiliation.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                        </div>


                        { addType == "INQUIRER" && (
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">Inquirer Type</Label>
                            <Select 
                              value={form.type} 
                              onValueChange={(value) => handleInputChange(form.id, "type", value)}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Student">Student</SelectItem>
                                <SelectItem value="Employee">Employee</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dob" className="text-right">Date of Birth</Label>
                            <DateInput name="dob" id="dob" value={form.dob} onChange={(value: string) => handleInputChange(form.id, "dob", value)} />
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

                    <div className="grid grid-cols-4 gap-2 w-full">
                        <div className="col-start-2">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="hidden"
                                id="csv-import"
                            />
                            <Button 
                                type="button"
                                className="cursor-pointer" 
                                onClick={() => document.getElementById('csv-import')?.click()}
                            >
                                CSV Import
                            </Button>
                        </div>
                        <Button className="col-start-3 cursor-pointer" type="submit">Add</Button>
                    </div>
                </div>
            </form>
        </DialogContent>
    </Dialog>
    );
}