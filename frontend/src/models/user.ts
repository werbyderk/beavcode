'use server'

import db from '@/db'
import { usersTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { Session } from 'next-auth'

export const getUserFromSession = async (session: Session | null) => {
  if (!session?.user?.email) {
    return null
  }
  const users = await db.select().from(usersTable).where(eq(usersTable.email, session.user.email)).limit(1)
  return users.length ? users[0] : null
}
