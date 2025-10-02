'use client'

import { useEffect, useState } from "react"
import PageLayout from "@/components/common/page-layout"
import NavBar from "@/components/common/navbar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { toast } from "sonner"
import { AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger, } from "@/components/ui/alert-dialog"

import { readConcerns } from "@/app/actions/readConcerns"
import { supabase } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"

import { X, Check, Upload, Pencil, CircleX } from "lucide-react"
import UploadButton from "@/components/common/file-upload"


interface Concern {
    concern_id: number;
    concern_title: string;
    applicable_to: string;
  }

export default function AdminFAQsPage() {
    const [concerns, setConcerns] = useState<Concern[]>([])
    const [faqMap, setFaqMap] = useState<Record<string, boolean>>({})
    const [files, setFiles] = useState<{ [key: string]: File | null }>({})
    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({})

    //upload FAQ
    const handleFileChange = (concern: string, file: File | null) => {
        setFiles(prev => ({ ...prev, [concern]: file }))
    }

    const handleDelete = async (concern: string) => {
        const { error } = await supabase.storage
          .from("faqs")
          .remove([`${concern}.pdf`])
        if (error) {
          console.error(error)
          toast.error("Delete failed")
        } else {
          setFaqMap(prev => ({ ...prev, [concern]: false }))
          toast.success(`FAQ for ${concern} deleted successfully!`)
        }
    }

    const handleUpload = async (concern: string, file:File) => {
        // const file = files[concern]
        if (!file) return alert("No file chosen")
    
        setUploading(prev => ({ ...prev, [concern]: true }))
    
        const { error } = await supabase.storage
          .from("faqs")
          .upload(`${concern}.pdf`, file, { upsert: true })
    
        if (error) {
          console.error(error)
          alert("Upload failed")
        } else {
          setFaqMap(prev => ({...prev, [concern]: true}))
          setFiles(prev => ({ ...prev, [concern]: null }))
          toast.success(`FAQ for ${concern} uploaded!`)
        }
    
        setUploading(prev => ({ ...prev, [concern]: false }))
    }

    //check if FAQ exists
    async function hasFAQ(concernName: string) {
        const { data, error } = await supabase
          .storage
          .from("faqs")
          .list("", { search: `${concernName}.pdf` })
      
        if (error) return false
        return data && data.length > 0
    }  

    useEffect(() => {
        let isMounted = true;
        
        const fetchConcerns = async () => {
          try {
            const concernsData = await readConcerns();
            if (isMounted) {
              setConcerns(concernsData as unknown as Concern[]);
            }
    
          } catch (error) {
            console.error("Error fetching data:", error);
            if (isMounted) {
              toast.error("Failed to load data");
            }
          }
        };
    
        fetchConcerns();
    
        return () => {
          isMounted = false;
        };
      }, []);

    useEffect(() => {
        let isCancelled = false

        const checkFaqs = async () => {
            if (concerns.length === 0) return
            const results = await Promise.all(
                concerns.map(async (c) => {
                    const { data, error } = await supabase
                        .storage
                        .from("faqs")
                        .list("", { search: `${c.concern_title}.pdf` })
                    const exists = !error && !!data && data.length > 0
                    return [c.concern_title, exists] as const
                })
            )

            if (!isCancelled) {
                const map: Record<string, boolean> = {}
                results.forEach(([title, exists]) => { map[title] = exists })
                setFaqMap(map)
            }
        }

        checkFaqs()
        return () => { isCancelled = true }
    }, [concerns])

    return (
        <PageLayout navbar={<NavBar navBarLink="/admin" navBarLinkName="" />}>
            <div className="grid grid-rows-auto gap-5">
                <div className="row-start-1 col-start-2">
                    <Link href="/admin"><Button variant="default" className="">Back</Button></Link>
                </div>

                <div className="concerns-faqs row-start-2 w-3/4 col-start-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><b>Concern</b></TableHead>
                                <TableHead><b>Has FAQs?</b></TableHead>
                                <TableHead><b>Action</b></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {concerns.map(concern => (
                                <TableRow key={concern.concern_id}>
                                    <TableCell>{concern.concern_title}</TableCell>
                                    <TableCell>
                                        {faqMap[concern.concern_title] ? <Check color="#00a80b" /> : <X color="#fa0000" />}
                                    </TableCell>
                                    <TableCell>
                                        {faqMap[concern.concern_title] ? 
                                            <div className="flex flex-items gap-2">
                                                <div className="col-span-2 w-full">
                                                    <UploadButton
                                                        onFileSelect={async (file) => {
                                                            await handleUpload(concern.concern_title,file)
                                                            console.log("Uploaded", file.name)
                                                        }}
                                                        title="Re-Upload"
                                                    />
                                                </div>
                                                <AlertDialog>
                                                    <AlertDialogTrigger title="Delete">
                                                        <div className="cursor-pointer col-span-1 w-min"><CircleX color="#ff0000" className="cursor-pointer"/></div>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the uploaded FAQ.
                                                                <br/><br/><b>Note: </b>You may re-upload the FAQ after deletion.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(concern.concern_title)}>Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div> :
                                            <div className="flex flex-items gap-1">
                                                <div className="w-full">
                                                    <UploadButton
                                                        onFileSelect={async (file) => {
                                                            await handleUpload(concern.concern_title,file)
                                                            console.log("Uploaded", file.name)
                                                        }}
                                                        title="Upload"
                                                    />
                                                </div>
                                                
                                            </div>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </PageLayout>

    );
}