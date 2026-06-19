import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LoginForm } from './components/LoginForm'

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-10 px-4">
      <div className="w-full max-w-sm space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage