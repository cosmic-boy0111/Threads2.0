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
    referenceThread : string
}

const RepostThread = ({
    isReposted,
    currentUserId,
    authorId,
    parentId,
    referenceThread
} : Props) => {

    const pathname = usePathname();
    const [check, setCheck] = useState<boolean>(isReposted)

    const addRepost = async () => {
        // console.log(isReposted,
        //     currentUserId,
        //     authorId,
        //     parentId,
        //     referenceThread);

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
            
            setCheck(true)

        } catch (error) {
            console.log(error);
            
        }
    }
    
    const removeRepost = async () => {
        console.log('under remove repost');
        setCheck(false)
    }


    return (
        <div onClick={() => check ? removeRepost() : addRepost()}>
            {check ?
                <Repeat1 size={24} strokeWidth={'1.25'} className='text-light-4' /> :
                <Repeat size={24} strokeWidth={'1.25'} className='text-light-4' />
            }
        </div>
    )
}

export default RepostThread