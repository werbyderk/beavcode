'use client'
import { signIn } from 'next-auth/react'

const SignIn = () => {
  return (
    <button
      onClick={() => signIn('google')}
      className='inline-flex h-8 items-center justify-center rounded-md border border-foreground px-2 text-sm font-medium text-foreground hover:bg-foreground/10'
    >
      Sign In
    </button>
  )
}

export default SignIn
