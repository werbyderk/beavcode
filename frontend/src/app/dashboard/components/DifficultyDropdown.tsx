'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const DifficultyDropdown = () => {
  const router = useRouter()
  const [difficulty, setDifficulty] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDifficulty = event.target.value
    setDifficulty(selectedDifficulty)
    router.push(`/challenges/${selectedDifficulty.toLowerCase()}`)
  }

  return (
    <select
      value={difficulty}
      onChange={handleChange}
      className='inline-flex h-11 items-center justify-center rounded-md bg-foreground px-8 text-sm font-medium text-background hover:bg-foreground/90'
    >
      <option value='' disabled>
        View This Week's Challenges
      </option>
      <option value='Easy'>Easy</option>
      <option value='Medium'>Medium</option>
      <option value='Hard'>Hard</option>
    </select>
  )
}

export default DifficultyDropdown
