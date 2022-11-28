import { notFound } from "next/navigation"
import { allAuthors, allPosts } from "contentlayer/generated"

import { Mdx } from "@/components/docs/mdx"
import "@/styles/mdx.css"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Icons } from "@/components/icons"
import Image from "next/image"
import { db } from "@/lib/db"

interface PostPageProps {
  params: {
    slug: string[]
  }
}
// TODO: figure out why it is not working and make it work
// export async function generateStaticParams(): Promise<
//   PostPageProps["params"][]
// > {
//   return allPosts.map((post) => ({
//     slug: post.slugAsParams.split("/"),
//   }))
// }

export default async function PostPage({ params }: PostPageProps) {
  const slug = params?.slug?.join("/")
  // const post = allPosts.find((post) => post.slugAsParams === slug)

  const post = await db.post.findFirst({
    where: {
      id: slug
    }, 
    include: {
      author: true
    }
  })
  if (!post) {
    notFound()
  }

  // const authors = post.authors.map((author) =>
  //   allAuthors.find(({ slug }) => slug === `/authors/${author}`)
  // )

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      <Link
        href="/blog"
        className="absolute top-14 -left-[200px] hidden items-center justify-center text-sm font-medium text-slate-600 hover:text-slate-900 xl:inline-flex"
      >
        <Icons.chevronLeft className="mr-2 h-4 w-4" />
        See all posts
      </Link>
      <div>
        {post.createdAt.toString() && (
          <time dateTime={post.createdAt.toString()} className="block text-sm text-slate-600">
            Published on {formatDate(post.createdAt.toString())}
          </time>
        )}
        <h1 className="mt-2 inline-block text-4xl font-extrabold leading-tight text-slate-900 lg:text-5xl">
          {post.title}
        </h1>
        {/* TODO: support authors later */}
        {/* {authors?.length ? (
          <div className="mt-4 flex space-x-4">
            {authors.map((author) => (
              <Link
                key={author._id}
                href={`https://twitter.com/${author.twitter}`}
                className="flex items-center space-x-2 text-sm"
              >
                <Image
                  src={author.avatar}
                  alt={author.title}
                  width={42}
                  height={42}
                  className="rounded-full"
                />
                <div className="flex-1 text-left leading-tight">
                  <p className="font-medium text-slate-900">{author.title}</p>
                  <p className="text-[12px] text-slate-600">
                    @{author.twitter}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : null} */}
      </div>
      {/* TODO: support image feature later */}
      {/* {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          width={720}
          height={405}
          className="my-8 rounded-md border border-slate-200 bg-slate-200 transition-colors group-hover:border-slate-900"
          priority
        />
      )} */}
      {/* TODO: later figure out what mdx is and impliment is if the project makes sense */}
      {/* <Mdx code={post.id} /> */}
      <hr className="my-4 border-slate-200" />
      <p>{post.private ? "This is a priavte post you can access it if you have informatin" : "this is not a private post and everyone can access it"}</p>
      <hr className="my-4 border-slate-200" />

      <div className="flex justify-center py-6 lg:py-10">
        <Link
          href="/blog"
          className="inline-flex items-center justify-center text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          See all posts
        </Link>
      </div>
    </article>
  )
}
