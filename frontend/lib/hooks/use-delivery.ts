"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import type { Delivery } from "@/types/api"
import { useToast } from "@/components/ui/use-toast"

export function useDelivery(trackingNumber: string) {
  const [delivery, setDelivery] = useState<Delivery | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchDelivery() {
      try {
        setIsLoading(true)
        const data = await api.deliveries.getByTracking(trackingNumber)
        setDelivery(data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch delivery")
        toast({
          title: "Error",
          description: "Failed to fetch delivery details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (trackingNumber) {
      fetchDelivery()
    }
  }, [trackingNumber, toast])

  return {
    delivery,
    isLoading,
    error,
  }
}

