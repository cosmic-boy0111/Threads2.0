'use client'
import { Api } from '@/lib/api'
import { Repeat, Repeat1 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

interface Props {
    isReposted : boolean,
    currentUserId : string,
    authorId : string,
    parentId : string | null,
    referenceThread : string,
    repostThreadId : string | null | undefined,
}

const RepostThread = ({
    isReposted,
    currentUserId,
    authorId,
    parentId,
    referenceThread,
    repostThreadId
} : Props) => {

    const pathname = usePathname();
    // const [check, setCheck] = useState<boolean>(isReposted)

    const addRepost = async () => {

        if(currentUserId === authorId) return;
        console.log('under add repost');

        try {

            const repost = await Api._thread._repostThread({
                parentId : parentId,
                repostedBy : currentUserId,
                referenceThread : referenceThread,
                author : authorId,
                path : pathname
            })

        } catch (error) {
            console.log(error);
            
        }
    }
    
    const removeRepost = async () => {
        console.log('under remove repost');
        if(currentUserId === authorId) return;
        console.log(referenceThread, currentUserId, repostThreadId);
        try {
            await Api._thread._removeRepostThread({
                parentId : parentId,
                currentUserId : currentUserId,
                mainThreadId : referenceThread,
                repostThreadId : repostThreadId,
                path : pathname
            })
        } catch (error) {
            console.log(error);
        }
        // setCheck(false)
    }


    return (
        <div onClick={() => isReposted ? removeRepost() : addRepost()}>
            {isReposted ?
                <Repeat1 size={24} strokeWidth={'1.25'} className='text-light-4' /> :
                <Repeat size={24} strokeWidth={'1.25'} className='text-light-4' />
            }
        </div>
    )
}

export default RepostThread