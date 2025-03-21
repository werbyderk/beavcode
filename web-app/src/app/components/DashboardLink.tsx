'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const DashboardLink = () => {
  const pathname = usePathname()
  if (pathname !== '/dashboard') {
    return (
      <Link className='pl-8 text-orange-400 font-bold' href='/dashboard'>
        ⬅️ Dashboard
      </Link>
    )
  }
  return <></>
}

export default DashboardLink
