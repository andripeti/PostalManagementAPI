"use client"

import { TableHeader } from "@/components/ui/table"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { useDeliveries } from "@/lib/hooks/use-deliveries"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { Loader2, ArrowRight } from "lucide-react"
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

export default function DeliveriesContent() {
  const { isEmployee } = useAuth()
  const { deliveries, isLoading, acceptDelivery } = useDeliveries()
  const [processingId, setProcessingId] = useState<number | null>(null)
  const { toast } = useToast()

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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Deliveries</h1>
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated At</TableHead>
              {isEmployee && <TableHead className="w-[200px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveries.map((delivery) => {
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
            })}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

