"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function TrackContent() {
  // Rest of the existing TrackPage component code...
  // Copy the entire content from the previous TrackPage component
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tracking, setTracking] = useState(searchParams.get("id") || "")
  const [delivery, setDelivery] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState("")

  // ... rest of the component implementation
  // (Copy all the existing code from the TrackPage component)
}

