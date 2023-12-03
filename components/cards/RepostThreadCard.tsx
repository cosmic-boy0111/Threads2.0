
import { Api } from '@/lib/api'
import ThreadCard from './ThreadCard';

const RepostThreadCard = async (
    { referenceThread, currentUserId, userSecondId, repostedBy }
        : { referenceThread: string, currentUserId: string, userSecondId: string, repostedBy: string }) => {

    const thread = await Api._thread._fetchThreadById(referenceThread);
    const user = await Api._user._fetchUserBy_id(repostedBy);
    console.log(thread);


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
        />
    )
}

export default RepostThreadCard