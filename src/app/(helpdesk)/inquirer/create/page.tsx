"use client";

import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";

import NavBar from "@/components/common/navbar";
import PageLayout from "@/components/common/page-layout";

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

const concerns = [
  { concernValue: "concern1", label: "Concern 1" },
  { concernValue: "concern2", label: "Concern 2" },
  { concernValue: "concern3", label: "Concern 3" },
  { concernValue: "concern4", label: "Concern 4" },
];

const InquiryForm = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const [openConcerns, setOpenConcerns] = useState(false);
  const [concernValue, setConcernValue] = useState("");

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

  const isFormComplete =
    formData.concern.trim() !== "" &&
    formData.subconcern.trim() !== "" &&
    formData.details.trim() !== "";

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
    // Ensure we prevent any default form submission
    if (e) e.preventDefault();

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    setCurrentStep(currentStep + 1);

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
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openConcerns}
                    className="w-64 justify-between"
                  >
                    {concernValue
                      ? concerns.find(
                          (concern) => concern.concernValue === concernValue,
                        )?.label
                      : "Select concern..."}
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
                            key={concern.concernValue}
                            value={concern.concernValue}
                            onSelect={(currentValue) => {
                              setConcernValue(
                                currentValue === concernValue
                                  ? ""
                                  : currentValue,
                              );
                              setFormData({
                                ...formData,
                                concern: currentValue,
                              });
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
                            {concern.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="subconcern" className="mb-1">
                Specific Concern
              </Label>
              <Input
                id="subconcern"
                name="subconcern"
                value={formData.subconcern}
                onChange={handleInputChange}
                placeholder="What's the specific issue?"
              />
            </div>

            <div>
              <Label htmlFor="details" className="mb-1">
                Concern:
              </Label>
              <Textarea
                id="details"
                name="details"
                value={formData.details}
                placeholder="Enter the details here"
                onChange={handleInputChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>}
              />
            </div>

            <div>
              <Label htmlFor="attachments" className="mb-1">
                Supporting Documents:
              </Label>
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
              <p className="text-xs text-muted-foreground mt-1">
                Upload relevant documents (PDF, Word, Images)
              </p>
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
            <p className="text-center text-md text-bold">12345</p>
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
                  <Button
                    className="col-start-1 col-span-2 w-3/4 cursor-pointer"
                    type="button"
                  >
                    GO TO INBOX
                  </Button>
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
                  <Button className="col-start-5 cursor-pointer" type="button">
                    CLOSE
                  </Button>
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
