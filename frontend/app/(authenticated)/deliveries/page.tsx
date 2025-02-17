"use client"

import { RequireAuth } from "@/lib/auth"
import DeliveriesContent from "./deliveries-content"

export default function DeliveriesPage() {
  return (
    <RequireAuth allowedRoles={["employee", "admin"]}>
      <DeliveriesContent />
    </RequireAuth>
  )
}

