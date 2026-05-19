import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { registerSchema } from '@ntv/shared'
import { Route } from './register.route'
import { useAuthStore, registerUser } from '../index'

const validators = {
  name: ({ value }: { value: string }) => {
    if (!value) return undefined
    const result = registerSchema.shape.name.safeParse(value)
    return result.success ? undefined : result.error.issues[0]?.message
  },
  email: ({ value }: { value: string }) => {
    if (!value) return undefined
    const result = registerSchema.shape.email.safeParse(value)
    return result.success ? undefined : result.error.issues[0]?.message
  },
  password: ({ value }: { value: string }) => {
    if (!value) return undefined
    const result = registerSchema.shape.password.safeParse(value)
    return result.success ? undefined : result.error.issues[0]?.message
  },
}

export default function Register() {
  const navigate = useNavigate()
  const { redirect } = Route.useSearch()
  const setUser = useAuthStore((s) => s.setUser)
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { name: '', email: '', password: '' },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        const user = await registerUser(value.name, value.email, value.password)
        setUser(user)
        navigate({ to: redirect })
      } catch (err) {
        setError((err as Error).message)
      }
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}>
      <form.Field name="name" validators={{ onChange: validators.name }}>
        {(field) => (
          <>
            <input
              placeholder="Name"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors[0] && <p role="alert">{field.state.meta.errors[0]}</p>}
          </>
        )}
      </form.Field>
      <form.Field name="email" validators={{ onChange: validators.email }}>
        {(field) => (
          <>
            <input
              type="email"
              placeholder="Email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors[0] && <p role="alert">{field.state.meta.errors[0]}</p>}
          </>
        )}
      </form.Field>
      <form.Field name="password" validators={{ onChange: validators.password }}>
        {(field) => (
          <>
            <input
              type="password"
              placeholder="Password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors[0] && <p role="alert">{field.state.meta.errors[0]}</p>}
          </>
        )}
      </form.Field>
      {error && <p role="alert">{error}</p>}
      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registering…' : 'Register'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
