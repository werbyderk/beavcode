'use server'

import { and, count, desc, eq, gt, InferInsertModel, InferSelectModel } from 'drizzle-orm'

import db from '@/db'
import { challengesTable, usersTable, userSubmissionsTable } from '@/db/schema'

const DIFFICULTY_MULTIPLIER = { easy: 100000, medium: 200000, hard: 350000 }

export const incrementSubmissionCount = async (submissionId: number) => {
  const existing = await db
    .select({ numSolutions: userSubmissionsTable.numberOfSubmissions })
    .from(userSubmissionsTable)
    .where(eq(userSubmissionsTable.id, submissionId))
    .limit(1)

  if (existing) {
    await db
      .update(userSubmissionsTable)
      .set({ numberOfSubmissions: existing[0].numSolutions! + 1 })
      .where(eq(userSubmissionsTable.id, submissionId))
    return true
  }
  return false
}

export const getSubmission = async (userId: number, challengeId: number) => {
  const query = await db
    .select()
    .from(userSubmissionsTable)
    .where(and(eq(userSubmissionsTable.userId, userId), eq(userSubmissionsTable.challengeId, challengeId)))
  if (query) {
    return query[0]
  }
  return null
}

export const getSubmissionRank = async (score: number, challengeId: number) => {
  const [{ rank }] = await db
    .select({ rank: count() })
    .from(userSubmissionsTable)
    .where(and(gt(userSubmissionsTable.score, score), eq(userSubmissionsTable.challengeId, challengeId)))
  const [{ total }] = await db
    .select({ total: count() })
    .from(userSubmissionsTable)
    .where(eq(userSubmissionsTable.challengeId, challengeId))
  return { rank: rank + 1, total }
}
export const getSubmissionsForChallenge = async (challengeId: number) => {
  return await db
    .select({
      userId: usersTable.id,
      username: usersTable.username,
      score: userSubmissionsTable.score,
      memoryUsage: userSubmissionsTable.memoryUsage,
      runtimeDuration: userSubmissionsTable.runtimeDuration
    })
    .from(userSubmissionsTable)
    .where(eq(userSubmissionsTable.challengeId, challengeId))
    .leftJoin(usersTable, eq(userSubmissionsTable.userId, usersTable.id))
    .orderBy(desc(userSubmissionsTable.score))
}

export const createSubmission = async (submission: InferInsertModel<typeof userSubmissionsTable>) => {
  return (await db.insert(userSubmissionsTable).values(submission).returning())[0]
}

export const updateSubmission = async (submissionId: number, submission: Partial<InferSelectModel<typeof userSubmissionsTable>>) => {
  const [{ challengeId }] = submission.challengeId
    ? [{ challengeId: submission.challengeId }]
    : await db
        .select({ challengeId: userSubmissionsTable.challengeId })
        .from(userSubmissionsTable)
        .where(eq(userSubmissionsTable.id, submissionId))
  const [{ difficulty }] = await db
    .select({ difficulty: challengesTable.difficulty })
    .from(challengesTable)
    .where(eq(challengesTable.id, challengeId))
  submission.latestSubmissionDate = new Date()
  submission.score =
    typeof submission.runtimeDuration === 'number' && submission.memoryUsage
      ? Math.floor(DIFFICULTY_MULTIPLIER[difficulty] / Math.max(submission.runtimeDuration, 1) + Number(submission.memoryUsage))
      : undefined
  await db.update(userSubmissionsTable).set(submission).where(eq(userSubmissionsTable.id, submissionId))
  return true
}
