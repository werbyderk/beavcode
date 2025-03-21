'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const Timer = () => {
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
  }

  return <p className='fixed top-2 left-0 right-0 text-center text-xs'>{formatTime(timeElapsed)}</p>
}

export default Timer
