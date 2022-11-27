"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
interface Props {
    userId: string | null
    blogId: string
}
const RequestAccessBtn: React.FC<Props> = ({userId, blogId}) => {
    const router = useRouter()
    const onClick = () => {
        if(!userId) {
            
            return
        }
    }
    return (
        <button onClick={onClick} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Request Access</button>
    )
}

export default RequestAccessBtn