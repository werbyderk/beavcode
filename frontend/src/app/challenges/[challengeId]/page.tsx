import { getServerSession } from '@/lib/auth'
import { getChallenge } from '@/models/challenge'
import { getUserFromSession } from '@/models/user'
import SessionProvider from '@/app/components/SessionProvider'
import TestSubmitChallenge from './components/TestSubmitChallenge'

const ChallengePage = async ({ params }) => {
  const { challengeId } = await params
  const challenge = await getChallenge(challengeId)

  return (
    <main className='min-h-screen flex flex-col items-center justify-center p-8 bg-background'>
      <div className='max-w-2xl text-center space-y-8'>
        <h1 className='text-4xl font-bold tracking-tighter'>{challenge?.title}</h1>

        <p>{challenge?.description}</p>
      </div>
      <SessionProvider>
        <TestSubmitChallenge />
      </SessionProvider>
    </main>
  )
}

export default ChallengePage
