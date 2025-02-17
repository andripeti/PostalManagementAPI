"use client"

import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import DashboardContent from "./dashboard-content"

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}

