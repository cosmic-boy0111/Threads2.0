import { _IthreadCard } from '@/lib/interfaces'
import { formatDateString } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import DeleteThread from '../forms/DeleteThread'

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import ThreadFilesViewer from '../shared/ThreadFilesViewer'
import ShareBtn from '../shared/ShareBtn'
import { Repeat, Repeat1 } from 'lucide-react'
import RepostThread from '../forms/RepostThread'
import LikeThread from '../forms/LikeThread'
import Menu from '../dialogs/Menu'
import ThreadDrawer from '../dialogs/ThreadDrawer'
import Option from '../shared/Option'

const ThreadCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    files,
    community,
    createdAt,
    comments,
    isComment,
    isReposted,
    isLike,
    likesCount,
    userSecondId,
    authorId,
    repostedBy,
    repostThreadId,
    page
}: _IthreadCard) => {


    return (
        <article className={`flex w-full flex-col rounded-xl ${isComment ? ' px-0 xs:px-7' : 'md:bg-dark-2 md:p-7 sm:bg-none sm:p-0'} `} >
            {repostedBy && userSecondId.toString() !== repostedBy.id.toString() &&
                <div className=" flex w-full flex-1 flex-row gap-4">

                    <div className=" flex flex-col items-end justify-end">
                        <div className=' flex h-7 w-9 justify-end' >
                            <Repeat size={24} strokeWidth={'1.25'} className='text-gray-1' />
                        </div>
                    </div>
                    <div className=' flex w-full flex-col' >
                        <h4 className=' cursor-pointer text-medium-regular text-gray-1' >{userSecondId.toString() === repostedBy.id.toString() ? 'You' : repostedBy.name} reposted</h4>
                    </div>
                </div>
            }
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
                        <div className=" flex justify-between items-center">
                            <Link href={`/profile/${author.id}`} className=' w-fit' >
                                <h4 className=' cursor-pointer text-base-semibold text-light-1' >{author.username}</h4>
                            </Link>
                            <div className=''>

                            {
                                authorId.toString() === userSecondId.toString() && (
                                    <>
                                        <Menu 
                                            threadId={JSON.stringify(id)}
                                            currentUserId={currentUserId}
                                            authorId={author.id}
                                            parentId={parentId}
                                            isComment={isComment}
                                        /> 
                                        <ThreadDrawer 
                                            threadId={JSON.stringify(id)}
                                            currentUserId={currentUserId}
                                            authorId={author.id}
                                            parentId={parentId}
                                            isComment={isComment}
                                        /> 
                                    </>
                                )
                            }
                            </div>
                        </div>
                        <Link href={`/thread/${id}`} >

                        <p className=' mt-1 text-small-regular text-light-2' >
                            {content}
                        </p>
                        </Link>
                        <ThreadFilesViewer Files={files} />
                        <div className={`${isComment && 'mb-10'} ${page === 'reply' && 'max-sm:hidden'} mt-1 flex flex-col gap-0 relative`}>
                            <div className=' flex gap-3.5'>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <LikeThread
                                                isLike={isLike}
                                                userId={userSecondId}
                                                threadId={id}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className=' bg-dark-4 px-2 py-1 border-transparent text-su text-light-3'>
                                            <p>Like</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Link href={`/reply/${id}`}>
                                                <Image src={'/assets/reply.svg'}
                                                    alt='reply'
                                                    width={24}
                                                    height={24}
                                                    className=' cursor-pointer object-contain'
                                                />
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent className=' bg-dark-4 px-2 py-1 border-transparent text-su text-light-3'>
                                            <p>Reply</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <RepostThread
                                                isReposted={isReposted}
                                                currentUserId={userSecondId}
                                                authorId={authorId}
                                                parentId={parentId}
                                                referenceThread={id}
                                                repostThreadId={repostThreadId}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className=' bg-dark-4 px-2 py-1 border-transparent text-su text-light-3'>
                                            <p>Repost</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <ShareBtn id={id} />
                                        </TooltipTrigger>
                                        <TooltipContent className=' bg-dark-4 px-2 py-1 border-transparent text-su text-light-3'>
                                            <p>Share</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                            </div>
                            {/* <div className='flex gap-2'>
                                {isComment && comments.length > 0 && (
                                    <Link href={`/thread/${id}`}>
                                        <p className=' mt-1 text-su text-light-2' >{comments.length} repl{comments.length > 1 ? "ies" : "y"}</p>
                                    </Link>
                                )}
                                {isComment && likesCount > 0 && comments.length > 0 && (
                                        <span className='mt-1 text-su text-light-2 relative bottom-1'>
                                            {comments.length} .
                                        </span>
                                )}

                                {isComment && likesCount > 0 && (
                                    <div>
                                        <p className='mt-1 text-su text-light-2'>
                                            {likesCount} like{likesCount > 1 ? "s" : ""}
                                        </p>
                                    </div>
                                )}

                            </div> */}
                            {!community && isComment && (
                                <div className=' mt-1 flex items-center'>
                                    <p className=' text-small-regular text-gray-1'>
                                        {formatDateString(createdAt)}
                                    </p>
                                </div>
                            )}
                            <div className=' absolute -bottom-8 flex gap-2'>

                                {!isComment && comments.length > 0 && (
                                    <Link href={`/thread/${id}`} >
                                        <p className='mt-1 text-small-regular text-gray-1'>
                                            {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                                        </p>
                                    </Link>
                                )}

                                {!isComment && likesCount > 0 && comments.length > 0 && (
                                        <span className='mt-1 text-small-regular text-gray-1 relative bottom-1'>
                                            .
                                        </span>
                                )}

                                {!isComment && likesCount > 0 && (
                                    <div>
                                        <p className='mt-1 text-small-regular text-gray-1'>
                                            {likesCount} like{likesCount > 1 ? "s" : ""}
                                        </p>
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </div>
                
            </div>
            {!isComment && comments.length > 0 && (
                <div className={`${page === 'reply' && 'max-sm:hidden'} ml-1 mt-3 flex items-center gap-2`}>
                    {comments.slice(0, 2).map((comment, index) => (
                        <Image
                            key={index}
                            src={comment.author.image}
                            alt={`user_${index}`}
                            width={20}
                            height={20}
                            className={`${index !== 0 && "-ml-4"} rounded-full object-cover`}
                        />
                    ))}


                </div>
            )}
            {
                comments.length == 0 && likesCount !==0 && (
                    <div className=' w-20 h-8'>

                    </div>
                )
            }
            <div className=" flex w-full flex-1 flex-row gap-4">

                <div className=" flex flex-col items-end justify-end">
                    <div className=' flex h-2 w-9 justify-end' >
                    </div>
                </div>
                <div className={`${page === 'reply' && 'max-sm:hidden'} flex w-full flex-col`} >
                    {!isComment && community && (
                        <Link href={`/communities/${community.id}`} className=' mt-1 flex items-center'>
                            <p className=' text-small-regular text-gray-1'>
                                {formatDateString(createdAt)}{' '}
                                - {community.name} Community
                            </p>
                            <Image
                                src={community.image}
                                alt={community.name}
                                width={20}
                                height={20}
                                className=' ml-1 rounded-full object-cover'
                            />
                        </Link>
                    )}
                    {!community && !isComment && (
                        <div className=' mt-1 flex items-center'>
                            <p className=' text-small-regular text-gray-1'>
                                {formatDateString(createdAt)}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className={`${page === 'reply' && 'max-sm:hidden'} border-y border-y-dark-2 my-3 md:hidden`} />
        </article>
    )
}

export default ThreadCard