import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthToken } from '@types'

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          })
          
          if (!response.ok) throw new Error('Login failed')
          
          const data = await response.json() as { access_token: string; user: User }
          set({ token: data.access_token, user: data.user, isLoading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed'
          set({ error: message, isLoading: false })
          throw error
        }
      },
      
      signup: async (email, password, name) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
          })
          
          if (!response.ok) throw new Error('Signup failed')
          
          const data = await response.json() as { access_token: string; user: User }
          set({ token: data.access_token, user: data.user, isLoading: false })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Signup failed'
          set({ error: message, isLoading: false })
          throw error
        }
      },
      
      logout: () => {
        set({ user: null, token: null, error: null })
      },
      
      isAuthenticated: () => {
        return get().token !== null && get().user !== null
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user })
    }
  )
)
