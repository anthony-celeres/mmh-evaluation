"use client";

import { useState, useEffect } from "react"
import { useFormState } from "react-dom"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/auth-actions"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import InteractiveLogo from "@/components/InteractiveLogo"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction] = useFormState(login, null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (state?.error) {
      setIsLoading(false)
    }
  }, [state])

  return (
    <Card className="mx-auto w-full max-w-sm border-border bg-card shadow-lg">
      <CardHeader className="space-y-1 flex flex-col items-center p-4 pb-2 sm:p-6">
        <InteractiveLogo width={80} height={80} className="mb-2 h-14 w-14 sm:h-20 sm:w-20 hover:scale-105 transition-transform duration-300" enableBubble />
        <CardTitle className="text-2xl font-bold text-foreground">Login</CardTitle>
        <CardDescription className="text-muted-foreground text-center">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <form
          action={formAction}
          onSubmit={() => setIsLoading(true)}
        >
            <div className="grid gap-4">
              {state?.error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-xs font-semibold text-destructive border border-destructive/20 text-center animate-in fade-in slide-in-from-top-1 duration-200">
                  {state.error}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
        </form>
      </CardContent>
    </Card>
  )
}
