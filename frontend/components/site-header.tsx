"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Search } from "lucide-react"
import { useAuth } from "@/lib/auth"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const { isAuthenticated } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    if (isHomePage) {
      window.addEventListener("scroll", handleScroll)
      handleScroll() // Check initial scroll position
    }

    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHomePage])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isHomePage
          ? isScrolled
            ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            : "bg-transparent"
          : "bg-background border-b",
      )}
    >
      <div className="container mx-auto max-w-7xl flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package className={cn("h-6 w-6", isHomePage && !isScrolled && "text-white")} />
          <span className={cn(isHomePage && !isScrolled && "text-white")}>FSHN Post</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            className={cn(
              "transition-colors",
              isHomePage && !isScrolled && "text-white hover:bg-white/20 hover:text-white",
            )}
          >
            <Link href="/track">
              <Search className="mr-2 h-4 w-4" />
              Track Package
            </Link>
          </Button>
          {!isAuthenticated ? (
            <Button
              asChild
              variant={isHomePage && !isScrolled ? "outline" : "default"}
              className={cn(isHomePage && !isScrolled && "border-white bg-white text-primary hover:bg-white/90")}
            >
              <Link href="/auth">Sign In</Link>
            </Button>
          ) : (
            <Button
              asChild
              variant={isHomePage && !isScrolled ? "outline" : "default"}
              className={cn(isHomePage && !isScrolled && "border-white bg-white text-primary hover:bg-white/90")}
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}

