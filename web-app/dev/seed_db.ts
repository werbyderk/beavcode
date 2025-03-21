import { challengesTable, usersTable } from '@/db/schema'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '@/db/schema'
import { seed, reset } from 'drizzle-seed'
import fs from 'fs'
import dayjs from 'dayjs'

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
  console.log('Seeded users')

  // const users = await db.select({ id: usersTable.id }).from(usersTable)
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
    await db.insert(challengesTable).values({
      title: metadata.title,
      previewDescription: btoa(metadata.preview_description),
      releaseDate: day.toDate(),
      difficulty,
      description: btoa(markdown),
      testCaseSource: btoa(testSourceCode)
    })

    if (i % 3 == 2) {
      day.subtract(1, 'week')
    }
  }
}

main()
