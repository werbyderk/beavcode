'use client'

import db from '@/db'
import { usersTable } from '@/db/schema'
import { getLeaderboard, Leaderboard } from '@/models/leaderboard'
import { InferSelectModel } from 'drizzle-orm'
import { useState } from 'react'

const Leaderboards = ({ monthLeaderboardData, user }: { monthLeaderboardData: Leaderboard; user: InferSelectModel<typeof usersTable> }) => {
  const [displayLB, setDisplayLB] = useState('month')
  const [lbData, setLBData] = useState<{ month: Leaderboard; all: Leaderboard }>({ month: monthLeaderboardData, all: [] })

  const onLeaderboardTimeViewChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const timespan = e.target.value
    if (timespan === 'all') {
      if (!lbData.all.length) {
        const fetchedLeaderboardData = await getLeaderboard('all')
        setLBData((prev) => ({ ...prev, all: fetchedLeaderboardData }))
      }
      setDisplayLB('all')
    } else {
      setDisplayLB('month')
    }
  }

  const renderNoData = () => {
    if (!lbData[displayLB].length) {
      return (
        <tr>
          <td colSpan={5}>
            <p className='text-center my-4'>No submissions yet</p>
          </td>
        </tr>
      )
    }
  }
  return (
    <section>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold'>Leaderboards</h2>
        <div className='bg-background border border-foreground/20 rounded-md px-4 py-2'>
          <select onChange={onLeaderboardTimeViewChange}>
            <option value='month'>Submissions: Last 30 Days</option>
            <option value='all'>Submissions: All Time</option>
          </select>
        </div>
      </div>
      <div className='overflow-hidden rounded-lg border border-foreground/10'>
        <table className='w-full'>
          <thead className='bg-foreground/5'>
            <tr>
              <th className='text-left p-4'>User</th>
              <th className='text-left p-4'>Avg Runtime</th>
              <th className='text-left p-4'>Avg Memory</th>
              <th className='text-left p-4'># Challenges Completed</th>
              <th className='text-left p-4'>Beav Score</th>
            </tr>
          </thead>
          <tbody>
            {lbData[displayLB].map((entry, i) => (
              <tr key={i} className={`border-t border-foreground/10 ${entry.userId === user.id ? 'bg-green-200' : ''}`}>
                <td className='p-4'>{entry.username + (entry.userId === user.id ? ' (you)' : '')}</td>
                <td className='p-4'>{entry.avgRuntime.toFixed(2)} ms</td>
                <td className='p-4'>{entry.avgMemory.toFixed(2)} MB</td>
                <td className='p-4'>{entry.challengesCompleted}</td>
                <td className='p-4'>{entry.beavScore}</td>
              </tr>
            ))}
            {renderNoData()}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Leaderboards
