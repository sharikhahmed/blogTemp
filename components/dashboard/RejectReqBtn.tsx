"use client"
import { toast } from '@/ui/toast'
import React from 'react'
import { Icons } from '../icons'
interface Props {
    reqId: string
}
const RejectReqBtn: React.FC<Props> = ({reqId}) => {
    const [isLoading, setIsLoading] = React.useState(false)

    const onClick = async () => {
        setIsLoading(true)
        const response = await fetch(`/api/requests/${reqId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                rejected: true
            }),
        })
        console.log("response ==", response)

        if (!response.ok) {
            setIsLoading(false)
            return toast({
                title: "Something went wrong.",
                message: "Your request was not saved. Please try again.",
                type: "error",
            })
        }
        setIsLoading(false)
        return toast({
            message: "request denied!",
            type: "success",
        })
    }
    return (
        <button onClick={onClick} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 flex gap-1 justify-center align-center">
            {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Deny
        </button>
    )
}

export default RejectReqBtn