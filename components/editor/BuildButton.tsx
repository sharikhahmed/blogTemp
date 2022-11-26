"use client"

import { toast } from "@/ui/toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const BuildButton = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    async function onClick() {
        setIsLoading(true)

        const response = await fetch("/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: "Untitled Post",
            }),
        })

        setIsLoading(false)

        if (!response?.ok) {
            if (response.status === 402) {
                return toast({
                    title: "Limit of 3 posts reached.",
                    message: "Please upgrade to the PRO plan.",
                    type: "error",
                })
            }

            return toast({
                title: "Something went wrong.",
                message: "Your post was not created. Please try again.",
                type: "error",
            })
        }

        const post = await response.json()

        // This forces a cache invalidation.
        router.refresh()

        router.push(`/editor/${post.id}`)
    }
    
    return (
        <button
            onClick={onClick}
            // todo merge tailwind css classes and show better response later
            className="relative inline-flex h-11 items-center rounded-md border border-slate-900 bg-white px-8 py-2 text-center font-medium text-slate-900 transition-colors hover:bg-slate-900 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            disabled={isLoading}
        >
            Build your own
        </button>
    )
}

export default BuildButton