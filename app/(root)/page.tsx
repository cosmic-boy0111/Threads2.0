import RepostThreadCard from "@/components/cards/RepostThreadCard";
import ThreadCard from "@/components/cards/ThreadCard";
import { Api } from "@/lib/api"
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Home =  async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {

  const user = await currentUser();
  if (!user) return redirect('/sign-in');

  const userInfo = await Api._user._fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await Api._thread._fetchPosts(
    searchParams.page ? +searchParams.page : 1,
    30
  );


  return (
    <>
      <h1 className="head-text text-left hidden sm:hidden md:block" >
        Home
      </h1>
      <section className=" md:mt-9 sm:mt-2 flex flex-col sm:gap-1 md:gap-10" >
        {result.posts.length === 0 ? (
          <p className="no-result" > No Threads Found </p>
        ) :  (
          <>
            {result.posts.map((post) => (
              post.repostedBy ? 
              <RepostThreadCard 
                repostId={post._id}
                referenceThread={post.referenceThread} 
                currentUserId={user?.id || ""} 
                userSecondId={userInfo._id} 
                repostedBy={post.repostedBy}
                isComment={false}
              /> 
                :
              <ThreadCard 
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                files={post.files || []}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                isReposted={post.reposters ? post.reposters.includes(userInfo._id) : false}
                userSecondId={userInfo._id}
                authorId={post.author._id} 
                repostedBy={post.repostedBy} 
              />
            ))}
          </>
        )}
      </section>
    </> 
  )
}

export default Home