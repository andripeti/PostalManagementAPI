"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Package, Search, Loader2, ArrowRight, CheckCircle2, Truck, Box, Clock } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import type { DeliveryHistory } from "@/types/api"

function getStatusIcon(status: DeliveryHistory["status"]) {
  switch (status) {
    case "delivered":
      return <CheckCircle2 className="h-6 w-6 text-green-500" />
    case "out_for_delivery":
      return <Truck className="h-6 w-6 text-blue-500" />
    case "in_post_office":
      return <Box className="h-6 w-6 text-blue-500" />
    case "picked_up":
      return <Package className="h-6 w-6 text-blue-500" />
    case "accepted":
      return <CheckCircle2 className="h-6 w-6 text-blue-500" />
    default:
      return <Clock className="h-6 w-6 text-yellow-500" />
  }
}

export default function TrackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tracking, setTracking] = useState(searchParams.get("id") || "")
  const [history, setHistory] = useState<DeliveryHistory[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tracking) return

    setIsSearching(true)
    setError("")

    try {
      const data = await api.deliveries.getByTracking(tracking)
      setHistory(data)
      // Update URL with tracking number
      router.push(`/track?id=${tracking}`)
    } catch (err) {
      setError("No delivery found with this tracking number")
      setHistory([])
    } finally {
      setIsSearching(false)
    }
  }

  // Group history items by date
  const groupedHistory = history.reduce(
    (groups, item) => {
      const date = format(new Date(item.createdAt), "MMMM d, yyyy")
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(item)
      return groups
    },
    {} as Record<string, DeliveryHistory[]>,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Track Your Delivery</CardTitle>
            <CardDescription>Enter your tracking number to see the current status of your delivery</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter tracking number"
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button type="submit" disabled={isSearching || !tracking}>
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    Track
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {error ? (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">{error}</div>
            </CardContent>
          </Card>
        ) : history.length > 0 ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Delivery Status</CardTitle>
              <CardDescription>Latest status: {history[0].status.replace(/_/g, " ")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {Object.entries(groupedHistory).map(([date, items]) => (
                  <div key={date}>
                    <h3 className="mb-4 text-sm font-medium text-muted-foreground">{date}</h3>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-start gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                            {getStatusIcon(item.status)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium capitalize">{item.status.replace(/_/g, " ")}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(item.createdAt), "h:mm a")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}

