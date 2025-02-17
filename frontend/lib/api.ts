const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

import type { Address, DeliveryFormDto, Office, DeliveryHistory } from "@/types/api"

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("auth_token")

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, await response.text())
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const api = {
  auth: {
    getUserInfo: () => fetchWithAuth("/api/AuthTest/user-info"),
    createProfile: () => fetchWithAuth("/api/AuthTest/profile", { method: "POST" }),
  },

  deliveries: {
    getAll: () => fetchWithAuth("/api/Delivery"),

    getByTracking: (trackingNumber: string): Promise<DeliveryHistory[]> =>
      fetchWithAuth(`/api/Delivery/${trackingNumber}`),

    create: (data: DeliveryFormDto) =>
      fetchWithAuth("/api/Delivery/create", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    accept: (id: number) =>
      fetchWithAuth(`/api/Delivery/${id}/accept`, {
        method: "POST",
      }),
  },

  addresses: {
    getAll: () => fetchWithAuth<Address[]>("/api/Address"),

    create: (data: Address) =>
      fetchWithAuth<Address>("/api/Address", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (data: Address) =>
      fetchWithAuth<Address>("/api/Address", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  offices: {
    get: (id: number) => fetchWithAuth<Office>(`/api/Office/${id}`),

    create: (data: Office) =>
      fetchWithAuth<Office>("/api/Office", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: number, data: Office) =>
      fetchWithAuth<Office>(`/api/Office/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: number) =>
      fetchWithAuth(`/api/Office/${id}`, {
        method: "DELETE",
      }),
  },
}

