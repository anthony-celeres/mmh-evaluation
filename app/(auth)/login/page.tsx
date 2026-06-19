import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LoginForm } from './components/LoginForm'

const LoginPage = () => {
  return (
    <div className="flex min-h-dvh flex-col justify-start pt-16 sm:justify-center sm:pt-0 bg-background px-4 pb-10">
      <div className="w-full max-w-sm space-y-4 mx-auto">
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