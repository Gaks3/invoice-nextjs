import { redirect } from 'next/navigation'
import { auth } from './auth'

export async function requireUser() {
  const session = await auth()

  if (!session?.user) return redirect('/login')

  return session
}

export async function nonAuthenticatedPage() {
  const session = await auth()

  if (session?.user) return redirect('/dashboard')
}
