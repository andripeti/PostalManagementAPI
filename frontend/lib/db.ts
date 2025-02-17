import { openDB, type DBSchema, type IDBPDatabase } from "idb"

interface PostalDB extends DBSchema {
  deliveries: {
    key: string
    value: {
      id: string
      type: "letter" | "parcel" | "box" | "pallet" | "other"
      description: string
      weight: number
      sender_id: string
      recipient_id: string
      tracking_number: string
      status: "pending" | "in_transit" | "delivered" | "returned"
      created_at: string
      updated_at: string
    }
  }
  users: {
    key: string
    value: {
      id: string
      email: string
      name: string
      addresses: Array<{
        id: string
        street: string
        city: string
        state: string
        country: string
        postal_code: string
        is_preferred: boolean
      }>
      created_at: string
      updated_at: string
    }
  }
}

let db: IDBPDatabase<PostalDB>

export async function initDB() {
  db = await openDB<PostalDB>("postal-db", 1, {
    upgrade(db) {
      db.createObjectStore("deliveries", { keyPath: "id" })
      db.createObjectStore("users", { keyPath: "id" })
    },
  })
}

export async function getDeliveries() {
  await initDB()
  return db.getAll("deliveries")
}

export async function addDelivery(delivery: PostalDB["deliveries"]["value"]) {
  await initDB()
  return db.add("deliveries", delivery)
}

export async function updateDelivery(delivery: PostalDB["deliveries"]["value"]) {
  await initDB()
  return db.put("deliveries", delivery)
}

export async function getUser(id: string) {
  await initDB()
  return db.get("users", id)
}

export async function updateUser(user: PostalDB["users"]["value"]) {
  await initDB()
  return db.put("users", user)
}

