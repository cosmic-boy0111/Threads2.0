import { Api } from '@/lib/api'
import { _IthreadCard, _IthreadsTabs } from '@/lib/interfaces'
import { redirect } from 'next/navigation';
import React from 'react'
import ThreadCard from '../cards/ThreadCard';

const ThreadsTab = async ({
    currentUserId,
    accountId,
    accountType
}: _IthreadsTabs) => {

    // Todo : fetch profile threads 

    const result = await Api._user._fetchUserPosts(accountId);
    if(!result) redirect('/')

    return (
        <section className=' mt-9 flex flex-col gap-10' >
            {result.threads.map((thread : any) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                        accountType === "User" 
                            ? {name : result.name,image : result.image,id : result.id} 
                            : {name : thread.author.name,image : thread.author.image,id : thread.author.id}
                    } // todo
                    community={thread.community} // todo
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    )
}

export default ThreadsTab