import { withMethods } from "@/lib/api-middlewares/with-methods";
import { db } from "@/lib/db";
import { RequiresProPlanError } from "@/lib/exceptions";
import { NextApiRequest, NextApiResponse } from "next";
import * as z from "zod"


const userCreateSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4)
})
async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const data = userCreateSchema.parse(req.body)

            const userExists = await db.user.findFirst({
                where: {
                    email: data.email
                }
            })

            if(userExists) {
                throw new Error("User already exists, login")
            }
            const user = await db.user.create({
                data: {
                    email: data.email, 
                    password: data.password
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
                return res.status(400).json({error: error.message})
            }
            return res.status(500).end()
        }
    }

    return res.send("Get user not yet build!")
}

export default withMethods(["GET", "POST"], handler)