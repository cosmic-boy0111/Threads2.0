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

const Menu = () => {
  return (
    <Menubar className=" h-0 bg-transparent outline-none border-none max-sm:hidden">
      <MenubarMenu>
        <MenubarTrigger className=" p-0 m-0 bg-transparent cursor-pointer focus:bg-transparent data-[state=open]:bg-transparent"> <MoreHorizontal size={21} strokeWidth={'1.25'} className='text-light-4' /> </MenubarTrigger>
        <MenubarContent align="end" className=" border-none bg-dark-4 text-light-1">
          <MenubarItem className="cursor-pointer focus:bg-dark-3 focus:text-light-1">
            Edit
          </MenubarItem>
          <MenubarSeparator className=""/>
          <MenubarItem className="cursor-pointer focus:bg-dark-3 focus:text-red-500 text-red-500">
            Delete
          </MenubarItem>
          
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export default Menu