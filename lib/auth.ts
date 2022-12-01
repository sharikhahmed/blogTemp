import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { Client } from "postmark"

import { db } from "@/lib/db"
import Credentials from "next-auth/providers/credentials"

// const postmarkClient = new Client(process.env.POSTMARK_API_TOKEN)

const POSTMARK_SIGN_IN_TEMPLATE = 29559329
const POSTMARK_ACTIVATION_TEMPLATE = 29559329

export const authOptions: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  adapter: PrismaAdapter(db as any),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Why should i importhis", 
      credentials: {
        email: { label: "email", type: "email", placeholder: "test@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        console.log("credential req data", {credentials, req})
        // Add logic here to look up the user from the credentials supplied
        // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
        const user = await db.user.findFirst({
          where: {
            email: credentials.email
          }
        })

        console.log("user ==", {user})
  
        if (user) {
          return user
        } else {
          throw new Error("User not found, if you don't have a account signup first")

        }
      }
    })
  ],
  callbacks: {
    async session({ token, session }) {
      console.log("token == ", token)
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        token.id = user.id
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
  },
}
