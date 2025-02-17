"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth()
  const returnTo = searchParams.get("returnTo") || "/dashboard"

  useEffect(() => {
    // If auth is disabled, redirect to dashboard immediately
    if (process.env.NEXT_PUBLIC_DISABLE_AUTH === "true") {
      window.location.href = returnTo
      return
    }

    if (!isLoading) {
      if (isAuthenticated) {
        window.location.href = returnTo
      } else {
        loginWithRedirect({
          appState: { returnTo },
        })
      }
    }
  }, [isAuthenticated, isLoading, loginWithRedirect, returnTo])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
        <p className="mt-2 text-gray-600">Authenticating...</p>
      </div>
    </div>
  )
}

