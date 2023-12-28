'use client'
import { useRef } from "react"
import PostThread from "./PostThread"

interface Props {
    userInfo: any,
    thread: any,
    threadId: string,
}

const ReplyHandler = ({
    userInfo,
    thread,
    threadId
} : Props) => {

    const ref = useRef<any>(null)

    return (
        <div ref={ref}  className=" max-sm:max-h-[86vh] max-sm:overflow-y-scroll">
            {thread}
            <PostThread author={userInfo} threadId={threadId} reference={ref} /> 
        </div>
    )
}

export default ReplyHandler