'use server'

import { eq } from 'drizzle-orm'
import { Session } from 'next-auth'

import db from '@/db'
import { usersTable } from '@/db/schema'

export const getUserFromSession = async (session: Session | null) => {
  if (!session?.user?.email) {
    return null
  }
  const users = await db.select().from(usersTable).where(eq(usersTable.email, session.user.email)).limit(1)
  return users.length ? users[0] : null
}

export const createUserIfNotExists = async (user: typeof usersTable.$inferInsert) => {
  const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, user.email)).limit(1)
  if (existingUser.length > 0) {
    return
  }

  const [newUser] = await db.insert(usersTable).values(user).returning()

  return newUser
}

export const updateUser = async (userId: number, user: Partial<typeof usersTable.$inferInsert>) => {
  await db.update(usersTable).set(user).where(eq(usersTable.id, userId))
}
