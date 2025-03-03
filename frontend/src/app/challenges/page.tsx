import { getServerSession } from '@/lib/auth'
import { getAllChallenges, getAllChallengesWithUserSubmissions, groupChallengesByDate } from '@/models/challenge'
import { getUserFromSession } from '@/models/user'
import dayjs from 'dayjs'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCircle, faCircleNotch, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

const Challenges = async () => {
  const session = await getServerSession()
  const user = await getUserFromSession(session)

  const challengesWithUserSubmissions = user ? await getAllChallengesWithUserSubmissions(user.id) : undefined
  const challengesNoSubmissions = user ? undefined : (await getAllChallenges()).map((c) => ({ challenges: c }))
  const challengesMaybeSubmissions = (challengesWithUserSubmissions ?? challengesNoSubmissions)!
  const challengesByDate = groupChallengesByDate(challengesMaybeSubmissions)

  return (
    <main className='max-w-6xl mx-auto p-8'>
      <div className=''>
        <div>
          <h1 className='text-4xl font-bold mb-2'>All Challenges</h1>
          <p className='text-foreground/60'>New Problems every Wednesday 12pm EST</p>
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
                      <h3 className='underline'>
                        {dayjs()
                          .month(Number(monthNumber) - 1)
                          .format('MMMM')}
                      </h3>
                      {Object.entries(month)
                        .sort(([a], [b]) => Number(b) - Number(a))
                        .map(([weekNumber, dataRows]) => (
                          <div key={weekNumber} className='pl-4'>
                            <h4 className='font-normal'>Week {weekNumber}</h4>
                            {dataRows.map(({ challenges, user_submissions }) => (
                              <div key={challenges.id} className='my-1'>
                                <Link
                                  href={`/challenges/${challenges.id}`}
                                  className='hover:bg-blue-100 bg-opacity-0 rounded p-2 transition-colors duration-150 hover:bg-opacity-100 flex items-center w-fit'
                                >
                                  <span
                                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 ${
                                      challenges.difficulty === 'hard'
                                        ? 'bg-red-500'
                                        : challenges.difficulty === 'medium'
                                          ? 'bg-yellow-500'
                                          : 'bg-green-500'
                                    }`}
                                  >
                                    {user_submissions ? (
                                      <FontAwesomeIcon
                                        icon={user_submissions.completedChallenge ? faCheck : faCircleNotch}
                                        className='w-3 h-3'
                                      />
                                    ) : undefined}
                                  </span>
                                  <strong>{challenges.title}</strong>
                                </Link>
                              </div>
                            ))}
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            ))}
        </div>
      </div>
    </main>
  )
}

export default Challenges
