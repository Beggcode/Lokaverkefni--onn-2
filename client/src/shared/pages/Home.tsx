import { useNavigate } from '@tanstack/react-router'
import { useAuthStore, logoutUser } from '../../features/auth'

export default function Home() {
  const navigate = useNavigate()
  const clearUser = useAuthStore((s) => s.clearUser)

  async function handleLogout() {
    await logoutUser()
    clearUser()
    navigate({ to: '/login' })
  }

  return (
    <div>
      <p>You are logged in</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
