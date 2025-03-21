'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import axios, { AxiosError } from 'axios'
import { Accordion, AccordionItem } from '@szhsin/react-accordion'
import chevron from '@/../public/chevron-down.svg'
import Image from 'next/image'
import { Session } from 'next-auth'
import { incrementSubmissionCount, updateSubmission } from '@/models/submissions'
import { redirect } from 'next/navigation'
import Timer from './Timer'

const AccordionHeader = ({ children }) => <div className='bg-red-300 text-red-600 py-2 px-8  rounded-md'>{children}</div>
const AItem = ({ header, ...rest }) => (
  <AccordionItem
    {...rest}
    header={({ state: { isEnter } }) => (
      <>
        {header}
        <Image
          height={20}
          width={20}
          className={`ml-auto transition-transform duration-200 ease-out ${isEnter && 'rotate-180'}`}
          src={'/chevron-down.svg'}
          alt='Chevron'
        />
      </>
    )}
    buttonProps={{
      className: ({ isEnter }) =>
        `transition-colors flex w-full p-4 text-left bg-red-300 hover:bg-red-400 rounded-t ${isEnter && 'bg-red-400'} ${!isEnter && 'rounded-b'}`
    }}
    panelProps={{ className: 'rounded-b' }}
  />
)

// TODO security :(
// TODO actually store test source code on pyrunner. Atrocious.
const TestSubmitChallenge = ({
  testCaseSourceCode,
  userId,
  submissionId,
  challengeId
}: {
  testCaseSourceCode: string
  submissionId: number
  challengeId: number
  userId: number
}) => {
  const [testStatus, setTestStatus] = useState({ isPending: false, success: false, runtime: 0, testFailures: [], runtimeErrors: [] })
  const [submitting, setSubmitting] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Upload file and run unit tests
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || testStatus.isPending) {
      ;(document.getElementById('file-upload')! as HTMLInputElement).value = ''
      return
    }
    const userSubmissionFile = event.target.files[0]
    const formData = new FormData()
    formData.append('submission', userSubmissionFile)
    formData.append('test', new Blob([testCaseSourceCode], { type: 'text/plain' }))
    setTestStatus((prev) => ({ ...prev, isPending: true }))
    const pendingToast = toast.loading('Running tests...')
    try {
      const testResponse = await axios.postForm('http://127.0.0.1:3001/run', formData)
      toast.dismiss(pendingToast)
      if (testResponse.status === 200) {
        setTestStatus((prev) => ({ ...prev, success: testResponse.data.test_success, runtime: testResponse.data.test_runtime ?? 0 }))
        await incrementSubmissionCount(submissionId)
        if (testResponse.data.test_success) {
          await updateSubmission(submissionId, {
            userId,
            challengeId,
            runtimeDuration: testResponse.data.test_runtime,
            memoryUsage: testResponse.data.mem_usage.toFixed(2)
          })
          toast.success('Nice! You passed all test cases and can submit your code.')
        } else {
          setTestStatus((prev) => ({ ...prev, testFailures: testResponse.data.failures, runtimeErrors: testResponse.data.errors }))
          toast.error('Darn. You missed some test cases, see below.')
        }
      } else {
        setTestStatus((prev) => ({ ...prev, isPending: false, success: false, testFailures: [], runtimeErrors: [] }))
        toast.error('Uh oh. Server has gone kaputz, try again later.')
      }
    } catch (err) {
      toast.dismiss(pendingToast)
      const axiosError = err as AxiosError
      if (axiosError.code == 'ERR_BAD_RESPONSE') {
        toast.error("We can't run your code, check your file or try again later.")
      } else {
        setTestStatus((prev) => ({ ...prev, isPending: false, success: false, testFailures: [], runtimeErrors: [] }))
        toast.error('Uh oh. Server has gone kaputz, try again later.')
      }
    }
    ;(document.getElementById('file-upload')! as HTMLInputElement).value = ''
    setTestStatus((prev) => ({ ...prev, isPending: false }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await updateSubmission(submissionId, { completedChallenge: true, timeTaken: timeElapsed })
    redirect(`/challenges/${challengeId}/completed?userId=${userId}`)
  }

  const renderTestErrors = () => {
    if (testStatus.success) {
      return
    }
    const { runtimeErrors: pythonErrors, testFailures } = testStatus

    return (
      <Accordion>
        {pythonErrors.length ? (
          <AItem header={`${pythonErrors.length} Runtime errors`}>
            {pythonErrors.map((pyErr, i) => (
              <div key={i} className='bg-red-200 rounded-b flex'>
                <span className='whitespace-pre-line mx-4 my-2'>{pyErr}</span>
              </div>
            ))}
          </AItem>
        ) : undefined}
        {testFailures.length ? (
          <AItem header={`${testFailures.length} Unittest errors`}>
            <div className='flex flex-col w-full'>
              {testFailures.map((failure, i) => (
                <div key={i} className='bg-red-200 rounded-b flex'>
                  <span className='whitespace-pre-line mx-4 my-2'>{failure}</span>
                </div>
              ))}
            </div>
          </AItem>
        ) : undefined}
      </Accordion>
    )
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
  }

  return (
    <section>
      <p className='fixed top-2 left-0 right-0 text-center text-xs'>{formatTime(timeElapsed)}</p>
      <div className='flex justify-between w-[420px] m-auto'>
        <input id='file-upload' type='file' onChange={handleFileChange} className='hidden' />
        <label
          htmlFor='file-upload'
          className='black-button !w-[180px] cursor-pointer'
          style={{ opacity: testStatus.isPending ? '50%' : '100%' }}
        >
          {testStatus.isPending ? 'One sec...' : 'Run Test Cases'}
        </label>
        <button
          className={`green-button !w-[180px] ${testStatus.success && 'border-green-300 text-green-600'}`}
          disabled={!testStatus.success}
          onClick={handleSubmit}
        >
          <span className='text-green-700 font-bold'>{submitting ? 'One sec...' : 'Submit'}</span>
        </button>
      </div>
      <p className='text-center my-8 text-xs'>
        Write your Python 3 solution in a code editor of your choice and upload here. You are timed based on time spent on this page; time
        will not deduct from your score.
      </p>
      {renderTestErrors()}
    </section>
  )
}

export default TestSubmitChallenge
