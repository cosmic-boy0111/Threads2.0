'use client'
import React, { useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface Props {
    handleConfirm : any,
    trigger : any,
    title : string,
    actionName : string,
}

const ConfirmDialog = ({
    handleConfirm,
    trigger,
    title,
    actionName,
} : Props) => {


    return (
        <AlertDialog >
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent className=' text-light-1 max-sm:w-3/4 max-sm:rounded-xl max-sm:p-4 bg-dark-2 outline-none border-none'>
                <AlertDialogHeader className=' mb-2'>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className=' text-light-1 bg-transparent outline-none border-none hover:bg-dark-3 hover:text-light-2'>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} className=' text-red-500 bg-transparent outline-none border-none hover:bg-dark-3 hover:text-red-400'>{actionName}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmDialog