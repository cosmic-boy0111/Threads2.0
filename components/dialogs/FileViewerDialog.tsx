'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"

interface Props {
  open: boolean,
  setOpen: (value: boolean) => void,
  file: {
    url: string,
    type: string
  }
}

const FileViewerDialog = ({
  open,
  setOpen,
  file
}: Props) => {

  useEffect(() => {
    console.log('inside');

    const handleBackButton = (event: PopStateEvent) => {
      console.log('inside back button of browser');
      setOpen(false);
    };

    window.addEventListener('popstate', handleBackButton);


    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };

  }, [open])

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    window.history.back();
  };

  return (
    <Dialog open={open} onOpenChange={
      (open: boolean) => open ? handleOpen() : handleClose()
    } >
      <DialogContent className=" p-0 flex justify-center max-sm:bg-dark-1 max-sm:h-[100vh] max-sm:py-[auto] bg-dark-2 text-light-1 border-none">
        <DialogHeader className=" flex justify-center">

          <DialogDescription>
            {
              file.type.includes('image') ?
                <img className={`object-fit cursor-pointer sm:w-auto rounded-md max-sm:rounded-none `} src={file.url} alt="..." /> :
                <video className={`object-cover cursor-pointer w-auto rounded-md max-sm:rounded-none `} playsInline={true} preload='auto' autoPlay={true} loop={true} muted={true}>
                  <source src={file.url} />
                </video>
            }
          </DialogDescription>
        </DialogHeader>

      </DialogContent>
    </Dialog>
  )
}

export default FileViewerDialog