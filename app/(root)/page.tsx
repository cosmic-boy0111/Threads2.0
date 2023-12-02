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
              />
            ))}
          </>
        )}
      </section>
    </> 
  )
}

export default Home