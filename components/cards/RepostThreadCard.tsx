
import { Api } from '@/lib/api'
import ThreadCard from './ThreadCard';

const RepostThreadCard = async (
    { 
        repostId, 
        referenceThread, 
        currentUserId, 
        userSecondId, 
        repostedBy, 
        isComment 
    }
        : 
    { 
        repostId: string, 
        referenceThread: string, 
        currentUserId: string, 
        userSecondId: string, 
        repostedBy: string, 
        isComment?:boolean 
}) => {

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