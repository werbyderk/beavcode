import axios, { AxiosError } from 'axios'
import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'unauthed' }, { status: 401 })
    }

    const formData = await req.formData()
    try {
      const externalApiResponse = await axios.postForm(process.env.PYRUNNER_URL!, formData)

      const responseData = await externalApiResponse.data
      return NextResponse.json(responseData)
    } catch (err) {
      const axiosErr = err as AxiosError
      if (axiosErr.code == 'ERR_BAD_RESPONSE') {
        console.error('Failed to submit file: ', axiosErr.response?.data)
        return NextResponse.json({ error: 'Bad file' }, { status: 500 })
      } else {
        console.error('PyRunner down.', axiosErr.response?.data)
        return NextResponse.json({ error: 'Unavailable' }, { status: 503 })
      }
    }
  } catch (error) {
    console.error('Failed to forward submission: ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
