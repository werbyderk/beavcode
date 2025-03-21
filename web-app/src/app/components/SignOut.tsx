'use client'
import { signOut } from 'next-auth/react'

const SignOut = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className='inline-flex h-8 items-center justify-center rounded-md border border-foreground px-2 text-sm font-medium text-foreground hover:bg-foreground/10'
    >
      Sign Out
    </button>
  )
}

export default SignOut
