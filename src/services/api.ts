import axios from 'axios'

const TOKEN_KEY = 'auth_token'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
      document.cookie = `${TOKEN_KEY}=; Max-Age=0; path=/`
      window.location.replace('/login')
    }
    return Promise.reject(error)
  }
)
