// talks to the server
import { userSchema } from '@ntv/shared'

export type { User } from '@ntv/shared'

export async function loginUser(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Login failed')
  return userSchema.parse(data.user)
}

export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Register failed')
  return userSchema.parse(data.user)
}

export async function logoutUser() {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
}
