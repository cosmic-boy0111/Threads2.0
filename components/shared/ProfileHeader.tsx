import { _IprofileHeader } from '@/lib/interfaces'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


import { OrganizationSwitcher, SignedIn, SignOutButton } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const ProfileHeader = ({
    accountId,
    authUserId,
    name,
    username,
    imgUrl,
    bio,
    type
}: _IprofileHeader) => {
    return (
        <div className=' flex w-full flex-col justify-start' >
            <div className=" flex items-center justify-between">
                <div className=" flex max-sm:w-full max-sm:justify-between items-center gap-3 max-sm:flex-row-reverse">
                    <div className=' relative max-sm:h-16 max-sm:w-16 h-24 w-24 object-cover' >
                        <Image
                            src={imgUrl}
                            alt=' avatar'
                            fill
                            className=' rounded-full object-cover shadow-2xl'
                        />
                    </div>
                    <div className=" flex-1">
                        <h2 className=' text-left text-heading3-bold text-light-1' >{name}</h2>
                        <p className=' text-base-medium text-gray-1' >@{username}</p>
                    </div>
                </div>
                {accountId === authUserId && type !== "Community" && (
                    <Link href='/profile/edit' className=' max-sm:hidden'>
                        <div className='flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2'>
                            <Image
                                src='/assets/edit.svg'
                                alt='logout'
                                width={16}
                                height={16}
                            />

                            <p className='text-light-2 max-sm:hidden'>Edit</p>
                        </div>
                    </Link>
                )}
            </div>
            {/* Todo commuity */}

            <p className={`${(bio === "" || bio === "org bio") && 'hidden'} mt-6 max-w-lg text-base-regular text-light-2`} >{
                bio
            }</p>
            { accountId === authUserId && type !== 'Community' && 
            <div className=' mt-2 md:hidden lg:hidden'>
                <div className=' flex gap-3 mb-2 items-center text-light-1'>
                    <p className=' text-small-regular'> Switch Organization </p>
                    <OrganizationSwitcher
                        appearance={{
                            baseTheme: dark,
                            elements: {
                                organizationSwitcherTrigger: 'py-2'
                            }
                        }}
                        />
                </div>
                <div className=' flex items-center justify-between gap-2'>
                    <Link href='/profile/edit' className=' w-1/2'>
                        <div className='flex w-full items-center justify-center cursor-pointer gap-3 rounded-lg bg-dark-3 px-3 py-2'>
                            <p className='text-light-2 text-small-regular'>Edit profile</p>
                        </div>
                    </Link>
                    <div className='flex w-1/2 items-center justify-center cursor-pointer gap-3 rounded-lg bg-dark-3 px-3 py-2'>
                        <SignedIn>
                            <SignOutButton>
                                <p className='text-light-2 text-small-regular'>Logout</p>
                            </SignOutButton>
                        </SignedIn>
                    </div>
                </div>
            </div>
            }

            
        </div>
    )
}

export default ProfileHeader