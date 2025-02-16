import Link from "next/link"
import { ArrowRight, Package, Truck, Clock, MapPin, Search, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      {/* Hero Section */}
      <header className="relative pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source
              src="https://videos.pexels.com/video-files/6169116/6169116-uhd_3840_2160_25fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container relative mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center text-white">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Reliable Postal Services for Everyone</h1>
            <p className="mt-6 text-lg leading-8 text-white/90">
              Fast, secure, and efficient delivery solutions for all your shipping needs. Send packages worldwide with
              confidence.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 hover:text-primary/90 px-8">
                <Link href="/dashboard">Send Package</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="border-2 border-white bg-transparent text-white hover:bg-white/10 transition-colors px-8"
              >
                <Link href="/track">
                  <Search className="mr-2 h-4 w-4" />
                  Track Package
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section className="py-24">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">Our Services</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            We offer a wide range of postal and shipping services to meet all your delivery needs
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Package className="h-8 w-8 text-primary" />
                <CardTitle className="mt-4">Standard Delivery</CardTitle>
                <CardDescription>Reliable and cost-effective shipping for your regular packages</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                  <li>2-3 business days delivery</li>
                  <li>Package tracking</li>
                  <li>Up to 20kg weight limit</li>
                </ul>
                <Button className="mt-4 w-full" variant="outline">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Truck className="h-8 w-8 text-primary" />
                <CardTitle className="mt-4">Express Shipping</CardTitle>
                <CardDescription>Fast and guaranteed delivery for urgent packages</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                  <li>Next day delivery</li>
                  <li>Real-time tracking</li>
                  <li>Priority handling</li>
                </ul>
                <Button className="mt-4 w-full" variant="outline">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 text-primary" />
                <CardTitle className="mt-4">International Shipping</CardTitle>
                <CardDescription>Global delivery solutions for worldwide reach</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                  <li>Worldwide delivery</li>
                  <li>Customs handling</li>
                  <li>Multiple shipping speeds</li>
                </ul>
                <Button className="mt-4 w-full" variant="outline">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-24">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="flex items-start gap-4">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Our customer service team is available around the clock to assist you with any queries.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Secure Shipping</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your packages are fully insured and handled with utmost care throughout their journey.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Wide Coverage</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  With our extensive network, we deliver to virtually any location worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <div className="rounded-lg bg-primary px-6 py-16 text-center">
            <h2 className="text-3xl font-bold text-white">Ready to Ship?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
              Create an account today and get started with our easy-to-use shipping services.
            </p>
            <Button asChild size="lg" className="mt-8" variant="secondary">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container py-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="font-semibold">Company</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Services</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Tracking
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Support</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary">
                    Shipping Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center">
            <p className="text-sm text-muted-foreground">© 2024 FSHN Post. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

