"use client"

import { useEffect, useState } from "react"
import { Plus, Package, Truck, Clock, CheckCircle2, BarChart3, Loader2, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/auth"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardHeader } from "@/components/dashboard-header"
import { useDeliveries } from "@/lib/hooks/use-deliveries"
import NewDeliveryModal from "@/components/new-delivery-modal"
import { useToast } from "@/components/ui/use-toast"
import type { Delivery } from "@/types/api"

function getActionButtonProps(status: Delivery["status"]) {
  switch (status) {
    case "created":
      return {
        text: "Accept Delivery",
        variant: "default" as const,
      }
    case "accepted":
      return {
        text: "Accept in Post Office",
        variant: "default" as const,
      }
    case "in_post_office":
      return {
        text: "Send to Delivery",
        variant: "default" as const,
      }
    case "out_for_delivery":
      return {
        text: "Mark as Delivered",
        variant: "default" as const,
      }
    default:
      return null
  }
}

export default function DashboardContent() {
  const { user, profile, hasAnyRole } = useAuth()
  const { deliveries = [], isLoading, acceptDelivery, markDelivered } = useDeliveries()
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0,
  })
  const [isNewDeliveryModalOpen, setIsNewDeliveryModalOpen] = useState(false)
  const { toast } = useToast()

  // Debug log
  console.log("Current profile:", profile)
  console.log("Has employee/staff role:", hasAnyRole(["employee", "staff"]))

  useEffect(() => {
    const stats = deliveries.reduce(
      (acc, delivery) => {
        acc.total++
        switch (delivery.status?.toLowerCase()) {
          case "in_transit":
            acc.inTransit++
            break
          case "delivered":
            acc.delivered++
            break
          case "created":
            acc.pending++
            break
        }
        return acc
      },
      { total: 0, inTransit: 0, delivered: 0, pending: 0 },
    )
    setStats(stats)
  }, [deliveries])

  const handleDeliveryAction = async (deliveryId: number) => {
    try {
      setProcessingId(deliveryId)
      await acceptDelivery(deliveryId)
      toast({
        title: "Success",
        description: "Delivery status updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update delivery status",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const recentDeliveries = [...deliveries]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  const isEmployee = hasAnyRole(["employee", "staff", "admin"])

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back{user?.name ? `, ${user.name}` : ""}!</h1>
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
                  <TableHead>Tracking Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Notes</TableHead>
                  {isEmployee && <TableHead className="w-[200px]">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={isEmployee ? 5 : 4} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : recentDeliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isEmployee ? 5 : 4} className="text-center">
                      No deliveries found. Create your first delivery to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentDeliveries.map((delivery) => {
                    const actionProps = getActionButtonProps(delivery.status)

                    return (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-medium">{delivery.trackingNumber}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                delivery.status === "delivered"
                                  ? "bg-green-500"
                                  : delivery.status === "in_transit"
                                    ? "bg-blue-500"
                                    : delivery.status === "created"
                                      ? "bg-yellow-500"
                                      : "bg-blue-500"
                              }`}
                            />
                            <span className="capitalize">{delivery.status?.replace(/_/g, " ")}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(delivery.updatedAt).toLocaleString()}</TableCell>
                        <TableCell>{delivery.notes || "-"}</TableCell>
                        {isEmployee && (
                          <TableCell>
                            {actionProps && (
                              <Button
                                variant={actionProps.variant}
                                size="sm"
                                disabled={processingId === delivery.id}
                                onClick={() => delivery.id && handleDeliveryAction(delivery.id)}
                              >
                                {processingId === delivery.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    {actionProps.text}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </>
                                )}
                              </Button>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Delivery Distribution */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Status Distribution</CardTitle>
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
                          <span className="text-sm font-medium capitalize">{status.replace(/_/g, " ")}</span>
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

