import ApproveReqBtn from "@/components/dashboard/ApproveReqBtn"
import { DashboardHeader } from "@/components/dashboard/header"
import RejectReqBtn from "@/components/dashboard/RejectReqBtn"
import { DashboardShell } from "@/components/dashboard/shell"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { formatDate } from "@/lib/utils"
import { redirect } from "next/navigation"


export default async function SettingsPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions.pages.signIn)
    }
    const requests = await db.request.findMany({
        where: {
            blog: {
                authorId: user.id
            }
        },
        include: {
            blog: true,
            user: true
        }
    })
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Requests"
                text="All the readers request to read your private blogs"
            />
            {requests?.length ? (
                <div className="grid gap-10 sm:grid-cols-2">
                    {requests.map((request, index) => (
                        <article
                            key={request.id}
                            className="group relative flex flex-col space-y-2"
                        >
                            <h2 className="text-2xl font-extrabold">{request.blog.title}</h2>
                            {true && (
                                <p className="text-slate-600">{"description of request will come here once i add the feature"}</p>
                            )}
                            {request.createdAt && (
                                <p className="text-sm text-slate-600">
                                    {formatDate(request.createdAt.toString())}
                                </p>
                            )}
                            {/* TODO: add slug for href once you build slug feature */}
                            <div className="grid grid-cols-2 gap-6">
                                <RejectReqBtn reqId={request.id} />
                                <ApproveReqBtn reqId={request.id} />
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <p>No requests sent.</p>
            )}
        </DashboardShell>
    )
}
