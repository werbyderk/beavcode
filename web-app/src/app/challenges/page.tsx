import dayjs from 'dayjs'

import { getServerSession } from '@/lib/auth'
import { getAllChallenges, groupChallengesByDate } from '@/models/challenge'
import { getUserFromSession } from '@/models/user'

import ChallengeLink from './components/ChallengeLink'

const Challenges = async () => {
  const session = await getServerSession()
  const user = await getUserFromSession(session)

  const challengesByDate = groupChallengesByDate(await getAllChallenges(user?.id))

  return (
    <main className='max-w-6xl mx-auto p-8'>
      <div>
        <h1 className='text-4xl font-bold mb-2'>All Challenges</h1>
        <p className='italic mb-4'>New Problems every Monday</p>
      </div>
      <div className='gap-4 mb-12'>
        {Object.entries(challengesByDate)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([year, months]) => (
            <div key={year}>
              <h2 className='text-2xl font-semibold'>{year}</h2>
              {Object.entries(months)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([monthNumber, month]) => (
                  <div key={monthNumber} className='pl-6'>
                    <h3 className='underline'>{dayjs().month(Number(monthNumber)).format('MMMM')}</h3>
                    {Object.entries(month)
                      .sort(([a], [b]) => Number(b) - Number(a))
                      .map(([weekNumber, dataRows]) => (
                        <div key={weekNumber} className='pl-4'>
                          <h4 className='font-normal'>Week {weekNumber}</h4>
                          {dataRows.map(({ challenges, user_submissions }) => (
                            <div key={challenges.id} className='my-1'>
                              <ChallengeLink challenge={challenges} userSubmission={user_submissions} />
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          ))}
      </div>
    </main>
  )
}

export default Challenges
