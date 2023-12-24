import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  members: {
    image: string;
  }[];
}

function CommunityCard({ id, name, username, imgUrl, bio, members }: Props) {
  return (
    <div className=" max-sm:w-full">
    <article className='community-card'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className=" flex items-center gap-3">

          <Link href={`/communities/${id}`} className='relative h-12 w-12 max-sm:h-10 max-sm:w-10 self-start'>
            <Image
              src={imgUrl}
              alt='community_logo'
              fill
              className='rounded-full object-cover'
              />
          </Link>

          <div>
            <Link href={`/communities/${id}`}>
              <h4 className='text-base-semibold text-light-1'>{name}</h4>
            </Link>
            <p className='text-small-medium text-gray-1'>@{username}</p>
            <div className='mt-1 flex flex-wrap items-center'>
              {members.length > 0 && (
                <div className='flex items-center'>
                  {members.map((member, index) => (
                    <Image
                    key={index}
                    src={member.image}
                    alt={`user_${index}`}
                    width={19}
                    height={19}
                    className={`${
                      index !== 0 && "-ml-2"
                    } rounded-full object-cover`}
                    />
                    ))}
                  {members.length > 3 && (
                    <p className='ml-1 text-subtle-medium text-gray-1'>
                      {members.length}+ Users
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <Link href={`/communities/${id}`} className=" ">
          <Button className='community-card_btn px-4 py-2'>
            View
          </Button>
        </Link>
      </div>

      
    </article>
    <div className=' invisible max-sm:visible w-full'>

            <div className=' flex py-3 '>
                <div className='w-12 max-sm:w-10' />
                <div className=' thread-card_bar m-0 h-[1px] bg-dark-2' />
            </div>
        </div>
    </div>
  );
}

export default CommunityCard;