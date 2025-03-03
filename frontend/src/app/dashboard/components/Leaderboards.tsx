'use client'

import db from '@/db'
import { getLeaderboard, Leaderboard } from '@/models/leaderboard'
import { useState } from 'react'

const Leaderboards = ({ weekLeaderboardData }: { weekLeaderboardData: Leaderboard }) => {
  console.debug('🚀 ~ weekLeaderboardData:', weekLeaderboardData)
  const [leaderboardData, setLeaderboardData] = useState(weekLeaderboardData)
  const [allLeaderboardData, setAllLeaderboardData] = useState<Leaderboard>([])

  const onLeaderboardTimeViewChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const timespan = e.target.value
    if (timespan === 'all') {
      const fetchedLeaderboardData = allLeaderboardData.length ? allLeaderboardData : await getLeaderboard('all')
      setLeaderboardData(fetchedLeaderboardData)
    } else {
      setLeaderboardData(weekLeaderboardData)
    }
  }
  return (
    <section>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold'>Leaderboards</h2>
        <select className='bg-background border border-foreground/20 rounded-md px-4 py-2' onChange={onLeaderboardTimeViewChange}>
          <option value='week'>This Week</option>
          <option value='all'>All Time</option>
        </select>
      </div>

      <div className='overflow-hidden rounded-lg border border-foreground/10'>
        <table className='w-full'>
          <thead className='bg-foreground/5'>
            <tr>
              <th className='text-left p-4'>User</th>
              <th className='text-left p-4'>Runtime</th>
              <th className='text-left p-4'>Memory</th>
              <th className='text-left p-4'># Challenges Completed</th>
              <th className='text-left p-4'>Beav Score</th>
            </tr>
          </thead>
          <tbody>
            {weekLeaderboardData?.map((entry, i) => (
              <tr key={i} className='border-t border-foreground/10'>
                <td className='p-4'>{entry.username}</td>
                <td className='p-4'>{entry.avgRuntime}ms</td>
                <td className='p-4'>{entry.avgMemory}mb</td>
                <td className='p-4'>{entry.challengesCompleted}</td>
                <td className='p-4'>{entry.score.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Leaderboards
