"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button, Heading, Text } from "@medusajs/ui"
import { usePickupLocation } from "@lib/context/pickup-location-context"

const PickupLocationSelector = ({ countryCode }: { countryCode: string }) => {
  const { pickupLocation, setPickupLocation } = usePickupLocation()
  const [selectedLocation, setSelectedLocation] = useState<string>(pickupLocation || "")
  const router = useRouter()

  // Update local state when context changes
  useEffect(() => {
    if (pickupLocation && pickupLocation !== selectedLocation) {
      setSelectedLocation(pickupLocation)
    }
  }, [pickupLocation, selectedLocation])

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location)
    setPickupLocation(location)
  }

  const handleContinue = () => {
    // Navigate to the store page
    router.push(`/${countryCode}/store`)
  }

  return (
    <div className="my-12 mx-auto max-w-2xl p-6 bg-white rounded-lg shadow-md">
      <Heading level="h2" className="text-xl mb-4 text-center">
        Choose Your Pickup Location
      </Heading>
      
      <Text className="text-center mb-6">
        Select where you would like to pick up your order on Thursday
      </Text>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div 
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            selectedLocation === "Central Park Flats" 
              ? "border-2 border-blue-500 bg-blue-50" 
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => handleLocationSelect("Central Park Flats")}
        >
          <Heading level="h3" className="text-lg mb-2">
            Central Park Flats
          </Heading>
          <Text className="text-sm text-gray-600">
            Located in central Wellington, convenient for city workers.
          </Text>
          <Text className="text-sm font-medium mt-2">
            Pickup times: 8:30am-10am and 5pm-6pm
          </Text>
        </div>

        <div 
          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
            selectedLocation === "Karori Community Center" 
              ? "border-2 border-blue-500 bg-blue-50" 
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => handleLocationSelect("Karori Community Center")}
        >
          <Heading level="h3" className="text-lg mb-2">
            Karori Community Center
          </Heading>
          <Text className="text-sm text-gray-600">
            Located in Karori, perfect for local residents.
          </Text>
          <Text className="text-sm font-medium mt-2">
            Pickup times: 8:30am-10am and 5pm-6pm
          </Text>
        </div>
      </div>

      {selectedLocation && (
        <div className="flex justify-center">
          <Button 
            onClick={handleContinue}
            className="min-w-[200px]"
          >
            Continue to Store
          </Button>
        </div>
      )}

      {!selectedLocation && (
        <Text className="text-center text-gray-500 italic">
          Please select a pickup location to continue
        </Text>
      )}
    </div>
  )
}

export default PickupLocationSelector 