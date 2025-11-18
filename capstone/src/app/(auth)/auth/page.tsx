import { Suspense } from 'react'
import AuthPageClient from './auth-client'

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AuthPageClient />
    </Suspense>
  )
}
