import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getServerSession } from '@/lib/auth'

export default async function Home() {
  const session = await getServerSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className='min-h-screen flex flex-col items-center justify-center p-8 bg-background'>
      <div className='max-w-2xl text-center space-y-8'>
        <h1 className='text-6xl font-bold tracking-tighter'>Weekly Coding Challenges</h1>

        <p className='text-xl text-foreground/80'>
          Improve your programming skills with daily challenges. Track your progress and compete with others.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link
            href='/dashboard'
            className='inline-flex h-11 items-center justify-center rounded-md bg-foreground px-8 text-sm font-medium text-background hover:bg-foreground/90'
          >
            Get Started
          </Link>

          <Link
            href='/challenges'
            className='inline-flex h-11 items-center justify-center rounded-md border border-foreground px-8 text-sm font-medium text-foreground hover:bg-foreground/10'
          >
            View Challenges
          </Link>
        </div>
      </div>
    </main>
  )
}
