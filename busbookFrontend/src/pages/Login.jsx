import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authAPI } from '../api/auth'
import { useAuthStore } from '../store/authStore'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const Login = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      setAuth(data.token, data.user)
      navigate('/search')
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Login failed')
    },
  })

  const onSubmit = (data) => {
    setError('')
    loginMutation.mutate(data)
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Login to BusBook</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            {...register('email')}
          />
          {errors.email && (
            <div className="form-error">{errors.email.message}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            {...register('password')}
          />
          {errors.password && (
            <div className="form-error">{errors.password.message}</div>
          )}
        </div>

        <button
          type="submit"
          className="form-button"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="form-link">
        Don't have an account? <Link to="/auth/signup">Sign up</Link>
      </div>
    </div>
  )
}

export default Login