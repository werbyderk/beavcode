import ChallengeLink from '@/app/challenges/components/ChallengeLink'
import { getServerSession } from '@/lib/auth'
import { getChallengesForWeek } from '@/models/challenge'
import { getUserFromSession } from '@/models/user'

const CurrentWeekChallenges = async () => {
  const session = await getServerSession()
  const user = await getUserFromSession(session)
  const challenges = await getChallengesForWeek({ date: new Date(), userId: user?.id })

  return (
    <main className='max-w-6xl mx-auto p-8'>
      <div>
        <h1 className='text-4xl font-bold mb-2'>This Week&apos;s Challenges</h1>
        <p>New Problems every Monday</p>
        <p>Completing harder problems earns you a higher BeavScore 🦫</p>
      </div>
      <div className='gap-4 pt-4'>
        {challenges.map(({ challenges, user_submissions }) => (
          <div key={challenges.id} className='mb-2'>
            <h4>{challenges.difficulty.charAt(0).toUpperCase() + challenges.difficulty.slice(1)}</h4>
            <ChallengeLink challenge={challenges} userSubmission={user_submissions} />
          </div>
        ))}
      </div>
    </main>
  )
}

export default CurrentWeekChallenges
