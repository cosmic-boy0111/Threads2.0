
import PostThread from "@/components/forms/PostThread";
import { Api } from "@/lib/api";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const page = async () => {

    const user = await currentUser();
    if(!user) return null;

    const userInfo = await Api._user._fetchUser(user?.id);

    if(!userInfo?.onboarded) redirect('/onboarding')

  return (
    <>
        <h1 className='head-text' >
            Create Thread
        </h1>
        <PostThread userId={userInfo._id.toString()} />
    </>
  )
}

export default page