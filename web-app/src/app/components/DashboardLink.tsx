'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
