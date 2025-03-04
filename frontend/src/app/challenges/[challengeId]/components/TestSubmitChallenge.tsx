'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import axios from 'axios'
// TODO security :(
const TestSubmitChallenge = () => {
  const { data: session, status } = useSession()
  const [submittable, setSubmittable] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return
    }
    const file = event.target.files[0]
  }

  if (status === 'loading') {
    return <p>One sec...</p>
  }

  if (status !== 'authenticated') {
    return <></>
  }

  return (
    <>
      <div className='flex justify-between w-[420px]'>
        <input type='file' onChange={handleFileChange} className='hidden' id='fileInput' />
        <label htmlFor='fileInput' className='black-button !w-[180px] cursor-pointer'>
          Run Test Cases
        </label>
        <button className='black-button !w-[180px] disabled:opacity-50' disabled={!submittable}>
          Submit
        </button>
      </div>
      <p>Write your Python 3 solution in a code editor of your choice and upload here!</p>
    </>
  )
}

export default TestSubmitChallenge
