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
    
    return (
        <section className=" relative" >
            {/* <Head>
                <meta property="og:title" content={`${thread.author.name} (@${thread.author.usrename}) on Threads`} />
                <meta property="og:description" content={`${thread.text.slice(0,25)}...`} />
                <meta property="og:image" content={thread.files ? thread.files[0].url : ''} />
                <meta property="og:url" content={`http://localhost:3000/thread/${params.id}`} />

            </Head> */}
            <div>
                <ThreadCard
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
                />
            </div>
            <p className=" text-light-1 mt-6 text-center" > {
                thread.children.length === 0 ? '' :
                thread.children.length === 1 ? 'Reply'  : 'Replies'
            } </p>
            <div className=" mt-3">
                {thread.children.map((childItem : any) => {
                    return <ThreadCard
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
                                isComment={true}
                            />
                })}
            </div>
        </section>
    )
}

export default page