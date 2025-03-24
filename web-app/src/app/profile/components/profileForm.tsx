'use client'

import { updateUser } from '@/models/user'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const ProfileForm = ({ userId }: { userId: number }) => {
  const router = useRouter()

  const onSubmit = async () => {
    const usrnameInput = document.getElementById('username-input') as HTMLInputElement
    const newUsername = usrnameInput?.value
    if (newUsername) {
      try {
        await updateUser(userId, { username: newUsername })
        router.refresh()
        usrnameInput.value = ''
      } catch (err) {
        console.error(err)
        toast.error("Snap, we couldn't do that")
      }
    }
  }

  return (
    <section>
      <label>New username: </label>
      <input id='username-input'></input>
      <br />
      <button className='black-button' onClick={onSubmit}>
        Save
      </button>
    </section>
  )
}

export default ProfileForm
