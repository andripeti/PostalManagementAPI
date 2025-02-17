"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated && process.env.NEXT_PUBLIC_DISABLE_AUTH !== "true") {
      // Store the intended destination
      const currentPath = window.location.pathname
      router.push(`/auth?returnTo=${encodeURIComponent(currentPath)}`)
    }
  }, [isLoading, isAuthenticated, router])

  // Show loading state while checking auth
  if (isLoading && process.env.NEXT_PUBLIC_DISABLE_AUTH !== "true") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Allow access when auth is disabled or user is authenticated
  if (process.env.NEXT_PUBLIC_DISABLE_AUTH === "true" || isAuthenticated) {
    return children
  }

  // Return null while redirecting
  return null
}

