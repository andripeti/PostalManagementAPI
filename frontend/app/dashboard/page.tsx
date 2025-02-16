"use client"

import { useEffect, useState } from "react"
import { Plus, Package, Truck, Clock, CheckCircle2, BarChart3 } from "lucide-react"
import { useAuth } from "@/lib/auth"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardHeader } from "@/components/dashboard-header"
import { PackageTypeIcon } from "@/components/package-type-icon"
import { getDeliveries } from "@/lib/db"
import NewDeliveryModal from "@/components/new-delivery-modal"

interface DeliveryStats {
  total: number
  inTransit: number
  delivered: number
  pending: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [stats, setStats] = useState<DeliveryStats>({
    total: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0,
  })
  const [isNewDeliveryModalOpen, setIsNewDeliveryModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDeliveries = async () => {
      try {
        const allDeliveries = await getDeliveries()
        setDeliveries(allDeliveries)

        // Calculate stats
        const stats = allDeliveries.reduce(
          (acc, delivery) => {
            acc.total++
            switch (delivery.status) {
              case "in_transit":
                acc.inTransit++
                break
              case "delivered":
                acc.delivered++
                break
              case "pending":
                acc.pending++
                break
            }
            return acc
          },
          { total: 0, inTransit: 0, delivered: 0, pending: 0 },
        )
        setStats(stats)
      } catch (error) {
        console.error("Failed to load deliveries:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDeliveries()
  }, [])

  const recentDeliveries = deliveries
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your deliveries today.</p>
          </div>
          <Button onClick={() => setIsNewDeliveryModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Delivery
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time deliveries</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inTransit}</div>
              <p className="text-xs text-muted-foreground">Packages on the move</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.delivered}</div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Deliveries */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Deliveries</CardTitle>
                <CardDescription>Your latest delivery activities</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/deliveries">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View All
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Tracking Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Weight</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : recentDeliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No deliveries found. Create your first delivery to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PackageTypeIcon type={delivery.type} className="h-4 w-4" />
                          <span className="capitalize">{delivery.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{delivery.tracking_number}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              delivery.status === "delivered"
                                ? "bg-green-500"
                                : delivery.status === "in_transit"
                                  ? "bg-blue-500"
                                  : "bg-yellow-500"
                            }`}
                          />
                          <span className="capitalize">{delivery.status.replace("_", " ")}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(delivery.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">{delivery.weight}kg</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Delivery Distribution */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Package Types</CardTitle>
              <CardDescription>Distribution of your package types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["letter", "parcel", "box", "pallet"].map((type) => {
                  const count = deliveries.filter((d) => d.type === type).length
                  const percentage = (count / stats.total) * 100 || 0
                  return (
                    <div key={type} className="flex items-center gap-4">
                      <PackageTypeIcon type={type as any} className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">{type}</span>
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Status</CardTitle>
              <CardDescription>Current status of all deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries({
                  pending: { icon: Clock, count: stats.pending },
                  in_transit: { icon: Truck, count: stats.inTransit },
                  delivered: { icon: CheckCircle2, count: stats.delivered },
                }).map(([status, { icon: Icon, count }]) => {
                  const percentage = (count / stats.total) * 100 || 0
                  return (
                    <div key={status} className="flex items-center gap-4">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">{status.replace("_", " ")}</span>
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {isNewDeliveryModalOpen && <NewDeliveryModal onClose={() => setIsNewDeliveryModalOpen(false)} />}
    </div>
  )
}

