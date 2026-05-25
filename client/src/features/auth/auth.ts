import { userSchema } from '@ntv/shared'
import { apiFetch, apiFetchJson } from '../../shared/lib/apiFetch'

export type { User } from '@ntv/shared'

export async function loginUser(email: string, password: string) {
  const data = await apiFetchJson<{ user: unknown }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  return userSchema.parse(data.user)
}

export async function registerUser(name: string, email: string, password: string) {
  const data = await apiFetchJson<{ user: unknown }>('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) })
  return userSchema.parse(data.user)
}

export async function logoutUser() {
  await apiFetch('/api/auth/logout', { method: 'POST' })
}
