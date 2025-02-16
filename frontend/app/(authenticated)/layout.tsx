"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth"
import type React from "react"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // Only redirect if auth is enabled and user is not authenticated
    if (!isLoading && !isAuthenticated && process.env.NEXT_PUBLIC_DISABLE_AUTH !== "true") {
      router.push("/auth")
    }
  }, [isLoading, isAuthenticated, router])

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

  return null
}

