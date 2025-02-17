export type UserRole = "admin" | "staff" | "employee" | "customer"

// Role mappings for API responses
export const API_ROLE_MAPPINGS = {
  employee: ["employee", "staff"],
  admin: ["admin"],
  customer: ["customer"],
} as const

