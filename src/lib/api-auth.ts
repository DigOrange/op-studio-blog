import { NextResponse } from 'next/server'
import { getCurrentAdmin } from './session'

export async function requireAuth() {
  const admin = await getCurrentAdmin()

  if (!admin) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  return {
    authorized: true,
    admin,
  }
}
