import { redirect } from 'next/navigation'

// Root page always redirects to /login.
// Once authenticated, the middleware will redirect to /dashboard.
export default function RootPage() {
  redirect('/login')
}
