"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, ArrowRight, ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { addDelivery } from "@/lib/db"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup } from "@/components/ui/radio-group"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

const deliveryOptionsSchema = {
  standard: {
    name: "Standard Delivery",
    price: 10,
    time: "3-5 business days",
  },
  express: {
    name: "Express Delivery",
    price: 25,
    time: "1-2 business days",
  },
  priority: {
    name: "Priority Express",
    price: 45,
    time: "Next business day",
  },
}

const formSchema = z.object({
  // Step 1: Sender Details
  sender: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    address: z.object({
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      country: z.string().min(1, "Country is required"),
      postal_code: z.string().min(1, "Postal code is required"),
    }),
  }),
  // Step 2: Recipient Details
  recipient: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    address: z.object({
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      country: z.string().min(1, "Country is required"),
      postal_code: z.string().min(1, "Postal code is required"),
    }),
  }),
  // Step 3: Package Details
  package: z.object({
    type: z.enum(["letter", "parcel", "box", "pallet", "other"]),
    weight: z.string().transform(Number),
    dimensions: z.object({
      length: z.string().transform(Number),
      width: z.string().transform(Number),
      height: z.string().transform(Number),
    }),
    description: z.string().min(1, "Description is required"),
  }),
  // Step 4: Delivery Options
  delivery: z.object({
    option: z.enum(["standard", "express", "priority"]),
  }),
})

type FormSteps = "sender" | "recipient" | "package" | "review"

export default function NewDeliveryModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth()
  const [step, setStep] = useState<FormSteps>("sender")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sender: {
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          postal_code: "",
        },
      },
      recipient: {
        name: "",
        email: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          postal_code: "",
        },
      },
      package: {
        type: "parcel",
        weight: "",
        dimensions: {
          length: "",
          width: "",
          height: "",
        },
        description: "",
      },
      delivery: {
        option: "standard",
      },
    },
  })

  const calculateCost = (values: z.infer<typeof formSchema>) => {
    const basePrice = deliveryOptionsSchema[values.delivery.option].price
    const weight = Number(values.package.weight)
    const weightCost = weight * 2 // $2 per kg
    return basePrice + weightCost
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user?.sub) {
      toast({
        title: "Error",
        description: "You must be logged in to create a delivery",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const trackingNumber = `TR${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      const delivery = {
        id: crypto.randomUUID(),
        type: values.package.type,
        weight: Number(values.package.weight),
        description: values.package.description,
        sender_id: user.sub,
        recipient_id: crypto.randomUUID(),
        tracking_number: trackingNumber,
        status: "pending" as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      await addDelivery(delivery)

      toast({
        title: "Success",
        description: "Delivery created successfully",
      })

      router.refresh()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create delivery. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { id: "sender", name: "Sender Details" },
    { id: "recipient", name: "Recipient Details" },
    { id: "package", name: "Package Details" },
    { id: "review", name: "Review & Payment" },
  ]

  const nextStep = () => {
    if (step === "sender") setStep("recipient")
    else if (step === "recipient") setStep("package")
    else if (step === "package") setStep("review")
  }

  const prevStep = () => {
    if (step === "recipient") setStep("sender")
    else if (step === "package") setStep("recipient")
    else if (step === "review") setStep("package")
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Delivery</DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <nav aria-label="Progress" className="mb-4">
          <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
            {steps.map((stepItem, stepIdx) => (
              <li key={stepItem.name} className="md:flex-1">
                <div
                  className={cn(
                    "flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
                    step === stepItem.id
                      ? "border-primary"
                      : stepIdx < steps.findIndex((s) => s.id === step)
                        ? "border-primary"
                        : "border-muted",
                  )}
                >
                  <span className="text-sm font-medium">Step {stepIdx + 1}</span>
                  <span className="text-sm">{stepItem.name}</span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === "sender" && (
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="sender.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sender.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="sender.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sender.address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="sender.address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sender.address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="sender.address.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sender.address.postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {step === "recipient" && (
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="recipient.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recipient.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="recipient.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recipient.address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="recipient.address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recipient.address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="recipient.address.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recipient.address.postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {step === "package" && (
              <div className="grid gap-6">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="package.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select package type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="letter">Letter</SelectItem>
                            <SelectItem value="parcel">Parcel</SelectItem>
                            <SelectItem value="box">Box</SelectItem>
                            <SelectItem value="pallet">Pallet</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="package.weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="Enter weight" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <h4 className="text-sm font-medium mb-2">Dimensions (cm)</h4>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="package.dimensions.length"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Length</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" placeholder="Length" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="package.dimensions.width"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Width</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" placeholder="Width" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="package.dimensions.height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" placeholder="Height" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="package.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe your package" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {step === "review" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Delivery Options</h3>
                  <FormField
                    control={form.control}
                    name="delivery.option"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                            {Object.entries(deliveryOptionsSchema).map(([key, option]) => (
                              <div
                                key={key}
                                className={cn(
                                  "flex items-center justify-between space-x-3 space-y-0 rounded-md border p-4",
                                  field.value === key && "border-primary",
                                )}
                              >
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">{option.name}</FormLabel>
                                  <div className="text-[0.8rem] text-muted-foreground">
                                    Estimated delivery time: {option.time}
                                  </div>
                                </div>
                                <input
                                  type="radio"
                                  checked={field.value === key}
                                  value={key}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  className="h-4 w-4"
                                />
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="rounded-md border p-4 space-y-4">
                  <h3 className="font-medium">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base Price</span>
                      <span>${deliveryOptionsSchema[form.getValues("delivery.option")].price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Weight Cost ({form.getValues("package.weight")} kg)</span>
                      <span>${Number(form.getValues("package.weight")) * 2}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Total</span>
                      <span>${calculateCost(form.getValues())}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep} disabled={step === "sender"}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {step === "review" ? (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Complete Order
                    </>
                  )}
                </Button>
              ) : (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

