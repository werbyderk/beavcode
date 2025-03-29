import 'dotenv/config'

import dayjs from 'dayjs'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { reset,seed } from 'drizzle-seed'
import fs from 'fs'

import { challengesTable, usersTable, userSubmissionsTable } from '@/db/schema'
import * as schema from '@/db/schema'

const main = async () => {
  const db = drizzle({ connection: process.env.DATABASE_URL!, casing: 'snake_case' })
  await reset(db, schema)
  await seed(db, { usersTable }).refine((f) => ({
    usersTable: {
      columns: {
        streakCount: f.valuesFromArray({ values: [0] }),
        role: f.valuesFromArray({ values: ['user'] })
      }
    }
  }))

  // https://github.com/drizzle-team/drizzle-orm/issues/3915#issuecomment-2629330120
  await db.execute(sql`SELECT setval('users_id_seq', 10, true);`)
  console.log('Seeded users')

  const users = await db.select({ id: usersTable.id }).from(usersTable)
  const day = dayjs().startOf('week')
  for (let i = 0; i < 3; i++) {
    let difficulty = 'easy' as 'easy' | 'medium' | 'hard'
    switch (i % 3) {
      case 1:
        difficulty = 'medium'
        break
      case 2:
        difficulty = 'hard'
        break
    }

    const metadata = JSON.parse(await fs.promises.readFile(`dev/seed_data/challenges/${i}/challenge.json`, 'utf-8'))
    const markdown = await fs.promises.readFile(`dev/seed_data/challenges/${i}/challenge.md`, 'utf-8')
    const testSourceCode = await fs.promises.readFile(`dev/seed_data/challenges/${i}/challenge.py`, 'utf-8')
    console.log('Insert challenge ', i)
    const [challenge] = await db
      .insert(challengesTable)
      .values({
        title: metadata.title,
        previewDescription: btoa(metadata.preview_description),
        releaseDate: day.toDate(),
        difficulty,
        description: btoa(markdown),
        testCaseSource: btoa(testSourceCode)
      })
      .returning({ id: challengesTable.id })

    for (const { id: userId } of users) {
      await db.insert(userSubmissionsTable).values({
        userId,
        challengeId: challenge.id,
        completedChallenge: true,
        runtimeDuration: 100 + Math.ceil(Math.random() * 100),
        memoryUsage: String(Number(10 + Math.random() * 40).toFixed(2)),
        numberOfSubmissions: Math.ceil(Math.random() * 6),
        latestSubmissionDate: new Date(),
        timeTaken: 9999,
        score: Math.ceil(500 + Math.random() * 5000)
      })
    }

    if (i % 3 == 2) {
      day.subtract(1, 'week')
    }
  }
}

main()
