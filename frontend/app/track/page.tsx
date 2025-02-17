import { Suspense } from "react"
import TrackContent from "./track-content"
import { Loader2 } from "lucide-react"

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-2xl py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  )
}

