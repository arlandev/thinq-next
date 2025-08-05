"use client";

import { useState, useEffect } from "react";
import { ChevronsUpDown } from "lucide-react";
import Link from "next/link";

import NavBar from "@/components/common/navbar";
import PageLayout from "@/components/common/page-layout";
import { Skeleton } from "@/components/ui/skeleton";


import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { FileInput } from "@/components/ui/file-input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { submitForm } from "@/app/actions/submitForm";
import { readConcerns } from "@/app/actions/readConcerns";

interface Concern {
  concern_id: number;
  concern_title: string;
  concern_faq:{}[];
  applicable_to: string;
}

interface Subconcern {
  subconcern_id: number;
  subconcern_title: string;

  concern?: {
    concern_id:number;
  }
}

const subconcernslist =[
  {subconcern_id: 1, subconcern_title:'sub1', concern_id:1},
  {subconcern_id: 2, subconcern_title:'sub2', concern_id:1},
  {subconcern_id: 3, subconcern_title:'sub3', concern_id:2}
]

const InquiryForm = () => {
  // TODO: add file upload
  const [currentStep, setCurrentStep] = useState(0);
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);

  const [concerns, setConcerns] = useState<Concern[]>([])
  const [openConcerns, setOpenConcerns] = useState(false);
  const [concernValue, setConcernValue] = useState("");

  const [subconcerns, setSubconcerns] = useState<Subconcern[]>([])
  const [openSubconcerns, setOpenSubconcerns] = useState(false);
  const [subconcernValue, setSubconcernValue] = useState("");
  const [waitingSubmission, setWaitingSubmission] = useState(false);

  const [fileArray, setFileArray] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    name: "testname",
    email: "testemail",
    role: "testrole",
    affiliation: "testaffiliation",
    concern: "",
    subconcern: "",
    details: "",
  });

  useEffect(() => {
    let isMounted = true;
    
    const fetchConcerns = async () => {
      try {
        const concernsData = await readConcerns();
        if (isMounted) {
          setConcerns(concernsData as unknown as Concern[]);
          toast.success("Loaded successfully");
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        if (isMounted) {
          toast.error("Failed to load");
        }
      }
    };

    fetchConcerns();

    return () => {
      isMounted = false;
    };
  }, []);

  const isFormComplete = formData.concern.trim() !== "" && formData.subconcern.trim() !== "" && formData.details.trim() !== "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const nextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("Form submitted:", formData);

    setWaitingSubmission(true);

    setCurrentStep(currentStep + 1);

    // TODO: add file upload
    const result = await submitForm(formData);
    console.log(result);

    if (result) {
      setWaitingSubmission(false);
      setSubmittedTicket(result);
      toast.success("Inquiry submitted successfully");
    } else {
      toast.error("Failed to submit inquiry");
      setWaitingSubmission(false);
    }

    // Handle form submission logic here
  };

  const sections = [
    <>
      <CardHeader className="mt-2">
        <CardTitle className="text-3xl font-bold font-main justify-self-center">
          INQUIRY FORM
        </CardTitle>
        <CardDescription className="justify-self-center italic">
          All fields are required
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Card className="bg-primary/5 w-5/6 justify-self-center">
          <CardContent className="grid grid-rows-4 text-xs gap-1">
            <div className="grid grid-cols-3">
              <div className="col-span-1">
                <p className="font-bold">Full Name:</p>
              </div>
              <div className="col-span-2">
                <p>{formData.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="col-span-1">
                <p className="font-bold">UST Email Address:</p>
              </div>
              <div className="col-span-2">
                <p>{formData.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="col-span-1">
                <p className="font-bold">Role:</p>
              </div>
              <div className="col-span-2">
                <p>{formData.role}</p>
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="col-span-1">
                <p className="font-bold">Affiliation:</p>
              </div>
              <div className="col-span-2">
                <p>{formData.affiliation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-5">
          <div className="grid grid-rows-* gap-5 w-5/6 mx-auto my-3">
            <div>
              <Label htmlFor="concern" className="mb-1">
                Concern
              </Label>
              <Popover open={openConcerns} onOpenChange={setOpenConcerns}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={openConcerns} className="w-64 justify-between">
                    {concernValue ? concerns.find((concern) => concern.concern_title === concernValue,)?.concern_title : "Select concern..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0">
                  <Command>
                    <CommandInput placeholder="Search concern..." />
                    <CommandEmpty>No Concern found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {concerns.map((concern) => (
                          <CommandItem
                            key={concern.concern_id}
                            value={concern.concern_title}
                            onSelect={(currentValue) => {
                              setConcernValue(currentValue === concernValue ? "" : currentValue,);
                              setFormData({...formData, concern: currentValue});
                              setOpenConcerns(false);
                              toast(`View FAQs for ${currentValue} concerns`, {
                                description: "Swipe to dismiss",
                                action: {
                                  label: "View",
                                  onClick: (e) => {
                                    e.preventDefault();
                                    console.log("open FAQs");
                                  },
                                },
                                duration: Number.POSITIVE_INFINITY,
                              });
                            }}
                          >
                            {concern.concern_title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="subconcern" className="mb-1">Specific Concern</Label>
              <Popover open={openSubconcerns} onOpenChange={setOpenSubconcerns}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={openConcerns} className="w-64 justify-between">
                    {subconcernValue ? subconcernslist.find((subconcern) => subconcern.subconcern_title === subconcernValue,)?.subconcern_title : "What's the specific issue?"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0">
                  <Command>
                    <CommandInput placeholder="Search sub-concern..." />
                    <CommandEmpty>No Sub-Concern found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {subconcernslist.map((subconcern) => (
                          <CommandItem
                            key={subconcern.subconcern_id}
                            value={subconcern.subconcern_title}
                            onSelect={(currentValue) => {
                              setSubconcernValue(currentValue === subconcernValue ? "" : currentValue,);
                              setFormData({...formData, subconcern: currentValue});
                              setOpenSubconcerns(false);
                            }}
                          >
                            {subconcern.subconcern_title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="details" className="mb-1">Concern:</Label>
              <Textarea
                id="details"
                name="details"
                value={formData.details}
                placeholder="Enter the details here"
                onChange={handleInputChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>}
              />
            </div>

            <div>
              <Label htmlFor="attachments" className="mb-1">Supporting Documents:</Label>
              <FileInput
                id="attachments"
                multiple={true}
                onChange={(files) => {
                  console.log("Files selected:", files);
                  setFileArray(Array.from(files));
                }}
                onRemove={() => {
                  console.log("Files removed");
                  setFileArray([]);
                  // Handle file removal if needed
                  // setFormData({
                  //     ...formData,
                  //     attachments: []
                  // });
                }}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">Upload relevant documents (PDF, Word, Images)</p>
            </div>
          </div>
        </div>
      </CardContent>

      <Toaster />
    </>,

    <>
      <CardHeader className="mt-2">
        <CardTitle className="text-3xl font-bold font-main justify-self-center">
          INQUIRY SUMMARY
        </CardTitle>
        <CardDescription className="justify-self-center italic">
          Review your submission
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Card className="bg-primary/5 w-5/6 justify-self-center">
          <CardContent className="grid grid-rows-* text-xs gap-1">
            <div className="grid grid-cols-3">
              <div className="col-span-1">
                <p className="font-bold">Main Concern:</p>
              </div>
              <div className="col-span-2">
                <p>{formData.concern}</p>
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="col-span-1">
                <p className="font-bold">Specific Concern:</p>
              </div>
              <div className="col-span-2">
                <p>{formData.subconcern}</p>
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="col-span-1">
                <p className="font-bold">Concern Details:</p>
              </div>
              <div className="col-span-2">
                <p>{formData.details}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </>,

    <>
      <CardHeader className="mt-2">
        <CardTitle className="text-3xl font-bold font-main justify-self-center">
          INQUIRY SUBMITTED
        </CardTitle>
        <CardDescription className="justify-self-center italic">
          Take note of your Reference Number
        </CardDescription>
      </CardHeader>
      <CardContent className="font-sub">
        <Card className="bg-primary/5 w-5/6 justify-self-center my-5">
          <CardContent className="grid grid-rows-* gap-2">
            <p className="text-center text-md">
              An email confirmation will be sent to you. Check your inbox for
              updates.
            </p>
            <hr className="my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
            <p className="text-center text-xl text-bold">
              <b>REFERENCE NUMBER</b>
            </p>
            { waitingSubmission ? 
              <Skeleton className="w-full h-10" />
              : 
              <p className="text-center text-md text-bold">
                {submittedTicket?.reference_number || "N/A"}
              </p>
            }
          </CardContent>
        </Card>
      </CardContent>
    </>,
  ];

  return (
    <PageLayout navbar={<NavBar navBarLink="/inbox" navBarLinkName="Inbox" />}>
      <div className="w-full my-auto font-sub">
        <div className="justify-self-center grid grid-cols-8 w-1/2 mb-5">
          <Progress
            value={currentStep === 0 ? 33 : currentStep === 1 ? 66 : 100}
            className="col-span-7 my-auto"
          />
          <p className="content-center text-center col-span-1">
            {currentStep + 1} of {sections.length}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="w-1/2 justify-self-center shadow-md">
            {sections[currentStep]}

            <CardFooter>
              <div className="grid grid-cols-5 w-4/5 mx-auto mb-5">
                {currentStep === 0 ? (
                  <Button className="col-start-1 cursor-pointer" type="button">
                    CANCEL
                  </Button>
                ) : currentStep === 1 ? (
                  <Button
                    className="col-start-1 w-3/4 cursor-pointer"
                    type="button"
                    onClick={prevStep}
                  >
                    PREV
                  </Button>
                ) : (
                  <div className="col-start-1 w-3/4">
                    <Link href="/inquirer/inbox">
                      <Button className=" cursor-pointer" type="button">
                        GO TO INBOX
                      </Button>
                    </Link>
                  </div>
                )}

                {currentStep < sections.length - 1 ? (
                  currentStep === 1 ? (
                    <Button
                      className="col-start-5 cursor-pointer"
                      type="submit"
                    >
                      SUBMIT
                    </Button>
                  ) : (
                    <Button
                      className="col-start-5 cursor-pointer"
                      type="button"
                      onClick={nextStep}
                      disabled={!isFormComplete}
                    >
                      NEXT
                    </Button>
                  )
                ) : (
                  <div className="col-start-5">
                    <Link href="/inquirer">
                      <Button className="cursor-pointer" type="button">
                        CLOSE
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageLayout>
  );
};

export default InquiryForm;
