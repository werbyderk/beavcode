import './globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css'

import { config } from '@fortawesome/fontawesome-svg-core'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Toaster } from 'react-hot-toast'

import { getServerSession } from '@/lib/auth'
import { getUserFromSession } from '@/models/user'

import DashboardLink from './components/DashboardLink'
import SignIn from './components/SignIn'
import SignOut from './components/SignOut'
config.autoAddCss = false

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession()
  const signedIn = !!session
  if (signedIn && !session.user?.email) {
    redirect('/api/auth/signout')
  }
  const userData = await getUserFromSession(session)

  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster />
        <header>
          <div className='flex items-center justify-between gap-4 px-8 pt-8'>
            <Link href='/' className='text-4xl font-bold text-orange-500'>
              BeavCode
            </Link>
            <div>
              {userData ? (
                <div className='flex gap-2'>
                  {userData?.streakCount ? <span>{userData.streakCount} Week Streak</span> : undefined}
                  <Link href='/profile'>
                    <Image
                      src={session?.user?.image || '/default-avatar.png'}
                      alt='Profile'
                      width={32}
                      height={32}
                      className='rounded-full hover:-translate-y-1 hover:ring-2 ring-black shadow-sm shadow-black transition-all'
                    />
                  </Link>
                  <SignOut />
                </div>
              ) : (
                <SignIn />
              )}
            </div>
          </div>
          {userData ? <DashboardLink /> : undefined}
        </header>
        {children}
      </body>
    </html>
  )
}
