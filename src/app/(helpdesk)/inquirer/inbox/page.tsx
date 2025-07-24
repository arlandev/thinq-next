"use client";

import React, { useRef, useEffect, useState } from 'react';

import PageLayout from "@/components/common/page-layout";
import NavBar from "@/components/common/navbar";

import { Button } from "@/components/ui/button";
import { House } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { SendHorizontal } from 'lucide-react';

const InquirerInbox = () => {
    const [text,setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        
        textarea.style.height = '50px';
        
        const scrollHeight = textarea.scrollHeight;
        
        textarea.style.height = `${Math.min(Math.max(scrollHeight, 50), 80)}px`;
      }, [text]);

    const remainingChars = 250 - text.length;
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        if (newText.length <= 250) {
            setText(newText);
        }
    };
    
    return (
        <>
            <PageLayout navbar={<NavBar navBarLink="/inbox" navBarLinkName="Inbox" />}>
                <div className="grid grid-rows-* gap-3 my-auto">
                    <div>
                        <Button className="cursor-pointer"><House />Home</Button>
                    </div>
                    <div className="grid grid-cols-12 h-130 gap-3">
                        <Card className="col-span-3 bg-zinc-200 py-4 rounded-md shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl">Inbox</CardTitle>
                                <hr className="h-px bg-zinc-300 border-0 rounded-sm"/>
                            </CardHeader>
                            <CardContent>

                            </CardContent>
                        </Card>
                        <Card className="col-span-9 bg-zinc-200 py-4 flex rounded-md shadow-lg">
                            <CardHeader className="grow">
                                <Card className="py-3 rounded-md">
                                    <CardContent className="grid grid-cols-2 place-content-center">
                                        <div className="grid grid-rows-*">
                                            <h1 className="content-center text-md text-zinc-600"><b>Ticket Number: 12345 <span className="opacity-75 text-xs">(2 days ago)</span></b></h1>
                                            <p className="text-xs text-zinc-500 italic"><b>Status: </b>NEW</p>
                                        </div>
                                        <div className="text-end content-center"><Button className="cursor-pointer">CLOSE TICKET</Button></div>
                                    </CardContent>
                                </Card>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 grid-rows-* gap-5">
                                <div className="sender col-start-1 row-start-1 bg-white rounded-md px-3 py-2 w-min text-sm">hello</div>
                                <div className="sender col-start-2 row-start-2 bg-blue-600 text-white rounded-md px-3 py-2 w-min justify-self-end text-sm">hello</div>
                            </CardContent>
                            <CardFooter className="grid grid-rows-* gap-1">
                                <div className="flex gap-3 w-full">
                                    <div className="grow">
                                        <Textarea maxLength={250} ref={textareaRef} value= {text} onChange={handleChange} className="flex min-h-[50px] max-h-[80px] resize-none overflow-auto border border-primary/20 shadow-md" placeholder="Type your message here"></Textarea>
                                    </div>
                                    <div className="justify-self-center content-center">
                                        {remainingChars===250 ? 
                                            (
                                                <button className="opacity-50" disabled><SendHorizontal/></button>
                                            ) : (
                                                <button className="cursor-pointer hover:text-blue-600"><SendHorizontal/></button>
                                            )
                                        }
                                    </div>
                                </div>
                                <p className={remainingChars<=10 ? "text-red-500 text-xs mt-2 opacity-75" : "text-xs mt-1 opacity-75"}>{remainingChars}/250 characters remaining</p>

                            </CardFooter>
                        </Card>
                    </div>

                </div>
            </PageLayout>
        </>
    )
}

export default InquirerInbox;