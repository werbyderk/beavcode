import db from '@/db'
import { challengesTable, userSubmissionsTable } from '@/db/schema'
import { epoch } from '@/lib/constants'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { and, desc, eq, gte, InferSelectModel, lte } from 'drizzle-orm'

dayjs.extend(weekOfYear)

export const getChallenge = async (id: number) => {
  const query = await db.select().from(challengesTable).where(eq(challengesTable.id, id)).limit(1)
  if (query?.length) {
    return query[0]
  }
  return null
}

export const getChallengesForWeek = async ({ date, difficulty }: { date: Date; difficulty?: 'easy' | 'medium' | 'hard' }) => {
  const dateStart = date ? dayjs(date).startOf('week').toDate() : epoch
  const dateEnd = date ? dayjs(date).endOf('week').toDate() : new Date()
  const difficultyConstraint = difficulty ? eq(challengesTable.difficulty, difficulty) : undefined
  return await db
    .select()
    .from(challengesTable)
    .where(and(gte(challengesTable.releaseDate, dateStart), lte(challengesTable.releaseDate, dateEnd), difficultyConstraint))
}

export const getAllChallengesWithUserSubmissions = async (userId: number) => {
  return await db
    .select()
    .from(challengesTable)
    .leftJoin(userSubmissionsTable, and(eq(challengesTable.id, userSubmissionsTable.challengeId), eq(userSubmissionsTable.userId, userId)))
    .orderBy(desc(challengesTable.releaseDate))
}

export const getAllChallenges = async () => {
  return await db.select().from(challengesTable).orderBy(desc(challengesTable.releaseDate))
}

type ChallengeMaybeWithUserSubmission = {
  challenges: InferSelectModel<typeof challengesTable>
  user_submissions?: InferSelectModel<typeof userSubmissionsTable>
}
export const groupChallengesByDate = (rows: ChallengeMaybeWithUserSubmission[]) => {
  const groupedChallenges: { [year: number]: { [month: number]: { [week: number]: typeof rows } } } = {}

  rows.forEach((row) => {
    const releaseDate = dayjs(row.challenges.releaseDate)
    const year = releaseDate.year()
    const month = releaseDate.month()
    const week = releaseDate.week() - releaseDate.startOf('month').week() + 1

    if (!groupedChallenges[year]) {
      groupedChallenges[year] = {}
    }
    if (!groupedChallenges[year][month]) {
      groupedChallenges[year][month] = {}
    }
    if (!groupedChallenges[year][month][week]) {
      groupedChallenges[year][month][week] = []
    }

    groupedChallenges[year][month][week].push(row)
  })

  return groupedChallenges
}
