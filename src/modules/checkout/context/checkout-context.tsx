"use client"

import { ReactNode, createContext, useContext, useState } from "react"

type CheckoutContextType = {
  pickupLocation: string
  setPickupLocation: (location: string) => void
  donationConsent: boolean
  setDonationConsent: (consent: boolean) => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [pickupLocation, setPickupLocation] = useState<string>("")
  const [donationConsent, setDonationConsent] = useState<boolean>(false)

  return (
    <CheckoutContext.Provider
      value={{
        pickupLocation,
        setPickupLocation,
        donationConsent,
        setDonationConsent
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}

export const useCheckout = () => {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider")
  }
  return context
} 