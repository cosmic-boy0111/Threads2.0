import CommunityCard from "@/components/cards/CommunityCard";
import UserCard from "@/components/cards/UserCard";
import Pagination from "@/components/shared/Pagination";
import ProfileHeader from "@/components/shared/ProfileHeader";
import Searchbar from "@/components/shared/Searchbar";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { Api } from "@/lib/api";
import { currentUser } from "@clerk/nextjs"
import Image from "next/image";
import { redirect } from "next/navigation"

const page = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await Api._user._fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding')

    // Fetch Communities
    const result = await Api._community._fetchCommunities({
        searchString: searchParams.q,
        pageNumber: searchParams?.page ? +searchParams.page : 1,
        pageSize: 25,
    })

    return (
        <section>
            <h1 className=" head-text mb-10 hidden sm:hidden md:block" > Communities </h1>

            {/* // Todo : search bar */}

            <div className=' md:mt-5 sm:mt-2'>
                <Searchbar routeType='communities' />
            </div>

            <div className=" mt-14 flex flex-wrap justify-between gap-5">
                {result.communities.length === 0 ? (
                    <p className=" no-result" >No Usres</p>
                ) : (
                    <>
                        {result.communities.map((community) => (
                            <CommunityCard 
                                key={community.id}
                                id={community.id}
                                name={community.name}
                                username={community.username}
                                imgUrl={community.image}
                                bio={community.bio}
                                members={community.members}
                            />
                        ))}
                    </>
                )} 
            </div>

            <Pagination
                path='communities'
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={result.isNext}
            />

        </section>
    )
}

export default page