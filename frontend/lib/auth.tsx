"use client"

import { Auth0Provider } from "@auth0/auth0-react"
import { useAuth0 } from "@auth0/auth0-react"
import type React from "react"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // If auth is disabled, render children directly
  if (process.env.NEXT_PUBLIC_DISABLE_AUTH === "true") {
    return children
  }

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ""}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ""}
      authorizationParams={{
        redirect_uri: typeof window !== "undefined" ? window.location.origin : "",
        audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
        scope: "openid profile email",
      }}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  )
}

// Custom hook to handle auth bypass
export function useAuth() {
  const auth0 = useAuth0()

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
    }
  }

  return auth0
}

