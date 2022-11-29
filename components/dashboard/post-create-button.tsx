"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { toast } from "@/ui/toast"
import { Alert } from "@/ui/alert"

interface PostCreateButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> { }

export function PostCreateButton({
  className,
  ...props
}: PostCreateButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [showModal, setShowModal] = React.useState(false)
  const isPrivateBlog = React.useRef(false);

    async function postBlog ()  {
    setIsLoading(true)

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Untitled Post",
        private: isPrivateBlog
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
    <div>
      <button
        onClick={() => setShowModal(true)}
        className={cn(
          "relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
          {
            "cursor-not-allowed opacity-60": isLoading,
          },
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.add className="mr-2 h-4 w-4" />
        )}
        New post
      </button>
      <Alert open={showModal} onOpenChange={setShowModal}>
        <Alert.Content>
          <Alert.Header>
            <Alert.Title>
              Do you want to create a private blog?
            </Alert.Title>
            <Alert.Description>This action can be undone</Alert.Description>
          </Alert.Header>
          <Alert.Footer>
            <Alert.Action onClick={async (event) => {
              event.preventDefault()
              isPrivateBlog.current = false
              await postBlog()
            }}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span>No</span>
            </Alert.Action>
            <Alert.Action
              onClick={async (event) => {
                event.preventDefault()
                isPrivateBlog.current = true
                await postBlog()
              }}
              className="bg-red-600 focus:ring-red-600"
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span>Yes</span>
            </Alert.Action>
          </Alert.Footer>
        </Alert.Content>
      </Alert>
    </div>
  )
}
