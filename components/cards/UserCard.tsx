'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

interface Props {
    id: string,
    name: string,
    username: string,
    imgUrl: string,
    personType: string
}

const UserCard = ({
    id,
    name,
    username,
    imgUrl,
    personType
}: Props) => {

    const router = useRouter();

    return (
        <>
        <article className='user-card'>
            <div className='user-card_avatar'>
                <div className='relative h-12 w-12 max-sm:h-10 max-sm:w-10'>
                    <Image
                        src={imgUrl}
                        alt='community_logo'
                        fill
                        className='rounded-full object-cover'
                        />
                </div>
                <div className=' flex-1 text-ellipsis'>
                    <h4 className=' text-base-semibold text-light-1'>{name}</h4>
                    <p className=' text-small-medium text-gray-1'>@{username}</p>
                </div>
            </div>
            
            <Button className='user-card_btn' onClick={() => router.push(`${personType === 'User' ? '/profile' : '/communities'}/${id}`)}>
                View
            </Button>
        </article>
        <div className=' invisible max-sm:visible'>

            <div className=' flex py-3 '>
                <div className='w-12 max-sm:w-10' />
                <div className=' thread-card_bar m-0 h-[1px] bg-dark-2' />
            </div>
        </div>
        </>
    )
}

export default UserCard