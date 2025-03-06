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
    <div className="container mx-auto max-w-2xl px-4">
      <div className="text-center mb-10">
        <Heading level="h1" className="text-3xl lg:text-4xl font-bold mb-4">
          Hauora Kai Karori
        </Heading>
        <Text className="text-lg mb-2">
          Community-run food coop with pickups every Thursday
        </Text>
        <Text className="text-md text-gray-600">
          Ordering is now open for Thursday 6th March pickup
        </Text>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
        <Heading level="h2" className="text-2xl mb-6 text-center">
          Choose Your Pickup Location
        </Heading>
        
        <Text className="text-center mb-8">
          Select where you would like to pick up your order on Thursday
        </Text>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 
            className={`border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
              selectedLocation === "Central Park Flats" 
                ? "border-2 border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleLocationSelect("Central Park Flats")}
          >
            <Heading level="h3" className="text-xl mb-3">
              Central Park Flats
            </Heading>
            <Text className="text-gray-600 mb-3">
              Located in central Wellington, convenient for city workers.
            </Text>
            <Text className="font-medium">
              Pickup times: 8:30am-10am and 5pm-6pm
            </Text>
          </div>

          <div 
            className={`border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
              selectedLocation === "Karori Community Center" 
                ? "border-2 border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleLocationSelect("Karori Community Center")}
          >
            <Heading level="h3" className="text-xl mb-3">
              Karori Community Center
            </Heading>
            <Text className="text-gray-600 mb-3">
              Located in Karori, perfect for local residents.
            </Text>
            <Text className="font-medium">
              Pickup times: 8:30am-10am and 5pm-6pm
            </Text>
          </div>
        </div>

        {selectedLocation && (
          <div className="flex justify-center mt-8">
            <Button 
              onClick={handleContinue}
              className="min-w-[200px] py-3 text-lg"
            >
              Continue to Store
            </Button>
          </div>
        )}

        {!selectedLocation && (
          <Text className="text-center text-gray-500 italic mt-6">
            Please select a pickup location to continue
          </Text>
        )}
      </div>
    </div>
  )
}

export default PickupLocationSelector 