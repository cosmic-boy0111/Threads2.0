'use client'

import { MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import Option from "../shared/Option"
import DeleteThread from "../forms/DeleteThread"

interface Props {
    threadId: string;
    currentUserId: string;
    authorId: string;
    parentId: string | null;
    isComment?: boolean;
  }
  

const ThreadDrawer = ({
    threadId,
    currentUserId,
    authorId,
    parentId,
    isComment,
  }: Props) => {
    const [open, setOpen] = useState<boolean>(false)
    useEffect(() => {
        console.log('inside');

        const handleBackButton = (event: PopStateEvent) => {
            console.log('inside back button of browser');
            document.documentElement.style.overflow = 'auto';
            setOpen(false);
        };

        window.addEventListener('popstate', handleBackButton);


        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };

    }, [open])

    const handleOpen = () => {
        setOpen(true);
        document.documentElement.style.overflow = 'hidden';
        window.history.pushState({ popupOpen: true }, '');
    }

    const handleClose = () => {
        setOpen(false);
        document.documentElement.style.overflow = 'auto';
        window.history.back();
    };

    return (
        <div className=" md:hidden lg:hidden">
            <MoreHorizontal onClick={handleOpen} size={21} strokeWidth={'1.25'} className='text-light-4' />
            {
                open &&
                <>
                    <div onClick={handleClose} className=" text-light-1 fixed w-[100%] left-0 z-50 bottom-0 -top-1 h-[100vh] bg-glassmorphism flex flex-col justify-end">
                    </div>
                    <div className=" text-light-1 rounded-lg fixed left-0 w-[100%] z-50 -bottom-1 bg-dark-2 p-4 py-5 pt-7 flex flex-col gap-3">
                        <Option displayName='Edit' className=' text-light-1 bg-dark-4 justify-start  hover:bg-dark-3' />
                        <DeleteThread
                            threadId={threadId}
                            currentUserId={currentUserId}
                            authorId={authorId}
                            parentId={parentId}
                            isComment={isComment}
                            closeFunction={handleClose}
                        />
                    </div>
                </>
            }
        </div>
    )
}

export default ThreadDrawer