"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button, Heading, Text } from "@medusajs/ui"
import { usePickupLocation } from "@lib/context/pickup-location-context"
import dynamic from "next/dynamic"

// Import the LocationMap component dynamically with no SSR to avoid Leaflet issues
const LocationMap = dynamic(
  () => import("../location-map"),
  { ssr: false }
)

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
        <Text className="text-lg mb-2">
          A Community-run food network with local pickups every week.
        </Text>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
        <Heading level="h2" className="text-2xl mb-6 text-center">
          Choose Your Hub
        </Heading>
        
        <Text className="text-center mb-8">
          Select where you would like to pick up your order on Thursday the 20th of March
        </Text>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 
            className={`border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md flex flex-col ${
              selectedLocation === "Central Park Apartments Community Room" 
                ? "border-2 border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleLocationSelect("Central Park Apartments Community Room")}
          >
            <div className="flex-1">
              <Heading level="h3" className="text-xl mb-3">
                Central Park Apartments Community Room
              </Heading>
              <Text className="text-gray-600 mb-3">
                Located in Mount Cook, Wellington, close to the CBD.
              </Text>
              <Text className="font-medium mb-4">
                Pickup times: 8:30am-10am and 5pm-6pm
              </Text>
            </div>
            <LocationMap locationName="Central Park Apartments Community Room" height="180px" />
          </div>

          <div 
            className={`border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md flex flex-col ${
              selectedLocation === "Karori Community Center" 
                ? "border-2 border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleLocationSelect("Karori Community Center")}
          >
            <div className="flex-1">
              <Heading level="h3" className="text-xl mb-3">
                Karori Community Center
              </Heading>
              <Text className="text-gray-600 mb-3">
                Located in Karori, perfect for local residents.
              </Text>
              <Text className="font-medium mb-4">
                Pickup time: 5pm-6pm
              </Text>
            </div>
            <LocationMap locationName="Karori Community Center" height="180px" />
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