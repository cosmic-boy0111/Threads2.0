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
    files : {
        url : string,
        type : string
    }[],
    path : string
}

export interface _IthreadCard {
    id : string,
    currentUserId : string,
    parentId : string | null,
    content : string,
    author : {
        [x: string]: string | null;
        name : string,
        image : string,
        id : string,
    },
    files : {
        url : string,
        type : string
    }[],
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
    isComment? : boolean,
    isReposted : boolean,
    isLike : boolean,
    likesCount : number,
    userSecondId : string,
    authorId : string,
    repostedBy : {
        id : string,
        name : string,
        username : string,
    } | undefined | null,
    repostThreadId? : string,
    page? : string,
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
    files : {
        url : string,
        type : string
    }[],
    path : string
}

export interface _IprofileHeader {
    accountId : string,
    authUserId : string,
    name : string,
    username : string,
    imgUrl : string,
    bio : string,
    type? : 'User' | 'Community'
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

export interface _Icommunity {
    searchString? : string,
    pageNumber? : number,
    pageSize? : number,
    sortBy? : SortOrder,
}

export interface _Irepost {
    parentId : string | null,
    repostedBy : string,
    referenceThread : string,
    author : string,
    path : string,
}

export interface _IrepostDelete {
    parentId : string | null,
    currentUserId : string,
    mainThreadId : string,
    repostThreadId : string | null | undefined,
    path : string
}

export interface _Ilike {
    userId : string,
    threadId : string,
    path : string
}