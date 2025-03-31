import { redirect } from 'next/navigation'

import { getServerSession } from '@/lib/auth'
import { getUserFromSession } from '@/models/user'

import ProfileForm from './components/profileForm'

const Profile = async () => {
  const session = await getServerSession()
  const user = await getUserFromSession(session)

  if (!user) {
    redirect('/')
  }

  return (
    <main className='p-8'>
      <h1>Profile settings</h1>
      <p className='italic mb-4'>Yes; many features to change here</p>
      <p>
        Your username: <strong>{user.username}</strong>
      </p>
      <ProfileForm userId={user.id} />
    </main>
  )
}

export default Profile
