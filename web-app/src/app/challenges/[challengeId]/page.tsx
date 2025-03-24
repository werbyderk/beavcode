import { getServerSession } from '@/lib/auth'
import { getChallenge } from '@/models/challenge'
import { getUserFromSession } from '@/models/user'
import SessionProvider from '@/app/components/SessionProvider'
import TestSubmitChallenge from './components/TestSubmitChallenge'
import { createSubmission, getSubmission } from '@/models/submissions'
import { Converter } from 'showdown'
import Timer from './components/Timer'

const ChallengePage = async ({ params }) => {
  const session = await getServerSession()
  const user = await getUserFromSession(session)
  const { challengeId } = await params
  const challenge = await getChallenge(challengeId)
  let submission = user ? await getSubmission(user.id, challengeId) : null
  if (user && !submission) {
    submission = await createSubmission({ userId: user.id, challengeId: challengeId })
  }
  if (!challenge?.testCaseSource) {
    return <p>Shucks.</p>
  }

  const converter = new Converter()
  const descriptionHtml = converter.makeHtml(atob(challenge?.description))

  return (
    <main className='flex flex-col p-8 bg-background'>
      <div className='w-2xl text-center space-y-8 mb-8'>
        <h1 className='text-4xl font-bold tracking-tighter mb-4'>{challenge?.title}</h1>
        {submission?.completedChallenge ? (
          <div className='text-green-600 text-sm bg-green-100 rounded text-center py-2 px-4 w-fit mx-auto'>
            <span>Looks like you&apos;ve completed this challenge already. If you want to take another crack, go for it.</span>
          </div>
        ) : undefined}
        <div className='whitespace-pre-line bg-slate-100 rounded p-4 text-left' dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
      </div>
      {user && submission ? (
        <TestSubmitChallenge
          userId={user.id}
          testCaseSourceCode={atob(challenge.testCaseSource)}
          challengeId={challenge.id}
          submissionId={submission.id}
        />
      ) : (
        <p className='text-center'>Hmm. You&apos;re not signed in, so you can&apos;t create a submission.</p>
      )}
    </main>
  )
}

export default ChallengePage
