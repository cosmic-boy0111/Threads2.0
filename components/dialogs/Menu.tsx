import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"
import Option from "../shared/Option"
import DeleteThread from "../forms/DeleteThread"
interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

const Menu = ({
  threadId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) => {
  return (
    <Menubar className=" h-0 bg-transparent outline-none border-none max-sm:hidden">
      <MenubarMenu>
        <MenubarTrigger className=" p-0 m-0 bg-transparent cursor-pointer focus:bg-transparent data-[state=open]:bg-transparent"> <MoreHorizontal size={21} strokeWidth={'1.25'} className='text-light-4' /> </MenubarTrigger>
        <MenubarContent align="end" className="z-30 border-none bg-dark-4 text-light-1 flex flex-col gap-1">
          <Option displayName='Edit' className=' text-light-1 bg-dark-4 justify-start  hover:bg-dark-3' />
          <DeleteThread
            threadId={threadId}
            currentUserId={currentUserId}
            authorId={authorId}
            parentId={parentId}
            isComment={isComment}
          />

        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export default Menu