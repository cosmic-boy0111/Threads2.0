import { SortOrder } from "mongoose";

export interface _Iuser {
    userId : string | undefined;
    username : string,
    name : string,
    bio : string,
    image : string,
    path : string
}

export interface _Ithread {
    text : string,
    author : string,
    communityId : string | null,
    path : string
}

export interface _IthreadCard {
    id : string,
    currentUserId : string,
    parentId : string | null,
    content : string,
    author : {
        name : string,
        image : string,
        id : string,
    },
    community : {
        id : string,
        name : string,
        image : string,
    } | null,
    createdAt : string,
    comments : {
        author : {
            image : string,
        }
    }[],
    isComment? : boolean
}

export interface _Icomment {
    threadId : string,
    currentUserImage : string,
    currentUserId : string
}

export interface _IcommentToThread {
    threadId : string,
    commentText : string,
    userId : string,
    path : string
}

export interface _IprofileHeader {
    accountId : string,
    authUserId : string,
    name : string,
    username : string,
    imgUrl : string,
    bio : string,
}

export interface _IthreadsTabs {
    currentUserId : string,
    accountId : string,
    accountType : string,
}

export interface _Iusers {
    userId: string,
    searchString?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder
}