import { headers } from "next/headers"
import { redirect } from "next/navigation"
import ProfileContent from "./profile-content"

export default function ProfilePage() {
  // Server-side auth check
  const headersList = headers()
  const authDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true"

  if (!authDisabled) {
    // Redirect to auth page if not authenticated
    redirect("/auth?returnTo=/profile")
  }

  return <ProfileContent />
}

