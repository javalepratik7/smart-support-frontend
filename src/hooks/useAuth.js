import { useMutation } from '@tanstack/react-query'
import { api } from '../api/axios'
import { setCredentials } from '../features/authSlice'
import { store } from '../app/store'
import toast from 'react-hot-toast'

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      const { data } = await api.post('/auth/login', credentials)
      return data
    },
    onSuccess: (data) => {
      store.dispatch(setCredentials(data))
      toast.success('Login successful!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Login failed')
    }
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData) => {
      const { data } = await api.post('/auth/register', userData)
      return data
    },
    onSuccess: (data) => {
      toast.success('Registration successful! Please login.')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Registration failed')
    }
  })
}