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
import { Camera } from 'lucide-react';

import { currentUser, useOrganization } from "@clerk/nextjs";


import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

const PostThread = ({currentUser} : {currentUser : any}) => {

    let isComment = true;
    const router = useRouter();

    const [user, setUser] = useState<any>({})
    const [author, setAuthor] = useState<any>({})
    const [url, setUrl] = useState('')
    

    
    useEffect(() => {
        const getUser = async () => {
            if(!currentUser) router.back();
            setUser(currentUser)

            const authorFetch = await Api._user._fetchUser(currentUser?.id);
            if(!authorFetch.onboarded) redirect('/onboarding');

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

    const handleImage = (e : ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
    
        const fileReader = new FileReader();
        
        if(e.target.files && e.target.files.length > 0){
          const file = e.target.files[0];
        //   setFiles(Array.from(e.target.files));
          if(!file.type.includes('image')) return;
          fileReader.onload = async (event) => {
            const imageDataUrl = event.target?.result?.toString() || "";
            // console.log(imageDataUrl);   
            setUrl(imageDataUrl)         
          }
          fileReader.readAsDataURL(file)
        }
    }

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        
    }

    return (
        <article className={`flex w-full flex-col rounded-xl md:bg-dark-2 md:p-7 sm:bg-none sm:p-0 mt-7`  } >
            <div className=" flex items-start justify-between">
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
                        <Link href={`/profile/${author.id}`} className=' w-fit' >
                            <h4 className=' cursor-pointer text-base-semibold text-light-1' >{author.name}</h4>
                        </Link>
                        
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="mt-3 flex flex-col justify-start gap-2"
                            >
                                <FormField
                                    control={form.control}
                                    name="thread"
                                    render={({ field }) => (
                                        <FormItem className=' flex flex-col gap-2 w-full' >
                                            <FormControl className=' no-focus bg-transparent border-none text-light-1' >
                                                <Textarea
                                                    rows={3}
                                                    className="p-0 resize-none"
                                                    placeholder="Start a thread..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className=" flex justify-between items-center mb-3 flex-wrap gap-1">
                                    <div>
                                        <input accept="image/*" className=' hidden' id="icon-button-file" type="file" onChange={(e) => handleImage(e)} />
                                        <label htmlFor="icon-button-file" className=" text-gray-1 cursor-pointer">
                                            <Camera />
                                        </label>
                                    </div>
                                    <div className=" flex w-full justify-end items-center">

                                        <Button type="submit" className=" bg-primary-500 justify-self-end" >
                                            Post
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                        <div className='w-full'>

                            <img src={url} alt="" className=" rounded-xl w-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default PostThread