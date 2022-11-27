import Link from "next/link"
import { compareDesc } from "date-fns"
import { allPosts } from "contentlayer/generated"
import { formatDate } from "@/lib/utils"
import BuildButton from "@/components/editor/BuildButton"
import { db } from "@/lib/db"
import RequestAccessBtn from "@/components/marketing/RequestAccessBtn"
import { getCurrentUser } from "@/lib/session"

export default async function BlogPage() {
  // const posts = allPosts
  //   .filter((post) => post.published) 
  //   .sort((a, b) => {
  //     return compareDesc(new Date(a.date), new Date(b.date))
  //   })

  const posts = await db.post.findMany({
    where: {
      // TODO: make this to published true
      published: false
    }
  })
  const user = await getCurrentUser()

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
            Blog
          </h1>
          <p className="text-xl text-slate-600">
            A blog built using Contentlayer. Posts are written in MDX.
          </p>
        </div>
        <BuildButton />
      </div>
      <hr className="my-8 border-slate-200" />
      {posts?.length ? (
        <div className="grid gap-10 sm:grid-cols-2">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="group relative flex flex-col space-y-2"
            >
              {/* TODO: will add support for images later */}
              {/* {post.image && (
                <Image
                  src={post.image}
                  alt={post.title}
                  width={804}
                  height={452}
                  className="rounded-md border border-slate-200 bg-slate-200 transition-colors group-hover:border-slate-900"
                  priority={index <= 1}
                />
              )} */}
              <h2 className="text-2xl font-extrabold">{post.title}</h2>
              {true && (
                <p className="text-slate-600">{"description of post will come here once i add the feature"}</p>
              )}
              {post.createdAt && (
                <p className="text-sm text-slate-600">
                  {formatDate(post.createdAt.toString())}
                </p>
              )}
              {/* TODO: add slug for href once you build slug feature */}
              {post.private ? <div className="grid grid-cols-2 gap-6">
                <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Private</button>
                <RequestAccessBtn userId={user.id} blogId={post.id} />
              </div> : <Link href={`/blog/${post.id}`}>
                <span className="sr-only">View Article</span>
                <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Read blog</button>
              </Link>}
            </article>
          ))}
        </div>
      ) : (
        <p>No posts published.</p>
      )}
    </div>
  )
}
