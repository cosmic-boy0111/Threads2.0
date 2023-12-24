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

const PostThread = ({
    author,
    threadId,
    reference
}: {
    author: any,
    threadId?: string,
    reference?:any
}) => {

    let isComment = true;
    const router = useRouter();
    const pathname = usePathname();
    const { organization } = useOrganization();
    const { startUpload } = useUploadThing("thread");
    const textAreaRef = useRef<any>(null)
    const containerRef = useRef<any>(null);
    const [tempThread, setTempThread] = useState<string>('')
    // const [author, setAuthor] = useState<any>({})
    const [url, setUrl] = useState<string>('')

    useEffect(() => {
        textAreaRef.current.scrollIntoView();
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
        url: string,
        type: string
    }[]>([]);
    const [files, setFiles] = useState<File[]>([])

    const uploadMultipleFiles = (e: ChangeEvent<HTMLInputElement>) => {
        multipleFileObj.push(e.target.files);
        if (e.target.files) {
            console.log(Array.from(e.target.files).slice(0, 10));
            setFiles(Array.from(e.target.files).slice(0, 10));
        }
        for (let i = 0; i < multipleFileObj[0].length; i++) {
            if (i >= 10) break;
            multipleFileArray.push({
                url: URL.createObjectURL(multipleFileObj[0][i]),
                type: multipleFileObj[0][i].type
            });
        }
        console.log(multipleFileArray);
        setMultipleFile(multipleFileArray);
        e.target.value = "";
    };

    const handleThread = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault();
        setTempThread(e.target.value)
        fieldChange(e.target.value)
        e.target.value = '';
    }

    const resizeTextArea = () => {
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    };

    const scrollToBottom = () => {
        const container = reference ? reference.current : containerRef.current;
        if (container && multipleFile.length === 0) {
          container.scrollTop = container.scrollHeight;
        }
    };

    useEffect(resizeTextArea, [tempThread]);
    useEffect(scrollToBottom, [tempThread]);

    const handleReset = () => {
        form.resetField('thread')
        setMultipleFile([])
        setFiles([]);
        setTempThread('')
    }

    const removeFile = (index: number) => {
        setMultipleFile([
            ...multipleFile.slice(0, index),
            ...multipleFile.slice(index + 1, multipleFile.length)
        ]);
        setFiles([
            ...files.slice(0, index),
            ...files.slice(index + 1, files.length)
        ]);
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();
        console.log("under submit", files);
        const uploadFileArray: {
            url: string,
            type: string
        }[] = []
        if (files.length > 0) {
            const attachedFiles = await startUpload(files)
            console.log(attachedFiles);

            if (attachedFiles) {
                for (let i = 0; i < attachedFiles.length; i++) {
                    uploadFileArray.push({
                        url: attachedFiles[i].url,
                        type: multipleFile[i].type
                    })
                }
            }
        }
        console.log(uploadFileArray);

        if (threadId) {
            await Api._thread._addCommentToThread({
                threadId: threadId,
                commentText: tempThread,
                userId: author._id,
                // add files inside this api and modify the server side
                files: uploadFileArray,
                path: pathname,
            })

            handleReset();
        } else {
            await Api._thread._createThread({
                text: tempThread,
                author: author._id,
                communityId: organization ? organization.id : null,
                files: uploadFileArray,
                path: pathname
            })

            router.push('/');
        }


    }



    return (
        <article className={`flex w-full flex-col rounded-xl md:bg-dark-2 md:p-7 sm:bg-none sm:p-0 sm:mt-0 md:mt-10 lg:mt-10`} >
            <div ref={containerRef} className={` flex items-start justify-between ${!reference && ' max-sm:max-h-[86vh] max-sm:overflow-y-scroll'}`}>
                <div className=" flex w-full flex-1 flex-row gap-4">

                    <div className=" flex flex-col items-center">
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
                    <div className=' flex w-full flex-col' >
                        <div className=" flex justify-between">

                            <Link href={`/profile/${author.id}`} className=' w-fit' >
                                <h4 className=' cursor-pointer text-base-semibold text-light-1' >{author.name}</h4>
                            </Link>
                            <div className="md:hidden flex items-center">
                                <div className={` text-gray-1 cursor-pointer ${tempThread.length > 0 || multipleFile.length > 0 ? 'visible' : 'hidden'}`} onClick={handleReset}><X size={17} /></div>

                            </div>
                        </div>
                        <Form {...form}>
                            <form
                                // onSubmit={form.handleSubmit(onSubmit)}
                                className="mt-1 flex flex-col justify-start gap-1"
                            >
                                <FormField
                                    control={form.control}
                                    name="thread"
                                    render={({ field }) => (
                                        <FormItem className=' flex flex-col gap-2 w-full' >
                                            <FormControl className=' no-focus bg-transparent border-none text-small-regular text-light-2' >
                                                <textarea
                                                    ref={textAreaRef}
                                                    autoFocus
                                                    value={field.value}
                                                    onChange={(e: any) => handleThread(e, field.onChange)}
                                                    rows={1}
                                                    className=" border-none outline-none resize-none overflow-y-hidden"
                                                    placeholder={`${threadId ? 'Reply' : 'Start'} a thread...`}
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
                                            <label htmlFor="icon-button-file" className={` text-gray-1 cursor-pointer ${multipleFile.length !== 0 ? 'hidden' : 'visible'} `}>
                                                <Camera strokeWidth={'1.25'} size={24} />
                                            </label>
                                        </div>
                                    }
                                    <div className=" flex w-full justify-end items-center z-10">

                                        {/* This div is for medium and larger devices */}
                                        <div className="hidden md:flex md:mr-4 md:items-center md:gap-4">
                                            <div className=" text-gray-1 cursor-pointer" onClick={handleReset}><X size={17} /></div>
                                            <Button type="submit" onClick={onSubmit} className="bg-primary-500" disabled={tempThread.length === 0 && multipleFile.length === 0}>
                                                Post
                                            </Button>
                                        </div>

                                        {/* This div is for small devices */}

                                    </div>
                                </div>
                                <div className="md:hidden fixed bottom-3 right-3 flex items-center gap-4">
                                    {/* <div className=" text-gray-1 cursor-pointer" onClick={handleReset}><X size={17} /></div> */}
                                    <Button type="submit" onClick={onSubmit} className=" bg-primary-500" disabled={tempThread.length === 0 && multipleFile.length === 0}>
                                        Post
                                    </Button>
                                </div>
                                <ThreadFilesViewer Files={multipleFile} action={removeFile} />
                            </form>
                        </Form>
                    </div>
                </div>
                {/* here */}
                {/* <div className="md:hidden flex items-center">
                        <div className={` text-gray-1 cursor-pointer ${tempThread.length >= 3 ? 'visible' : 'hidden'}`} onClick={handleReset}><X size={17} /></div>
                    
                </div> */}
            </div>

        </article>
    )
}

export default PostThread