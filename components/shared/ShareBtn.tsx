'use client'
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { RWebShare } from "react-web-share";

const ShareBtn = ({ id }: {
    id: string
}) => {


    return (
        <div>
            <RWebShare
                data={{
                    text: "Check out this thread",
                    url: `${window.location.origin}/thread/${id}`,
                    title: "Thread",
                }}
                onClick={() => console.log("shared successfully!")}
            >

                <Image src={'/assets/share.svg'}
                    alt='share'
                    width={24}
                    height={24}
                    className=' cursor-pointer object-contain'
                />
            </RWebShare>
        </div>
    )
}

export default ShareBtn