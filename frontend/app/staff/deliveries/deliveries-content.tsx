"use client"

import { useAuth } from "@/lib/auth"

export default function DeliveriesContent() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <p>Access denied</p>
  }

  // Rest of the existing DeliveriesPage component code...
  // Copy the entire content from the previous DeliveriesPage component
}

