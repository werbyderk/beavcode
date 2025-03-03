import { relations } from 'drizzle-orm'
import { integer, pgTable, varchar, pgEnum, date, text, primaryKey, boolean } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['user', 'admin'])

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar('username', { length: 20 }).notNull().unique(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  streakCount: integer('streak_count').default(0),
  role: roleEnum('role').notNull().default('user')
})

export const usersRelations = relations(usersTable, ({ many }) => ({
  submissions: many(userSubmissionsTable)
}))

export const challengeDifficultyEnum = pgEnum('challenge_difficulty', ['easy', 'medium', 'hard'])

export const challengesTable = pgTable('challenges', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  difficulty: challengeDifficultyEnum('difficulty').notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  description: varchar('description', { length: 5000 }).notNull(),
  // test case source code?
  testCaseSource: text('test_case_source'),
  releaseDate: date('release_date', { mode: 'date' }).notNull()
})

export const userSubmissionsTable = pgTable('user_submissions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull(),
  challengeId: integer('challenge_id').notNull(),
  completedChallenge: boolean('completed_challenge').notNull().default(false),
  runtimeDuration: integer('runtime_duration').notNull(),
  numberOfSubmissions: integer('number_of_submissions').default(0).notNull(),
  latestSubmissionDate: date('latest_submission_date', { mode: 'date' }).notNull(),
  timeTaken: integer('time_taken').notNull()
})

export const userSubmissionsRelations = relations(userSubmissionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userSubmissionsTable.userId],
    references: [usersTable.id]
  })
}))
