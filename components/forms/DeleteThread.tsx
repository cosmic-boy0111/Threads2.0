"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { Api } from "@/lib/api";
import Option from "../shared/Option";
import ConfirmDialog from "../dialogs/ConfirmDialog";

interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
  closeFunction?: any
}

function DeleteThread({
  threadId,
  currentUserId,
  authorId,
  parentId,
  isComment,
  closeFunction
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  if (currentUserId !== authorId) return null;

  const handleDelete = async () => {

    await Api._thread._deleteThread(JSON.parse(threadId), pathname, parentId);
    if ((!parentId || !isComment) && !pathname.includes('profile')) {
      router.push("/");
    }

    if(closeFunction){
      closeFunction();
    }
    
  }

  return (
    <ConfirmDialog 
      title="Delete this post ?"
      actionName="Delete"
      handleConfirm={handleDelete} 
      trigger={<Option displayName='Delete' className=' justify-start bg-dark-4 text-red-500  hover:bg-dark-3' />}
    />
  );
}

export default DeleteThread;