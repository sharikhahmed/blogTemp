"use client"

import Image from "next/image"

import { Popover } from "@/ui/popover"
import { Icons } from "@/components/icons"
import { siteConfig } from "@/config/site"
import OgImage from "public/og.jpg"

export function Help() {
  return (
    <Popover>
      <Popover.Trigger className="fixed right-4 bottom-4 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-brand text-white">
        <Icons.pizza className="h-5 w-5" />
        <span className="sr-only">Toggle</span>
      </Popover.Trigger>
      <Popover.Content className="bg-brand p-4 text-sm text-white">
        <div className="grid w-[300px] gap-4">
          <Image
            src={OgImage}
            alt="Screenshot"
            className="overflow-hidden rounded-sm"
          />
          <p>
            This app is a work in progress.
          </p>
        </div>
      </Popover.Content>
    </Popover>
  )
}
