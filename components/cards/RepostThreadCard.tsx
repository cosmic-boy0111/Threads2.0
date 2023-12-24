
import { Api } from '@/lib/api'
import ThreadCard from './ThreadCard';

const RepostThreadCard = async (
    { 
        repostId, 
        referenceThread, 
        currentUserId, 
        userSecondId, 
        repostedBy, 
        isComment,
        showUser
    }
        : 
    { 
        repostId: string, 
        referenceThread: string, 
        currentUserId: string, 
        userSecondId: string, 
        repostedBy: string, 
        isComment?:boolean,
        showUser?:boolean
}) => {

    if(userSecondId.toString() === repostedBy.toString() && showUser !== true) return;

    const thread = await Api._thread._fetchThreadById(referenceThread);
    const user = await Api._user._fetchUserBy_id(repostedBy);
    console.log(thread, userSecondId, user._id);

    return (
        <ThreadCard
            id={thread._id}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={thread.author}
            files={thread.files || []}
            community={thread.community}
            createdAt={thread.createdAt}
            comments={thread.children}
            isReposted={thread.reposters ? thread.reposters.includes(userSecondId) : false}
            isLike={thread.likes ? thread.likes.includes(userSecondId) : false}
            likesCount={thread.likes ? thread.likes.length : 0}
            userSecondId={userSecondId}
            authorId={thread.author._id}
            repostedBy={{
                id : user._id,
                name : user.name,
                username : user.username
            }}
            repostThreadId={repostId}
            isComment={isComment}
        />
    )
}

export default RepostThreadCard