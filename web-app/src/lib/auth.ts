import { getServerSession as _getServerSession } from 'next-auth'
import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { generateUsername } from 'unique-username-generator'

import { createUserIfNotExists } from '@/models/user'

export const authOptions: AuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    signIn: async ({ user }) => {
      try {
        await createUserIfNotExists({ email: user.email!, username: generateUsername(), name: user.name! })
        return true
      } catch (err) {
        debugger
        console.error(err)
        return false
      }
    }
  }
}

export const getServerSession = () => _getServerSession(authOptions)
