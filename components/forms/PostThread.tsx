'use client'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod';
import Image from 'next/image'
import { redirect, usePathname, useRouter } from 'next/navigation'
import { Api } from '@/lib/api'
import { ThreadValidation } from "@/lib/validations/thread";
import { Camera, X } from 'lucide-react';

import { useOrganization } from "@clerk/nextjs";


import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import ThreadFilesViewer from "../shared/ThreadFilesViewer";

const PostThread = ({ currentUser }: { currentUser: any }) => {

    let isComment = true;
    const router = useRouter();
    const pathname = usePathname();
    const {organization} = useOrganization();
    const { startUpload } = useUploadThing("thread");
    const textAreaRef = useRef<any>(null)
    const [tempThread, setTempThread] = useState<string>('')
    const [user, setUser] = useState<any>({})
    const [author, setAuthor] = useState<any>({})
    const [url, setUrl] = useState<string>('')

    useEffect(() => {
        const getUser = async () => {
            if (!currentUser) router.back();
            setUser(currentUser)

            const authorFetch = await Api._user._fetchUser(currentUser?.id);
            if (!authorFetch.onboarded) redirect('/onboarding');

            setAuthor(authorFetch)

        }

        getUser();
    }, [])



    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            accountId: author._id
        }
    });

    var multipleFileObj: any = [];
    var multipleFileArray: any = [];

    const [multipleFile, setMultipleFile] = useState<{
        url : string,
        type : string
    }[]>([]);
    const [files, setFiles] = useState<File[]>([])

    const uploadMultipleFiles = (e: ChangeEvent<HTMLInputElement>) => {
        multipleFileObj.push(e.target.files);
        if(e.target.files) {
            console.log(Array.from(e.target.files).slice(0,10));
            setFiles(Array.from(e.target.files).slice(0,10));
        }
        for (let i = 0; i < multipleFileObj[0].length; i++) {
            if(i >= 10) break;
            multipleFileArray.push({
                url : URL.createObjectURL(multipleFileObj[0][i]),
                type : multipleFileObj[0][i].type
            });
        }
        console.log(multipleFileArray);
        setMultipleFile(multipleFileArray);
    };

    const handleThread = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault();
        setTempThread(e.target.value)
        fieldChange(e.target.value)
    }

    const resizeTextArea = () => {
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    };

    useEffect(resizeTextArea, [tempThread]);

    const handleReset = () => {
        form.resetField('thread')
        setMultipleFile([])
        setFiles([]);
        setTempThread('')
    }

    const removeFile = (index : number) => {
        setMultipleFile([
          ...multipleFile.slice(0, index),
          ...multipleFile.slice(index + 1, multipleFile.length)
        ]);
        setFiles([
            ...files.slice(0, index),
            ...files.slice(index + 1, files.length)
        ]);
    };

    const onSubmit = async (e : any) => {
        e.preventDefault();
        console.log("under submit",files);
        const uploadFileArray : {
            url : string,
            type : string
        }[] = []
        if(files.length > 0){
            const attachedFiles = await startUpload(files)
            console.log(attachedFiles);
            
            if(attachedFiles){
                for(let i = 0; i < attachedFiles.length; i++){
                    uploadFileArray.push({
                        url : attachedFiles[i].url,
                        type : multipleFile[i].type
                    })
                }
            }
        }
        console.log(uploadFileArray);

        await Api._thread._createThread({
            text : tempThread,
            author : author._id,
            communityId : organization ? organization.id : null,
            files : uploadFileArray,
            path : pathname
        })

        router.push('/')
        
    }



    return (
        <article className={`flex w-full flex-col rounded-xl md:bg-dark-2 md:p-7 sm:bg-none sm:p-0 sm:mt-2 md:mt-7`} >
            <div className=" flex items-start justify-between">
                <div className=" flex w-full flex-1 flex-row gap-4">
                    <div className=" flex flex-col items-center" style={{ width: '10%' }}>
                        <Link href={`/profile/${author.id}`} className=' relative h-9 w-9' >
                            <Image
                                src={author.image}
                                alt="Profile Image"
                                fill
                                className=' cursor-pointer rounded-full'
                            />
                        </Link>
                        <div className=' thread-card_bar' />
                    </div>
                    <div className=' flex w-full flex-col' style={{ width: '90%' }}>
                        <Link href={`/profile/${author.id}`} className=' w-fit' >
                            <h4 className=' cursor-pointer text-base-semibold text-light-1' >{author.name}</h4>
                        </Link>

                        <Form {...form}>
                            <form
                                // onSubmit={form.handleSubmit(onSubmit)}
                                className="mt-3 flex flex-col justify-start gap-2"
                            >
                                <FormField
                                    control={form.control}
                                    name="thread"
                                    render={({ field }) => (
                                        <FormItem className=' flex flex-col gap-2 w-full' >
                                            <FormControl className=' no-focus bg-transparent border-none text-light-1' >
                                                <textarea
                                                    ref={textAreaRef}
                                                    value={field.value}
                                                    onChange={(e: any) => handleThread(e, field.onChange)}
                                                    rows={1}
                                                    className=" border-none outline-none resize-none"
                                                    placeholder="Start a thread..."
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className=" flex justify-between items-center md:mb-3 sm:mb-0 flex-wrap gap-1">
                                    {multipleFile.length === 0 &&
                                        <div className=" mt-2">
                                            <input accept="image/*" multiple className=' hidden' id="icon-button-file" type="file" onChange={uploadMultipleFiles} />
                                            <label htmlFor="icon-button-file" className=" text-gray-1 cursor-pointer">
                                                <Camera />
                                            </label>
                                        </div>
                                    }
                                    <div className=" flex w-full justify-end items-center">

                                        {/* This div is for medium and larger devices */}
                                        <div className="hidden md:flex md:mr-4 md:items-center md:gap-4">
                                            <div className=" text-gray-1 cursor-pointer" onClick={handleReset}><X size={17} /></div>
                                            <Button type="submit" onClick={onSubmit} className="bg-primary-500" disabled={tempThread.length < 3}>
                                                Post
                                            </Button>
                                        </div>

                                        {/* This div is for small devices */}
                                        <div className="md:hidden fixed bottom-5 right-5 flex items-center gap-4">
                                            <div className=" text-gray-1 cursor-pointer" onClick={handleReset}><X size={17} /></div>
                                            <Button type="submit" onClick={onSubmit} className=" bg-primary-500" disabled={tempThread.length < 3}>
                                                Post
                                            </Button>
                                        </div>

                                    </div>
                                </div>
                                <ThreadFilesViewer Files={multipleFile} action={removeFile} />
                            </form>
                        </Form>

                    </div>
                </div>
            </div>
        </article>
    )
}

export default PostThread