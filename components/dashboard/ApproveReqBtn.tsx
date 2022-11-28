"use client"
import { toast } from '@/ui/toast'
import React from 'react'
import { Icons } from '../icons'

interface Props {
    reqId: string
}
const ApproveReqBtn: React.FC<Props> = ({ reqId }) => {
    const [isLoading, setIsLoading] = React.useState(false)
    const onClick = async () => {
        setIsLoading(true)
        const response = await fetch(`/api/requests/${reqId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                approved: true
            }),
        })

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
            message: "request approved!",
            type: "success",
        })

    }
    return (
        <button onClick={onClick} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 flex gap-1 justify-center align-center">
            {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Approve
        </button>
    )
}

export default ApproveReqBtn