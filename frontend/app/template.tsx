"use client"

import type React from "react"

import { ToastProvider } from "@/components/ui/toast"

export default function Template({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>
}

