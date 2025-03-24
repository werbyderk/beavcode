import { getServerSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getLeaderboard } from '@/models/leaderboard'
import Leaderboards from './components/Leaderboards'
import { getUserFromSession } from '@/models/user'

const Dashboard = async () => {
  const session = await getServerSession()
  const user = await getUserFromSession(session)
  if (!session) {
    redirect('/api/auth/signin')
  }
  if (!session.user?.email) {
    redirect('api/auth/signout')
  }

  const leaderboardData = await getLeaderboard('month')

  return (
    <main className='max-w-6xl mx-auto p-8'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-4xl font-bold mb-2'>Welcome, {session.user?.name?.split(' ')[0]}</h1>
          <p className='text-foreground/60'>New Problems every Monday</p>
        </div>
      </div>

      <div className='flex gap-4 mb-12'>
        <Link href='/challenges/current' className='black-button bg-orange-400 !border-orange-700 hover:bg-foreground/10'>
          View This Week&apos;s Challenges
        </Link>
        <Link href='/challenges' className='black-button hover:bg-foreground/10'>
          View all Challenges
        </Link>
      </div>

      <Leaderboards monthLeaderboardData={leaderboardData} user={user} />
    </main>
  )
}

export default Dashboard
