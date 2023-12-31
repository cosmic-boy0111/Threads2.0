import { currentUser } from "@clerk/nextjs"
import Image from "next/image";
import { communityTabs } from "@/constants";

import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Api } from "@/lib/api";
import UserCard from "@/components/cards/UserCard";


const page = async ({params} : { params : { id : string }}) => {

    const user = await currentUser();
    if (!user) return null;

    const communityDetails = await Api._community._fetchCommunityDetails(params.id);

    return (
        <section>
           <ProfileHeader 
                accountId={communityDetails.id}
                authUserId={user.id}
                name={communityDetails.name}
                username={communityDetails.username}
                imgUrl={communityDetails.image}
                bio={communityDetails.bio}
                type="Community"
           /> 

           <div className=" mt-3">
                <Tabs defaultValue="threads" className=" w-full">
                    <TabsList className="tab sticky top-[54px] max-sm:-top-1 z-30">
                        {
                            communityTabs.map((tab) => (
                                <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                    <Image 
                                        src={tab.icon}
                                        alt={tab.label}
                                        width={24}
                                        height={24}
                                        className=" max-sm:hidden object-contain"
                                    />
                                    <p  className=" text-small-regular">{tab.label}</p>
                                    {/* {tab.label === "Threads" && (
                                        <p className=" ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                            {communityDetails?.threads?.length}
                                        </p>
                                    )} */}
                                </TabsTrigger>
                            ))
                        }
                    </TabsList>
                    <div className='h-0.5 w-full bg-dark-3' />
                    <TabsContent value={'threads'} className=" w-full text-light-1">
                        <ThreadsTab 
                            currentUserId={user.id}
                            accountId={communityDetails._id}
                            accountType="Community"
                        />
                    </TabsContent>
                    <TabsContent value={'members'} className=" w-full text-light-1">
                        <section className=" mt-9 flex flex-col gap-0"> 
                            {communityDetails?.members.map((member : any) => (
                                <UserCard 
                                    key={member.id}
                                    id={member.id}
                                    name={member.name}
                                    username={member.username}
                                    imgUrl={member.image}
                                    personType="User"
                                />
                            ))}
                        </section>
                    </TabsContent>
                    {/* <TabsContent value={'requests'} className=" w-full text-light-1">
                        <ThreadsTab 
                            currentUserId={user.id}
                            accountId={communityDetails._id}
                            accountType="Community"
                        />
                    </TabsContent> */}
                </Tabs>
           </div>
        </section>
    )
}

export default page