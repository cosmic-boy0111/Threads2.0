import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { Api } from "@/lib/api";
import { currentUser } from "@clerk/nextjs"
import Image from "next/image";
import { redirect } from "next/navigation"

const page = async ({params} : { params : { id : string }}) => {

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await Api._user._fetchUser(params.id);
    if (!userInfo?.onboarded) redirect('/onboarding')

    return (
        <section>
           <ProfileHeader 
                accountId={userInfo.id}
                authUserId={user.id}
                name={userInfo.name}
                username={userInfo.username}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
           /> 

           <div className=" mt-3">
                <Tabs defaultValue="threads" className=" w-full">
                    <TabsList className="tab sticky top-[54px] max-sm:-top-1 z-30">
                        {
                            profileTabs.map((tab) => (
                                <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                    <Image 
                                        src={tab.icon}
                                        alt={tab.label}
                                        width={23}
                                        height={23}
                                        className="max-sm:hidden object-contain"
                                    />
                                    <p  className=" text-small-regular">{tab.label}</p>
                                    {/* {tab.label === "Threads" && (
                                        <p className=" rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                            {userInfo?.threads?.length}
                                        </p>
                                    )} */}
                                </TabsTrigger>
                            ))
                        }
                    </TabsList>
                    <TabsContent value={'threads'} className=" w-full text-light-1">
                        <ThreadsTab 
                            currentUserId={user.id}
                            accountId={userInfo.id}
                            accountType="User"
                        />
                    </TabsContent>
                    <TabsContent value={'replies'} className=" w-full text-light-1">
                        <ThreadsTab 
                            currentUserId={user.id}
                            accountId={userInfo._id}
                            accountType="Replies"
                        />
                    </TabsContent>
                    <TabsContent value={'reposts'} className=" w-full text-light-1">
                        <ThreadsTab 
                            currentUserId={user.id}
                            accountId={userInfo._id}
                            accountType="Reposts"
                        />
                    </TabsContent>
                </Tabs>
           </div>
        </section>
    )
}

export default page