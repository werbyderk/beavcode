'use server'
import { usersTable, userSubmissionsTable } from '@/db/schema'
import db from '@/db'
import { desc, eq, gte, avg, sum, max, countDistinct } from 'drizzle-orm'
import { epoch } from '@/lib/constants'

export type Leaderboard = Awaited<ReturnType<typeof getLeaderboard>>

export const getLeaderboard = async (timeframe: 'month' | 'all') => {
  const oneMonthAgo = new Date()
  oneMonthAgo.setUTCDate(oneMonthAgo.getUTCDate() - 30)

  // Single submission score = min(difficulty factor / (100 * runtime + memory), 1)
  // Total score = sum(submission_score)
  const submissions = await db
    .select({
      username: usersTable.username,
      userId: usersTable.id,
      challengesCompleted: countDistinct(userSubmissionsTable.id),
      avgRuntime: avg(userSubmissionsTable.runtimeDuration).mapWith(Number),
      avgMemory: avg(userSubmissionsTable.memoryUsage).mapWith(Number),
      beavScore: sum(userSubmissionsTable.score).mapWith(Number),
      lastSubmissionDate: max(userSubmissionsTable.latestSubmissionDate)
    })
    .from(userSubmissionsTable)
    .where(gte(userSubmissionsTable.latestSubmissionDate, timeframe === 'month' ? oneMonthAgo : epoch))
    .innerJoin(usersTable, eq(userSubmissionsTable.userId, usersTable.id))
    .groupBy(usersTable.id)
    .orderBy(desc(sum(userSubmissionsTable.score)))

  return submissions
}
