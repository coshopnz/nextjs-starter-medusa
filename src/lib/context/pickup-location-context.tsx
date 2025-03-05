"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type PickupLocationContextType = {
  pickupLocation: string
  setPickupLocation: (location: string) => void
}

const PickupLocationContext = createContext<PickupLocationContextType | undefined>(undefined)

export const PickupLocationProvider = ({ children }: { children: ReactNode }) => {
  const [pickupLocation, setPickupLocation] = useState<string>("")

  // Initialize from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLocation = localStorage.getItem("selectedPickupLocation")
      if (storedLocation) {
        setPickupLocation(storedLocation)
      }
    }
  }, [])

  // Update localStorage when pickup location changes
  useEffect(() => {
    if (typeof window !== "undefined" && pickupLocation) {
      localStorage.setItem("selectedPickupLocation", pickupLocation)
    }
  }, [pickupLocation])

  return (
    <PickupLocationContext.Provider
      value={{
        pickupLocation,
        setPickupLocation
      }}
    >
      {children}
    </PickupLocationContext.Provider>
  )
}

export const usePickupLocation = () => {
  const context = useContext(PickupLocationContext)
  if (context === undefined) {
    throw new Error("usePickupLocation must be used within a PickupLocationProvider")
  }
  return context
} 