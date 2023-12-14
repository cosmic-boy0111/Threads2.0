'use client'

import { Api } from "@/lib/api"
import Image from "next/image"
import { usePathname } from "next/navigation"

interface Props {
    isLike : boolean,
    userId: string,
    threadId: string
}

const LikeThread = ({
    isLike,
    userId,
    threadId,
} : Props ) => {

    const pathname = usePathname();

    const likeThread = async () => {
        try {
            
            Api._thread._likeThread({
                userId : userId,
                threadId : threadId,
                path : pathname
            })

        } catch (error : any) {
            console.log(error.message);
        }
    }

    const removeLikeThread = async () => {
        try {
            
            Api._thread._removeLikeThread({
                userId : userId,
                threadId : threadId,
                path : pathname
            })

        } catch (error : any) {
            console.log(error.message);
        }
    }

    return (
        <Image src={`/assets/heart-${ isLike ? 'filled' : 'gray'}.svg`}
            onClick={ () => isLike ? removeLikeThread() : likeThread() }
            alt=' heartbeat'
            width={24}
            height={24}
            className=' cursor-pointer object-contain'
        />
    )
}

export default LikeThread