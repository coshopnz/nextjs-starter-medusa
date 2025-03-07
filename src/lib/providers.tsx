"use client"

import { ReactNode } from "react"
import { PickupLocationProvider } from "./context/pickup-location-context"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <PickupLocationProvider>
      {children}
    </PickupLocationProvider>
  )
} 