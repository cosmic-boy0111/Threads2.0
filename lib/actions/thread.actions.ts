"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Thread from "../models/thread.model";
import Community from "../models/community.model";
import { _IcommentToThread, _Ilike, _Irepost, _IrepostDelete, _Ithread } from "../interfaces";
import { Schema } from "mongoose";

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDB();

    // Calculate the number of posts to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
    const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: "desc" })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({
            path: "author",
            model: User,
        })
        .populate({
            path: "community",
            model: Community,
        })
        .populate({
            path: "children", // Populate the children field
            populate: {
                path: "author", // Populate the author field within children
                model: User,
                select: "_id name parentId image username", // Select only _id and username fields of the author
            },
        });

    // Count the total number of top-level posts (threads) i.e., threads that are not comments.
    const totalPostsCount = await Thread.countDocuments({
        parentId: { $in: [null, undefined] },
    }); // Get the total count of posts

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
}

export async function createThread({ text, author, communityId, files, path }: _Ithread
) {
    try {
        connectToDB();

        const communityIdObject = await Community.findOne(
            { id: communityId },
            { _id: 1 }
        );

        const createdThread = await Thread.create({
            text,
            author,
            files,
            createdAt : new Date(),
            community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
        });

        // Update User model
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id },
        });

        if (communityIdObject) {
            // Update Community model
            await Community.findByIdAndUpdate(communityIdObject, {
                $push: { threads: createdThread._id },
            });
        }

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to create thread: ${error.message}`);
    }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
    const childThreads = await Thread.find({ parentId: threadId });

    const descendantThreads = [];
    for (const childThread of childThreads) {
        const descendants = await fetchAllChildThreads(childThread._id);
        descendantThreads.push(childThread, ...descendants);
    }

    return descendantThreads;
}


async function deleteRepostReferencesAndLikeThreadsFromUsers(threadId: string) {
    const mainThread = await Thread.findById(threadId);
    if(!mainThread) return;

    await User.updateMany(
        { _id: { $in: mainThread.reposters } },
        { $pullAll: { reposts: mainThread.reposts } }
    );

    await User.updateMany(
        { _id: { $in: mainThread.likes } },
        { $pull: { likeThreads: mainThread._id } }
    );
    
    for (const childThreadId of mainThread.children) {    
        await deleteRepostReferencesAndLikeThreadsFromUsers(childThreadId);
    }

}


export async function deleteThread(id: string, path: string, parentId : string | null): Promise<void> {
    try {
        connectToDB();

        // Find the thread to be deleted (the main thread)
        const mainThread = await Thread.findById(id).populate("author community");

        if (!mainThread) {
            throw new Error("Thread not found");
        }
        // updated todo : remove all the reposts of this thread
        //                if parent is present then remove all reposts if from parent thread 
        //   

        // if(mainThread.reposts){
        //     await Thread.deleteMany({ _id: { $in: mainThread.reposts } });
        // }

        // delete from parent thread if has

        const childArrayWithRepost = mainThread.reposts;
        if(parentId){
            // deleting reposts ids from parent thread
            childArrayWithRepost.push(id);
            const parentThread = await Thread.findById(parentId);
            parentThread.children = parentThread.children.filter((childId : Schema.Types.ObjectId) => !childArrayWithRepost.includes(childId));

            await parentThread.save();
        }

        // deleting all reposts related to the thread
        await Thread.deleteMany({ _id: { $in: childArrayWithRepost } });

        // Fetch all child threads and their descendants recursively
        const descendantThreads = await fetchAllChildThreads(id);

        // Get all descendant thread IDs including the main thread ID and child thread IDs
        const descendantThreadIds = [
            id,
            ...descendantThreads.map((thread) => thread._id),
        ];

        // Extract the authorIds and communityIds to update User and Community models respectively
        const uniqueAuthorIds = new Set(
            [
                ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
                mainThread.author?._id?.toString(),
            ].filter((id) => id !== undefined)
        );

        const uniqueCommunityIds = new Set(
            [
                ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
                mainThread.community?._id?.toString(),
            ].filter((id) => id !== undefined)
        );

        // delet reposts and likes from each user 
        await deleteRepostReferencesAndLikeThreadsFromUsers(id);
        
        // Recursively delete child threads and their descendants
        await Thread.deleteMany({ _id: { $in: descendantThreadIds } });
        

        // Update User model
        await User.updateMany(
            { _id: { $in: Array.from(uniqueAuthorIds) } },
            { $pull: { threads: { $in: descendantThreadIds } } }
        );


        // Update Community model
        await Community.updateMany(
            { _id: { $in: Array.from(uniqueCommunityIds) } },
            { $pull: { threads: { $in: descendantThreadIds } } }
        );

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to delete thread: ${error.message}`);
    }
}

export async function fetchThreadById(threadId: string) {
    connectToDB();

    try {
        const thread = await Thread.findById(threadId)
            .populate({
                path: "author",
                model: User,
                select: "_id id name image username",
            }) // Populate the author field with _id and username
            .populate({
                path: "community",
                model: Community,
                select: "_id id name image",
            }) // Populate the community field with _id and name
            .populate({
                path: "children", // Populate the children field
                populate: [
                    {
                        path: "author", // Populate the author field within children
                        model: User,
                        select: "_id id name parentId image username", // Select only _id and username fields of the author
                    },
                    {
                        path: "children", // Populate the children field within children
                        model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
                        populate: {
                            path: "author", // Populate the author field within nested children
                            model: User,
                            select: "_id id name parentId image username", // Select only _id and username fields of the author
                        },
                    },
                ],
            })
            .exec();
        

        return thread;
    } catch (err) {
        console.error("Error while fetching thread:", err);
        throw new Error("Unable to fetch thread");
    }
}

export async function addCommentToThread({
    threadId,
    commentText,
    userId,
    files,
    path
} : _IcommentToThread ) {
    connectToDB();

    try {
        // Find the original thread by its ID
        const originalThread = await Thread.findById(threadId);

        if (!originalThread) {
            throw new Error("Thread not found");
        }

        // Create the new comment thread
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            files : files,
            createdAt : new Date(),
            parentId: threadId, // Set the parentId to the original thread's ID
        });

        // Save the comment thread to the database
        const savedCommentThread = await commentThread.save();

        // Add the comment thread's ID to the original thread's children array
        originalThread.children.push(savedCommentThread._id);

        // Save the updated original thread to the database
        await originalThread.save();

        revalidatePath(path);
    } catch (err) {
        console.error("Error while adding comment:", err);
        throw new Error("Unable to add comment");
    }
}

export const repostThread = async ({
    parentId,
    repostedBy,
    referenceThread,
    author,
    path
} : _Irepost) => {
    try {

        await connectToDB();

        const originalThread = await Thread.findById(referenceThread);

        if (!originalThread) {
            throw new Error("Thread not found");
        }

        const repostThread = await Thread.create({
            text: 'reposted thread',
            author: author,
            parentId: parentId,
            repostedBy : repostedBy,
            referenceThread : referenceThread
        })
        
        const user = await User.findById(repostedBy);
        if(user.reposts){
            user.reposts.push(repostThread._id)
        }

        await user.save();

        if(originalThread.reposts){
            originalThread.reposts.push(repostThread._id);
        }
        if(originalThread.reposters){
            originalThread.reposters.push(repostedBy);
        }
        
        await originalThread.save();

        if(parentId){
            const parentThread = await Thread.findById(parentId);
            parentThread.children.unshift(repostThread._id);
            await parentThread.save();
        }

        revalidatePath(path);
        
    } catch (error) {
        console.error("Error while reposting:", error);
        throw new Error("Unable to repost");
    }
}

// delete repost thread

// Todo : judt remove that thread from the database
//        snd also its reference from the reference thread of maint hread

export const removeRepostThread = async ({
    parentId,
    currentUserId,
    mainThreadId,
    repostThreadId,
    path
} : _IrepostDelete) => {
    try {
        
        await connectToDB();

        const mainThread = await Thread.findById(mainThreadId);
        if(!mainThread){
            throw new Error("Thread not found");
        }

        const repostThread = 
            repostThreadId ? 
                await Thread.findById(repostThreadId) : 
                await Thread.findOne({
                    repostedBy : currentUserId,
                    referenceThread : mainThread
                });

        const user = await User.findById(currentUserId);
        if(user.reposts){
            user.reposts = user.reposts.filter((id : Schema.Types.ObjectId) => id.toString() !== repostThread._id.toString());
        }
        
        await user.save();

        if(repostThread.repostedBy.toString() !== currentUserId.toString()){
            throw new Error("user not match");
        }

        await Thread.findByIdAndDelete(repostThread._id);
        mainThread.reposts = mainThread.reposts.filter((id : Schema.Types.ObjectId) => id.toString() !== repostThread._id.toString());
        mainThread.reposters = mainThread.reposters.filter((id : Schema.Types.ObjectId) => id.toString() !== currentUserId.toString());
        await mainThread.save();

        if(parentId){
            const parentThread = await Thread.findById(parentId);
            parentThread.children = parentThread.children.filter((childId : Schema.Types.ObjectId) => childId.toString() !== repostThread._id.toString());
            await parentThread.save();
        }

        revalidatePath(path);

    } catch (error : any) {
        console.error("Error while repost delete:", error.message);
        throw new Error("Unable to repost delete");
    }
}

export const likeThread = async ({
    userId,
    threadId,
    path
} : _Ilike) => {
    try {
        
        await connectToDB();

        const thread = await Thread.findById(threadId);
        const user = await User.findById(userId);
        if(thread.likes){
            thread.likes.push(user._id);
        }
        if(user.likeThreads){
            user.likeThreads.push(thread._id);
        }

        await thread.save();
        await user.save();

        revalidatePath(path)

    } catch (error : any) {
        console.log(' Error while repost like thread : ', error.message);
        
    }
}


export const removeLikeThread = async ({
    userId,
    threadId,
    path
} : _Ilike ) => {
    try {
        
        await connectToDB();

        const thread = await Thread.findById(threadId);
        const user = await User.findById(userId);
        if(thread.likes){
            thread.likes = thread.likes.filter((id : Schema.Types.ObjectId) => id.toString() !== user._id.toString());
        }
        if(user.likeThreads){
            user.likeThreads = user.likeThreads.filter((id : Schema.Types.ObjectId) => id.toString() !== thread._id.toString());
        }

        await thread.save();
        await user.save();

        revalidatePath(path)

    } catch (error : any) {
        console.log(' Error while repost like thread : ', error.message);
        
    }
}