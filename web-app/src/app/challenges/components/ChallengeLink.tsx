import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { InferSelectModel } from 'drizzle-orm'
import { challengesTable, userSubmissionsTable } from '@/db/schema'

const ChallengeLink = ({
  challenge,
  userSubmission
}: {
  challenge: InferSelectModel<typeof challengesTable>
  userSubmission?: InferSelectModel<typeof userSubmissionsTable> | null
}) => {
  return (
    <Link
      href={`/challenges/${challenge.id}/preview`}
      className='hover:bg-blue-100 bg-opacity-0 rounded p-2 transition-colors duration-150 hover:bg-opacity-100 flex items-center w-fit'
    >
      <span
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 ${
          challenge.difficulty === 'hard' ? 'bg-red-500' : challenge.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
        }`}
      >
        {userSubmission ? (
          <FontAwesomeIcon icon={userSubmission.completedChallenge ? faCheck : faCircleNotch} className='w-3 h-3' />
        ) : undefined}
      </span>
      <strong>{challenge.title}</strong>
    </Link>
  )
}

export default ChallengeLink
