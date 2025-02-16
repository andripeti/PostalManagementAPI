import { Mail, Package, Box, Truck, HelpCircle } from "lucide-react"

type PackageType = "letter" | "parcel" | "box" | "pallet" | "other"

interface PackageTypeIconProps {
  type: PackageType
  className?: string
}

export function PackageTypeIcon({ type, className }: PackageTypeIconProps) {
  switch (type) {
    case "letter":
      return <Mail className={className} />
    case "parcel":
      return <Package className={className} />
    case "box":
      return <Box className={className} />
    case "pallet":
      return <Truck className={className} />
    default:
      return <HelpCircle className={className} />
  }
}

