import { Inter } from "next/font/google"
import { Providers } from "./providers"
import "./globals.css"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "FSHN Post - Postal Services",
  description: "Fast, secure, and efficient delivery solutions for all your shipping needs.",
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}



import './globals.css'