import { NextApiRequest, NextApiResponse } from "next"
import * as z from "zod"
import { withMethods } from "@/lib/api-middlewares/with-methods"
import { db } from "@/lib/db"

const requestPatchSchema = z.object({
    approved: z.boolean().default(false),
    rejected: z.boolean().default(false)
})
async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PATCH") {
        try {
            const requestId = req.query.id as string
            console.log("requested id ===", requestId)
            const request = await db.request.findFirst({
                where: {
                    id: requestId,
                },
            })

            const body = requestPatchSchema.parse(req.body)

            await db.request.update({
                where: {
                    id: request.id,
                },
                data: {
                    approved: body.approved,
                    rejected: body.rejected
                },
            })

            return res.end()
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(422).json(error.issues)
            }

            return res.status(422).end()
        }
    }
}

export default withMethods(["DELETE", "PATCH"], handler)
