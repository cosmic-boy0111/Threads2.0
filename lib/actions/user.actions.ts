'use server'

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import { _Iuser, _Iusers } from "../interfaces";
import Threads from "../models/thread.model";
import { FilterQuery } from "mongoose";

export const updateUser = async ({
    userId,
    username,
    name,
    bio,
    image,
    path 
} : _Iuser ) : Promise<void> => {
    try {

        connectToDB();

        await User.findOneAndUpdate(
            { id : userId},
            {
                username : username.toLowerCase(),
                name,
                bio,
                image,
                onboarded : true,
            },
            { upsert : true },
        )

        if(path === "/profile/edit"){
            revalidatePath(path);
        }

    } catch (error : any) {
        throw new Error(`failed to create/update user : ${error.message}`)
    }
}

export const fetchUser = async ( userId : string | undefined | null ) => {
    try {
        connectToDB();
        return await User
        .findOne({ id : userId })
        // .populate({
        //     path : 'communities',
        //     model : Community
        // })
    } catch (error : any) {
        throw new Error(`failed to fetch user : ${error.message}`)
    }
}

export const fetchUserPosts = async (userId : string) => {
    try {
        connectToDB();

        // find all threads authored by the user with given user id

        // Todo : populate community

        const threds = await User.findOne({ id : userId})
            .populate({
                path : 'threads',
                model : Threads,
                populate : {
                    path : 'children',
                    model : Threads,
                    populate : {
                        path : 'author',
                        model : Threads,
                        select : 'name image id'
                    }
                }
            })

        return threds;

    } catch (error : any) {
        throw new Error(`Failed to fetch user posts : ${error.message}`)
    }
}

export const fetchUsers = async ({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = 'desc'
} : _Iusers ) => {
    try {
        connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, 'i');

        const query : FilterQuery<typeof User> = {
            id : { $ne : userId },
        }

        if(searchString.trim() !== '') {
            query.$or = [
                { username : { $regex : regex } },
                { name : { $regex : regex } },
            ]
        }

        const sortOptions = { createdAt : sortBy };

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec();

        const isNext = totalUsersCount > skipAmount + users.length;

        return {users, isNext}

    } catch (error : any) {
        throw new Error(`Failed to fetch users : ${error.message}`)
    }
}

export const getActivity = async (userId : string) => {
    try {
        await connectToDB();

        // find all threads created by this user
        const userThreads = await Threads.find({ author : userId });

        // collect all the child threads ids from the children 
        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children)
        }, [])

        const replies = await Threads.find({
            _id : { $in : childThreadIds },
            author : { $ne : userId }
        }).populate({
            path : 'author',
            model : User,
            select : "_id id name image"
        })

        return replies;

    } catch (error : any) {
        throw new Error(`Failed to fetch activity : ${error.message}`)
    }
}