"use client";
import React, { useState, useEffect } from "react";
import type { JSX } from "react";
import { CirclePlus, Loader2 } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateInput } from "@/components/ui/dateinput";
import { toast } from "sonner";
import { addUser } from "@/app/actions/addUser";
import { fetchAffiliationList } from "@/app/actions/fetchAffiliationList";
import { addUserCsv } from "@/app/actions/addUserCsv";


type AddUserDialogProps = {
  addType: string;
  onUserAdded?: () => void;
  userType: string;
}

export default function AddUserDialog({
  addType,
  onUserAdded,
  userType
}: AddUserDialogProps): JSX.Element {
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

  const [affiliationList, setAffiliationList] = useState<{
    affiliation_id: number;
    affiliation_name: string;
  }[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [affiliationListLoaded, setAffiliationListLoaded] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const [csvFileContent, setCsvFileContent] = useState<{
    firstname: string;
    lastname: string;
    role: string;
    type: string;
    email: string;
    dob: string;
    affiliation: string;
    status: string;
  }[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, userType: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        
        if (!text) {
          console.error('No text content found in file');
          return;
        }

        // Parse CSV content
        const lines = text.split('\n');
        if (lines.length === 0 || !lines[0]) {
          console.error('No lines found in CSV file');
          return;
        }
        const headers = lines[0].split(',').map(header => header.trim());
        
        const parsedData = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',').map(value => value.trim());
          const row: any = {};
          
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          
          return {
            firstname: row.user_firstname || '',
            lastname: row.user_lastname || '',
            role: row.user_role || '',
            email: row.user_email || '',
            dob: row.user_dob || '',
            type: row.user_type || '',
            affiliation: row.user_affiliation || '',
            status: row.user_status || 'active'
          };
        });

        setCsvFile(file);
        setCsvFileContent(parsedData);
      };
      reader.readAsText(file);
    }
  };

  const clearCsvFile = () => {
    setCsvFile(null); // clear csv file attachment
    setCsvFileContent([]); // clear csv file content
    // Clear the file input value
    const fileInput = document.getElementById('csv-import') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleInputChange = (id: number, field: string, value: string) => {
    setNewUser(
      newUser.map((newUser) =>
        newUser.id === id ? { ...newUser, [field]: value } : newUser
      )
    );
  };

  useEffect(() => {
    if (isDialogOpen && !affiliationListLoaded) {
      const loadAffiliationList = async () => {
        try {
          const affiliationList = await fetchAffiliationList();
          setAffiliationList(
            affiliationList as unknown as {
              affiliation_id: number;
              affiliation_name: string;
            }[]
          );
          setAffiliationListLoaded(true);
        } catch (error) {
          console.error('Error loading affiliations:', error);
          setAffiliationListLoaded(true); // Still set to true to show error state
        }
      };
      loadAffiliationList();
    }
  }, [isDialogOpen, affiliationListLoaded]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("User to be added to database:", newUser);

    try {
      // CSV Input
      if (csvFile !== null && csvFileContent.length > 0) {
        // Set user role based on user type
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

        const result = await addUserCsv(csvFileContent, user_role);
        toast.success("User(s) Added Successfully");
        onUserAdded?.(); // Refresh user list
        clearCsvFile();
      } else {
        for (const user of newUser) {
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
  
          const successfulAdd = await addUser(
            user_email,
            user_firstname,
            user_lastname,
            user_dob,
            user_role,
            user_type,
            user_affiliation
          );
  
          if (successfulAdd) {
            console.log("User Added to Database");
          } else {
            console.log("User Not Added to Database");
          }
        }
  
        toast.success("User(s) Added Successfully");
        onUserAdded?.(); // Call the callback to refresh the list
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to Add User(s)");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
          { csvFile !== null && csvFileContent.length > 0 
            ? 
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Affiliation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvFileContent.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.firstname}</TableCell>
                      <TableCell>{row.lastname}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.dob}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.affiliation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
            : 
            <div className="overflow-auto h-57">
              {newUser.map((form, index) => (
                <div className="grid gap-4 py-4" key={form.id}>
                  <h3 className={!isAddMany ? "hidden" : "font-bold"}>
                    {userType.charAt(0).toUpperCase() +
                      userType.slice(1).toLowerCase()}{" "}
                    User {index + 1}
                  </h3>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="firstName" className="text-right">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      className="col-span-3"
                      value={form.firstname}
                      onChange={(e) =>
                        handleInputChange(form.id, "firstname", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastName" className="text-right">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      className="col-span-3"
                      value={form.lastname}
                      onChange={(e) =>
                        handleInputChange(form.id, "lastname", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email Address
                    </Label>
                    <div className="col-span-3 flex items-center">
                      <Input
                        id="email"
                        type="text"
                        name="email"
                        className="rounded-r-none"
                        value={form.email}
                        onChange={(e) =>
                          handleInputChange(form.id, "email", e.target.value)
                        }
                      />
                      <div className="dark:bg-input/30 border-input flex h-9 rounded-r-md border border-l-0 bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] text-gray-500 group-hover:border-gray-400">
                        @ust.edu.ph
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="affiliation" className="text-right">
                      Affiliation
                    </Label>
                    <Select
                      value={form.affiliation}
                      onValueChange={(value) =>
                        handleInputChange(form.id, "affiliation", value)
                      }
                      disabled={!affiliationListLoaded}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue
                          placeholder={
                            affiliationListLoaded
                              ? "Select affiliation"
                              : "Loading..."
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {affiliationListLoaded &&
                          affiliationList.map((affiliation) => (
                            <SelectItem
                              key={affiliation.affiliation_id}
                              value={affiliation.affiliation_name}
                            >
                              {affiliation.affiliation_name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {addType == "INQUIRER" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Inquirer Type
                      </Label>
                      <Select
                        value={form.type}
                        onValueChange={(value) =>
                          handleInputChange(form.id, "type", value)
                        }
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
                    <Label htmlFor="dob" className="text-right">
                      Date of Birth
                    </Label>
                    <DateInput
                      name="dob"
                      id="dob"
                      value={form.dob}
                      onChange={(value: string) =>
                        handleInputChange(form.id, "dob", value)
                      }
                    />
                    <Button
                      className="col-start-4 bg-red-700 hover:bg-red-600 cursor-pointer"
                      disabled={!isAddMany}
                      onClick={() => removeUserForm(form.id)}
                    >
                      Remove
                    </Button>
                  </div>
                  <hr
                    className={
                      !isAddMany
                        ? "hidden"
                        : "mt-6 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"
                    }
                  />
                </div>
              ))}
            </div>
          }
          
          <div className="w-full grid grid-rows-* place-items-center gap-6 mt-5">

            { csvFile !== null && csvFileContent.length > 0 
              ? <></>
              : 
              <div className="grid grid-cols-13 w-full items-center hover:opacity-75">
                <hr className="col-span-6 h-1 bg-primary border-0 rounded-sm dark:bg-gray-700" />
                <button>
                  <CirclePlus
                    className="col-start-7 col-span-1 justify-self-center cursor-pointer"
                    strokeWidth={3}
                    onClick={(e) => {
                      addUserForm();
                      e.preventDefault();
                    }}
                  />
                </button>
                <hr className="col-span-6 h-1 bg-primary border-0 rounded-sm dark:bg-gray-700" />
              </div>
            }
            
            <div className="grid grid-cols-4 gap-2 w-full">
              <div className="col-start-2">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, userType)}
                  className="hidden"
                  id="csv-import"
                />
                {csvFile ? (
                  <div className="flex gap-2">
                    <Button type="button" className="cursor-pointer" disabled={true}>
                      {csvFile.name}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={clearCsvFile}
                    >
                      Clear
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => document.getElementById('csv-import')?.click()}
                  >
                    CSV Import
                  </Button>
                )}
              </div>
              <Button 
                 className="col-start-3 cursor-pointer" 
                 type="submit"
                 disabled={isSubmitting}
               >
                 {isSubmitting ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Adding...
                   </>
                 ) : (
                   "Add"
                 )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
