"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import type { Delivery, DeliveryFormDto } from "@/types/api"
import { useToast } from "@/components/ui/use-toast"

export function useDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchDeliveries = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await api.deliveries.getAll()
      setDeliveries(data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch deliveries")
      toast({
        title: "Error",
        description: "Failed to fetch deliveries",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const createDelivery = useCallback(
    async (formData: DeliveryFormDto) => {
      try {
        const newDelivery = await api.deliveries.create(formData)
        setDeliveries((prev) => [...prev, newDelivery])
        toast({
          title: "Success",
          description: "Delivery created successfully",
        })
        return newDelivery
      } catch (err) {
        console.error("Create delivery error:", err)
        toast({
          title: "Error",
          description: "Failed to create delivery",
          variant: "destructive",
        })
        throw err
      }
    },
    [toast],
  )

  const acceptDelivery = useCallback(async (id: number) => {
    try {
      const updatedDelivery = await api.deliveries.accept(id)
      setDeliveries((prev) => prev.map((delivery) => (delivery.id === id ? updatedDelivery : delivery)))
      return updatedDelivery
    } catch (err) {
      console.error("Accept delivery error:", err)
      throw err
    }
  }, [])

  useEffect(() => {
    fetchDeliveries()
  }, [fetchDeliveries])

  return {
    deliveries,
    isLoading,
    error,
    refetch: fetchDeliveries,
    createDelivery,
    acceptDelivery,
  }
}

