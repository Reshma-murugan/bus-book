import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authAPI } from '../api/auth'
import { useAuthStore } from '../store/authStore'

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const Signup = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  })

  const signupMutation = useMutation({
    mutationFn: authAPI.signup,
    onSuccess: (data) => {
      setAuth(data.token, data.user)
      navigate('/search')
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Signup failed')
    },
  })

  const onSubmit = (data) => {
    setError('')
    signupMutation.mutate(data)
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Sign Up for BusBook</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className={`form-input ${errors.name ? 'error' : ''}`}
            {...register('name')}
          />
          {errors.name && (
            <div className="form-error">{errors.name.message}</div>
          )}
        </div>

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
          <label className="form-label">Phone (Optional)</label>
          <input
            type="tel"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            {...register('phone')}
          />
          {errors.phone && (
            <div className="form-error">{errors.phone.message}</div>
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
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="form-link">
        Already have an account? <Link to="/auth/login">Login</Link>
      </div>
    </div>
  )
}

export default Signup