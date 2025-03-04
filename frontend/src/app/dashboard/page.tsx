import { getServerSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import db from '@/db'
import { usersTable, challengesTable, userSubmissionsTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import DifficultyDropdown from './components/DifficultyDropdown'
import { Session } from 'next-auth'
import { getLeaderboard } from '@/models/leaderboard'
import Leaderboards from './components/Leaderboards'
import { getUserFromEmail } from '@/models/user'

const Dashboard = async () => {
  const session = await getServerSession()

  if (!session) {
    redirect('/api/auth/signin')
  }
  if (!session.user?.email) {
    redirect('api/auth/signout')
  }

  const [leaderboardData] = await Promise.all([getLeaderboard('all')])

  return (
    <main className='max-w-6xl mx-auto p-8'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-4xl font-bold mb-2'>Welcome, {session.user?.name?.split(' ')[0]}</h1>
          <p className='text-foreground/60'>New Problems every Wednesday 12pm EST</p>
        </div>
      </div>

      <div className='flex gap-4 mb-12'>
        <DifficultyDropdown />
        <Link href='/challenges' className='black-button hover:bg-foreground/10'>
          View all Challenges
        </Link>
      </div>

      <Leaderboards weekLeaderboardData={leaderboardData} />
    </main>
  )
}

export default Dashboard
