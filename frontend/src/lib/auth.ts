import { getServerSession as _getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { usersTable } from '@/db/schema'
import db from '@/db'
import { eq } from 'drizzle-orm'
import { AuthOptions } from 'next-auth'
import { getUserFromSession } from '@/models/user'

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    signIn: async ({ user }) => {
      try {
        await createUserIfNotExists({ email: user.email!, username: user.name!, firstName: user.name!, lastName: user.name! })
        return true
      } catch (err) {
        console.error(err)
        return false
      }
    }
  }
}

export const getServerSession = () => _getServerSession(authOptions)

export const createUserIfNotExists = async (user: typeof usersTable.$inferInsert) => {
  const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, user.email)).limit(1)
  if (existingUser.length > 0) {
    return
  }

  const [newUser] = await db.insert(usersTable).values(user).returning()

  return newUser
}
