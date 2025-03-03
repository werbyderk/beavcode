'use server'
import { usersTable, userSubmissionsTable } from '@/db/schema'
import db from '@/db'
import { eq, gte } from 'drizzle-orm'
import { epoch } from '@/lib/constants'

export type Leaderboard = Awaited<ReturnType<typeof getLeaderboard>>

export const getLeaderboard = async (timeframe: 'week' | 'all') => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setUTCDate(oneWeekAgo.getUTCDate() - 7)
  const submissions = await db
    .select({
      username: usersTable.username,
      challengesCompleted: userSubmissionsTable.id,
      avgRuntime: userSubmissionsTable.runtimeDuration,
      avgMemory: userSubmissionsTable.timeTaken,
      score: userSubmissionsTable.id // This is a placeholder - you might want to calculate score differently
    })
    .from(userSubmissionsTable)
    .where(gte(userSubmissionsTable.latestSubmissionDate, timeframe === 'week' ? oneWeekAgo : epoch))
    .innerJoin(usersTable, eq(userSubmissionsTable.userId, usersTable.id))
    // .groupBy(usersTable.username)
    .orderBy(userSubmissionsTable.latestSubmissionDate)
    .limit(50)

  return submissions
}
