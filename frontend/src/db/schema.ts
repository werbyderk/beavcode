import { relations } from 'drizzle-orm'
import { integer, pgTable, varchar, pgEnum, date, text } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['user', 'admin'])

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 20 }).notNull().unique(),
  first_name: varchar({ length: 255 }).notNull(),
  last_name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  streak_count: integer().default(0),
  role: roleEnum().notNull().default('user')
})

export const usersRelations = relations(usersTable, ({ many }) => ({
  submissions: many(userSubmissions)
}))

export const challengeDifficultyEnum = pgEnum('challenge_difficulty', ['easy', 'medium', 'hard'])

export const challengesTable = pgTable('challenges', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  difficulty: challengeDifficultyEnum().notNull(),
  title: varchar({ length: 500 }).notNull(),
  description: varchar({ length: 5000 }).notNull(),
  // test case source code?
  testCaseSource: text(),
  releaseDate: date()
})

export const submissionStatusEnum = pgEnum('submission_status', ['complete', 'attempted'])

export const userSubmissions = pgTable('user_submissions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull(),
  challengeId: integer().notNull(),
  runtimeDuration: integer().notNull(),
  numberOfSubmissions: integer().default(0).notNull(),
  // last submission source code?
  timeTaken: integer().notNull()
})

export const userSubmissionsRelations = relations(userSubmissions, ({ one }) => ({
  user: one(usersTable, {
    fields: [userSubmissions.userId],
    references: [usersTable.id]
  })
}))
