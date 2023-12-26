import RepostThreadCard from "@/components/cards/RepostThreadCard";
import SelectedThread from "@/components/cards/SelectedThread";
import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { Api } from "@/lib/api";
import { currentUser } from "@clerk/nextjs";
import Head from "next/head";
import { redirect } from "next/navigation";
import { useRef } from "react";

const page = async ({ params }: { params: { id: string } }) => {

    if(!params.id) return null;
    const user = await currentUser();
    if(!user) return null;

    const userInfo = await Api._user._fetchUser(user?.id);
    if(!userInfo?.onboarded) redirect('/onboarding');

    const thread = await Api._thread._fetchThreadById(params.id);
    console.log("threads : ", thread);
    if(!thread) return null;
    
    
    return (
        <section className=" relative" >
            <div>
                <SelectedThread
                    key={thread._id}
                    id={thread._id}
                    currentUserId={user?.id || ""}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    files={thread.files || []}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                    isReposted={thread.reposters ? thread.reposters.includes(userInfo._id) : false}
                    isLike={thread.likes ? thread.likes.includes(userInfo._id) : false}
                    likesCount={thread.likes ? thread.likes.length : 0}
                    userSecondId={userInfo._id}
                    authorId={thread.author._id}
                    repostedBy={thread.repostedBy}
                />
            </div>
            {/* <p className=" text-light-1 mt-3 text-center" > {
                thread.children.length === 0 ? '' :
                thread.children.length === 1 ? 'Reply'  : 'Replies'
            } </p> */}
            <div className=" sm:mt-3 md:mt-10 flex flex-col sm:gap-1 md:gap-10">
                {thread.children.map((childItem : any) => {
                    return  childItem.repostedBy ? 
                    <RepostThreadCard 
                        repostId={childItem._id}
                        referenceThread={childItem.referenceThread} 
                        currentUserId={user?.id || ""} 
                        userSecondId={userInfo._id} 
                        repostedBy={childItem.repostedBy}
                        // isComment={false}
                    /> 
                        :
                    <ThreadCard
                                key={childItem._id}
                                id={childItem._id}
                                currentUserId={user?.id || ""}
                                parentId={childItem.parentId}
                                content={childItem.text}
                                author={childItem.author}
                                files={childItem.files || []}
                                community={childItem.community}
                                createdAt={childItem.createdAt}
                                comments={childItem.children}
                                // isComment={false}
                                isReposted={childItem.reposters ? childItem.reposters.includes(userInfo._id) : false}
                                isLike={childItem.likes ? childItem.likes.includes(userInfo._id) : false}
                                likesCount={childItem.likes ? childItem.likes.length : 0}
                                userSecondId={userInfo._id}
                                authorId={childItem.author._id}
                                repostedBy={childItem.repostedBy}
                            />
                })}
            </div>
        </section>
    )
}

export default page