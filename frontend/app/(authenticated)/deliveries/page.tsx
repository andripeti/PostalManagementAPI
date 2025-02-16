"use client"

import { useEffect, useState } from "react"
import { Package, ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard-header"
import { PackageTypeIcon } from "@/components/package-type-icon"
import { getDeliveries } from "@/lib/db"

type SortConfig = {
  key: keyof typeof sortOptions
  direction: "asc" | "desc"
}

const sortOptions = {
  created_at: (a: any, b: any, direction: "asc" | "desc") => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return direction === "asc" ? dateA - dateB : dateB - dateA
  },
  tracking_number: (a: any, b: any, direction: "asc" | "desc") => {
    return direction === "asc"
      ? a.tracking_number.localeCompare(b.tracking_number)
      : b.tracking_number.localeCompare(a.tracking_number)
  },
  type: (a: any, b: any, direction: "asc" | "desc") => {
    return direction === "asc" ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type)
  },
  status: (a: any, b: any, direction: "asc" | "desc") => {
    return direction === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
  },
  weight: (a: any, b: any, direction: "asc" | "desc") => {
    return direction === "asc" ? a.weight - b.weight : b.weight - a.weight
  },
}

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [filteredDeliveries, setFilteredDeliveries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "created_at",
    direction: "desc",
  })

  useEffect(() => {
    const loadDeliveries = async () => {
      try {
        const allDeliveries = await getDeliveries()
        setDeliveries(allDeliveries)
        setFilteredDeliveries(allDeliveries)
      } catch (error) {
        console.error("Failed to load deliveries:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDeliveries()
  }, [])

  useEffect(() => {
    let filtered = [...deliveries]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((delivery) => delivery.status === statusFilter)
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((delivery) => delivery.type === typeFilter)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (delivery) =>
          delivery.tracking_number.toLowerCase().includes(query) || delivery.description.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => sortOptions[sortConfig.key](a, b, sortConfig.direction))

    setFilteredDeliveries(filtered)
  }, [deliveries, searchQuery, statusFilter, typeFilter, sortConfig])

  const handleSort = (key: keyof typeof sortOptions) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Deliveries</h1>
            <p className="text-muted-foreground">Manage and track all your deliveries</p>
          </div>
          <Button>
            <Package className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Input
            placeholder="Search by tracking number or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:w-96"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="letter">Letter</SelectItem>
              <SelectItem value="parcel">Parcel</SelectItem>
              <SelectItem value="box">Box</SelectItem>
              <SelectItem value="pallet">Pallet</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("tracking_number")}>
                    Tracking Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("type")}>
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("status")}>
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("created_at")}>
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("weight")}>
                    Weight
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredDeliveries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No deliveries found
                  </TableCell>
                </TableRow>
              ) : (
                filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.tracking_number}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <PackageTypeIcon type={delivery.type} className="h-4 w-4" />
                        <span className="capitalize">{delivery.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            delivery.status === "delivered"
                              ? "bg-green-500"
                              : delivery.status === "in_transit"
                                ? "bg-blue-500"
                                : delivery.status === "returned"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                          }`}
                        />
                        <span className="capitalize">{delivery.status.replace("_", " ")}</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(delivery.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{delivery.weight}kg</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => window.open(`/track?id=${delivery.tracking_number}`)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Cancel Delivery</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}

