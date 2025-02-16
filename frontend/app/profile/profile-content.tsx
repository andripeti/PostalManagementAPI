"use client"

import { useAuth } from "@/lib/auth"

export default function ProfileContent() {
  const { user: authUser } = useAuth()

  return (
    <div>
      {/* Profile content */}
      <h1>Profile</h1>
      <p>Welcome {authUser?.name}</p>
    </div>
  )
}

