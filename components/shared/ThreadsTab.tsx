import { Api } from '@/lib/api'
import { _IthreadCard, _IthreadsTabs } from '@/lib/interfaces'
import { redirect } from 'next/navigation';
import React from 'react'
import ThreadCard from '../cards/ThreadCard';
import { currentUser } from '@clerk/nextjs';
import RepostThreadCard from '../cards/RepostThreadCard';

const ThreadsTab = async ({
    currentUserId,
    accountId,
    accountType
}: _IthreadsTabs) => {

    // Todo : fetch profile threads 

    const user = await currentUser();
    if(!user) return null;

    const userInfo = await Api._user._fetchUser(user?.id);
    if(!userInfo?.onboarded) redirect('/onboarding');

    let result : any;
    if(accountType === 'Community') {
        result = await Api._community._fetchCommunityPosts(accountId);
    } else if(accountType === 'Replies'){
        result = await Api._user._getReplies(accountId)
        console.log(result);
    }else if(accountType === 'User' ){
        result = await Api._user._fetchUserPosts(accountId);
        console.log(result);
    }else if(accountType === 'Reposts'){
        result = await Api._user._getReposts(accountId);
        console.log(result);
    }
    if(!result) redirect('/')

    return (
        <section className=' mt-9 flex flex-col sm:gap-1 md:gap-10' >
            {result.threads.map((thread : any) => (
                thread.repostedBy ?
                <RepostThreadCard
                  repostId={thread._id}
                  referenceThread={thread.referenceThread}
                  currentUserId={user?.id || ""}
                  userSecondId={userInfo._id}
                  repostedBy={thread.repostedBy}
                  isComment={false}
                  showUser={true}
                />
                :
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                        accountType === "User" 
                            ? {name : result.name, username : result.username ,image : result.image,id : result.id} 
                            : {name : thread.author.name, username : thread.author.username ,image : thread.author.image,id : thread.author.id}
                    } // todo
                    files={thread.files || []}
                    community={
                        accountType === "Community"
                          ? { name: result.name, id: result.id, image: result.image }
                          : thread.community
                    }
                    createdAt={thread.createdAt}
                    comments={thread.children}
                    isReposted={false}
                    isLike={thread.likes ? thread.likes.includes(userInfo._id) : false}
                    likesCount={thread.likes ? thread.likes.length : 0}
                    userSecondId={userInfo._id}
                    authorId={thread.author._id}
                    repostedBy={thread.repostedBy}
                />
            ))}
        </section>
    )
}

export default ThreadsTab