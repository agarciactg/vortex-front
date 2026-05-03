export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  role: 'admin' | 'agent' | 'viewer'
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}
