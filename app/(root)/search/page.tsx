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

    // Fetch users
    const result = await Api._user._fetchFilterUsers({
        userId: user.id,
        searchString: searchParams.q,
        pageNumber: searchParams?.page ? +searchParams.page : 1,
        pageSize: 25,
    })

    return (
        <section>
            <h1 className=" head-text mb-10" > Search </h1>

            {/* // Todo : search bar */}
            <Searchbar routeType="search" />

            <div className=" mt-14 flex flex-col gap-9">
                {result.users.length === 0 ? (
                    <p className=" no-result" >No Usres</p>
                ) : (
                    <>
                        {result.users.map((person) => (
                            <UserCard 
                                key={person.id}
                                id={person.id}
                                name={person.name}
                                username={person.username}
                                imgUrl={person.image}
                                personType="User"
                            />
                        ))}
                    </>
                )} 
            </div>

            <Pagination 
                path='search'
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={result.isNext}
            />

        </section>
    )
}

export default page