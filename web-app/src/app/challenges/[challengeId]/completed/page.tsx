import { getServerSession } from '@/lib/auth'
import { getSubmission, getSubmissionRank, getSubmissionsForChallenge } from '@/models/submissions'
import { getUserFromSession } from '@/models/user'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const CompletedChallengePage = async ({ params }: any) => {
  const session = await getServerSession()
  const user = await getUserFromSession(session)

  if (!user) {
    redirect('/')
  }

  const { id: userId } = user
  const { challengeId } = await params
  const submission = await getSubmission(userId, challengeId)
  const allSubmissions = await getSubmissionsForChallenge(challengeId)
  if (!submission || !allSubmissions) {
    return <p>Hm, there&apos;s nothing to show here</p>
  }

  const { rank, total } = await getSubmissionRank(submission.score ?? 0, challengeId)

  const minutes = Math.floor((submission.timeTaken ?? 0) / 60)
  const seconds = (submission.timeTaken ?? 0) % 60

  return (
    <main className='p-8'>
      <h1 className='text-4xl font-bold text-center'>Well Done!</h1>
      <p className='text-center mb-8'>
        You ranked <strong>#{rank}</strong> out of {total} other users
      </p>
      <div className='flex flex-col px-16 space-y-8'>
        <table className='table-auto w-fit mx-auto'>
          <tbody>
            <tr>
              <td className='text-lg font-semibold pr-8'>Submission Score:</td>
              <td className='text-lg'>{submission.score}</td>
            </tr>
            <tr>
              <td className='text-lg font-semibold pr-8'>Attempts:</td>
              <td className='text-lg'>{submission.numberOfSubmissions}</td>
            </tr>
            <tr>
              <td className='text-lg font-semibold pr-8'>Runtime:</td>
              <td className='text-lg'>{submission.runtimeDuration} ms</td>
            </tr>
            <tr>
              <td className='text-lg font-semibold pr-8'>Memory Usage:</td>
              <td className='text-lg'>{submission.memoryUsage} MB</td>
            </tr>
            <tr>
              <td className='text-lg font-semibold pr-8'>Time taken:</td>
              <td className='text-lg'>
                {minutes}m {seconds}s
              </td>
            </tr>
          </tbody>
        </table>

        <div>
          <h2 className='text-2xl font-bold mb-2'>Leaderboards</h2>
          <table className='w-full rounded-lg bg-gray-100 max-h-[600px] overflow-y-auto'>
            <thead>
              <tr>
                <th className='text-left py-2 pl-2'>User</th>
                <th className='text-left py-2'>Runtime</th>
                <th className='text-left py-2'>Memory</th>
                <th className='text-left py-2'>Score</th>
              </tr>
            </thead>
            <tbody className='rounded'>
              {allSubmissions.map((submission, i) => (
                <tr key={i} className={`rounded-lg  m-2 ${submission.userId === userId ? 'bg-green-200' : ''}`}>
                  <td className={`rounded-l-md p-2 ${submission.userId === userId ? 'bg-green-200' : ''}`}>{submission.username}</td>
                  <td className=''>{submission.runtimeDuration} ms</td>
                  <td className=''>{submission.memoryUsage} MB</td>
                  <td className='rounded-r-md'>{submission.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

export default CompletedChallengePage
