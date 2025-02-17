export interface Address {
  id?: number
  street: string
  city: string
  zip: string
  country?: string | null
  state?: string | null
  longitude?: number
  latitude?: number
  userId?: number
}

export interface DeliveryFormDto {
  // Required sender fields
  senderName: string
  senderPhone: string
  senderEmail: string
  // Optional sender address
  senderStreet?: string | null
  senderCity?: string | null
  senderState?: string | null
  senderCountry?: string | null
  senderZipCode?: string | null
  // Required recipient fields
  recipientName: string
  recipientPhone: string
  recipientEmail: string
  recipientStreet: string
  recipientCity: string
  recipientZipCode: string
  // Optional recipient fields
  recipientState?: string | null
  recipientCountry?: string | null
  // Required package fields
  packageType: string
  packageWeight: number
  // Optional package fields
  packageLength?: number
  packageWidth?: number
  packageHeight?: number
  notes?: string | null
}

export interface Office {
  id?: number
  name?: string | null
  addressId: number
  phone?: string | null
  type?: string | null
  address?: Address
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: "employee" | "customer" | "admin"
}

export interface Delivery {
  id?: number
  trackingNumber: string
  status: "created" | "accepted" | "in_post_office" | "in_transit" | "out_for_delivery" | "delivered"
  updatedAt: string
  notes?: string
}

export interface DeliveryHistory {
  id: number
  deliveryId: number
  holderId: number
  description: string
  status: "created" | "accepted" | "picked_up" | "in_post_office" | "out_for_delivery" | "delivered"
  createdAt: string
}

