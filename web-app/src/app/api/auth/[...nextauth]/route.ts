import NextAuth from 'next-auth'
import 'dotenv/config'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
