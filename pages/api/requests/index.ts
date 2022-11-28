import { withAuthentication } from "@/lib/api-middlewares/with-authentication";
import { withMethods } from "@/lib/api-middlewares/with-methods";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { RequiresProPlanError } from "@/lib/exceptions";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import * as z from "zod"


const requestCreateSchema = z.object({
    userId: z.string(),
    blogId: z.string()
})
async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (req.method === "POST") {
        try {
            const data = requestCreateSchema.parse(req.body)

            const postExists = await db.request.findFirst({
                where: {
                    userId: data.userId,
                    blogId: data.blogId
                }
            })

            if(postExists) {
                throw new Error("Request has already been sent, please wait for the author to apporve")
            }
            const user = await db.request.create({
                data: {
                    userId: data.userId,
                    blogId: data.blogId
                },
                select: {
                    id: true
                }
            })
            return res.json(user)
        } catch (error) {
            console.log("error ===", error)
            if (error instanceof z.ZodError) {
                return res.status(422).json(error.issues)
            }
            if (error instanceof RequiresProPlanError) {
                return res.status(402).end()
            }
            if(error instanceof Error) {
                return res.status(400).json(error.message)
            }
            return res.status(500).end()
        }
    }

    return res.send("Get request not yet build!")
}

export default withMethods(["GET", "POST"], withAuthentication(handler))