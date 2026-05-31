import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { loginSchema, type User } from '@ntv/shared'
import { loginUser } from '../services/auth'
import { fieldValidator } from '../../../shared/lib/fieldValidator'

type Props = { onSuccess: (user: User) => void }

const validators = {
  email: fieldValidator(loginSchema.shape.email),
  password: fieldValidator(loginSchema.shape.password),
}

export default function LoginForm({ onSuccess }: Props) {
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        const user = await loginUser(value.email, value.password)
        onSuccess(user)
      } catch (err) {
        setError((err as Error).message)
      }
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}>
      <form.Field name="email" validators={{ onChange: validators.email }}>
        {(field) => (
          <>
            <input type="email" placeholder="Email" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
            {field.state.meta.errors[0] && <p role="alert">{field.state.meta.errors[0]}</p>}
          </>
        )}
      </form.Field>
      <form.Field name="password" validators={{ onChange: validators.password }}>
        {(field) => (
          <>
            <input type="password" placeholder="Password" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
            {field.state.meta.errors[0] && <p role="alert">{field.state.meta.errors[0]}</p>}
          </>
        )}
      </form.Field>
      {error && <p role="alert">{error}</p>}
      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in…' : 'Login'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
