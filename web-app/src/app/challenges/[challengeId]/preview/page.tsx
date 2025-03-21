import { getServerSession } from '@/lib/auth'
import { getChallenge } from '@/models/challenge'
import { getSubmission } from '@/models/submissions'
import { getUserFromSession } from '@/models/user'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const ChallengePreview = async ({ params }) => {
  const { challengeId } = await params
  const session = await getServerSession()
  const user = await getUserFromSession(session)
  if (!user) {
    redirect('/')
  }
  const challenge = await getChallenge(challengeId)

  if (!challenge) {
    return <p>Oops, we couldn&apos;t find that</p>
  }
  const submission = await getSubmission(user.id, challengeId)

  return (
    <main className='p-8 space-y-8'>
      <h1 className='text-center'>{challenge?.title}</h1>
      {submission?.completedChallenge ? (
        <div className='flex'>
          <div className='bg-green-200 p-2 text-sm rounded text-center mx-auto'>
            <span>
              Looks like you have already completed this challenge. You can see your results{' '}
              <Link className='underline' href={`/challenges/${challengeId}/completed`}>
                here
              </Link>
            </span>
          </div>
        </div>
      ) : undefined}
      <p className='whitespace-pre-line mx-16 p-2 bg-slate-100 rounded'>
        {challenge.previewDescription ? atob(challenge.previewDescription) : 'Hm, nothing to show here'}
      </p>
      <div className='flex'>
        <Link className='black-button mx-auto' href={`/challenges/${challengeId}`}>
          Let&apos;s go
        </Link>
      </div>
    </main>
  )
}

export default ChallengePreview
