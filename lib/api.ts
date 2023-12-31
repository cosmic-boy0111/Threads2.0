import { 
    fetchCommunities, 
    fetchCommunityDetails, 
    fetchCommunityPosts 
} from "./actions/community.actions";
import { 
    addCommentToThread, 
    createThread, 
    deleteThread, 
    fetchPosts, 
    fetchThreadById, 
    likeThread, 
    removeLikeThread, 
    removeRepostThread, 
    repostThread
} from "./actions/thread.actions";
import { fetchUser, fetchUserBy_id, fetchUserPosts, fetchUsers, getActivity, getReplies, getReposts, updateUser } from "./actions/user.actions"
import { _IcommentToThread, _Icommunity, _Ilike, _Irepost, _IrepostDelete, _Ithread, _Iuser, _Iusers } from "./interfaces";

class User {
    _updateUser = (data : _Iuser) => updateUser(data);
    _fetchUser = (userId : string | undefined | null) => fetchUser(userId);
    _fetchUserPosts = (userId : string) => fetchUserPosts(userId);
    _fetchFilterUsers = (data : _Iusers) => fetchUsers(data);
    _getActivity = (userId : string) => getActivity(userId);
    _getReplies = (userId : string) => getReplies(userId);
    _fetchUserBy_id = (userId : string | undefined | null) => fetchUserBy_id(userId);
    _getReposts = (userId : string) => getReposts(userId);
}

class Thread {
    _createThread = (data : _Ithread) => createThread(data);
    _fetchPosts = (pageNumber = 1, pageSize = 20) => fetchPosts(pageNumber,pageSize);
    _fetchThreadById = (id : string) => fetchThreadById(id);
    _addCommentToThread = ( data : _IcommentToThread ) => addCommentToThread(data);
    _deleteThread = (id: string, path: string, parentId : string | null) => deleteThread(id, path, parentId);
    _repostThread = (data : _Irepost) => repostThread(data);
    _removeRepostThread = (data : _IrepostDelete) => removeRepostThread(data);
    _likeThread = (data : _Ilike) => likeThread(data);
    _removeLikeThread = (data : _Ilike) => removeLikeThread(data);
}

class Community {
    _fetchCommunityDetails = ( id : string ) => fetchCommunityDetails(id);
    _fetchCommunityPosts = (id : string) => fetchCommunityPosts(id);
    _fetchCommunities = ( data : _Icommunity ) => fetchCommunities(data);
}


export const Api = {
    _user : new User(),
    _thread : new Thread(),
    _community : new Community(),
}