"use client"

import React from "react"
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react"
import { api } from "./api"
import type { UserProfile } from "@/types/api"
import { Loader2 } from "lucide-react"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // If auth is disabled, render children directly
  if (process.env.NEXT_PUBLIC_DISABLE_AUTH === "true") {
    return children
  }

  // Get the current URL for the redirect
  const origin = typeof window !== "undefined" ? window.location.origin : ""

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ""}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ""}
      authorizationParams={{
        redirect_uri: origin,
        audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
        scope: "openid profile email roles",
      }}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  )
}

export function useAuth() {
  const auth0 = useAuth0()
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true)

  // Store the token in localStorage and create profile when authenticated
  React.useEffect(() => {
    let isMounted = true
    const loadProfile = async () => {
      if (!auth0.isAuthenticated || !auth0.getAccessTokenSilently) {
        setIsLoadingProfile(false)
        return
      }

      try {
        const token = await auth0.getAccessTokenSilently()
        localStorage.setItem("auth_token", token)

        // Create profile after successful authentication
        await api.auth.createProfile()
        const userInfo = await api.auth.getUserInfo()
        console.log("Raw API response:", userInfo) // Debug log

        if (!isMounted) return

        // Map the API response to our UserProfile interface
        // If the user ID is 1, force the role to be "employee"
        const mappedProfile: UserProfile = {
          id: userInfo.id.toString(),
          name: auth0.user?.name || "",
          email: auth0.user?.email || "",
          role: userInfo.id === 1 ? "employee" : userInfo.role,
        }

        console.log("Mapped profile:", mappedProfile) // Debug log

        // Store profile in localStorage for persistence
        localStorage.setItem("user_profile", JSON.stringify(mappedProfile))
        setProfile(mappedProfile)
      } catch (error) {
        console.error("Failed to load profile:", error)
        // Try to load profile from localStorage as fallback
        const storedProfile = localStorage.getItem("user_profile")
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile)
          // Check ID even when loading from localStorage
          if (parsedProfile.id === "1") {
            parsedProfile.role = "employee"
          }
          setProfile(parsedProfile)
        }
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false)
        }
      }
    }

    // Try to load profile from localStorage first
    const storedProfile = localStorage.getItem("user_profile")
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile)
      // Check ID when loading from localStorage
      if (parsedProfile.id === "1") {
        parsedProfile.role = "employee"
      }
      setProfile(parsedProfile)
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [auth0.isAuthenticated, auth0.getAccessTokenSilently, auth0.user?.email, auth0.user?.name])

  const hasRole = React.useCallback(
    (role: UserProfile["role"]) => {
      if (process.env.NEXT_PUBLIC_DISABLE_AUTH === "true") return true

      // Debug log
      console.log("Checking role:", role, "Current profile role:", profile?.role)
      console.log("Current profile ID:", profile?.id)

      // If ID is 1, always return true for "employee" role
      if (profile?.id === "1" && role === "employee") {
        return true
      }

      return profile?.role === role
    },
    [profile?.role, profile?.id],
  )

  const hasAnyRole = React.useCallback(
    (roles: UserProfile["role"][]) => {
      if (process.env.NEXT_PUBLIC_DISABLE_AUTH === "true") return true

      // Debug log
      console.log("Checking roles:", roles, "Current profile role:", profile?.role)
      console.log("Current profile ID:", profile?.id)

      // If ID is 1 and "employee" is in the roles array, return true
      if (profile?.id === "1" && roles.includes("employee")) {
        return true
      }

      return roles.some((role) => profile?.role === role)
    },
    [profile?.role, profile?.id],
  )

  const logout = React.useCallback(() => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_profile")
    auth0.logout()
  }, [auth0])

  if (process.env.NEXT_PUBLIC_DISABLE_AUTH === "true") {
    return {
      ...auth0,
      isAuthenticated: true,
      isLoading: false,
      user: {
        sub: "disabled-auth-user",
        name: "Test User",
        email: "test@example.com",
      },
      profile: {
        id: "disabled-auth-user",
        name: "Test User",
        email: "test@example.com",
        role: "employee",
      },
      hasRole,
      hasAnyRole,
      logout,
    }
  }

  return {
    ...auth0,
    profile,
    hasRole,
    hasAnyRole,
    isLoading: auth0.isLoading || isLoadingProfile,
    logout,
  }
}

export function RequireAuth({
  children,
  allowedRoles,
}: {
  children: React.ReactNode
  allowedRoles: UserProfile["role"][]
}) {
  const { isAuthenticated, isLoading, hasAnyRole, profile } = useAuth()

  // Debug logs
  console.log("RequireAuth - Current profile:", profile)
  console.log("RequireAuth - Allowed roles:", allowedRoles)
  console.log("RequireAuth - Is authenticated:", isAuthenticated)
  console.log("RequireAuth - Is loading:", isLoading)

  if (process.env.NEXT_PUBLIC_DISABLE_AUTH === "true") {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <div>Please log in to access this content.</div>
  }

  if (!hasAnyRole(allowedRoles)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Access Denied</h2>
          <p className="mt-2 text-muted-foreground">
            Current role: {profile?.role || "none"}
            <br />
            Required roles: {allowedRoles.join(", ")}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

