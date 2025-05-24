"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button, Heading, Text } from "@medusajs/ui"
import { usePickupLocation } from "@lib/context/pickup-location-context"
import pickupLocationsData from "./pickup-locations.json"

// Define the type for pickup location
type PickupLocation = {
  id: string
  name: string
  description: string
  times: string
  area: string
}

const PickupLocationSelector = ({ countryCode }: { countryCode: string }) => {
  const { pickupLocation, setPickupLocation } = usePickupLocation()
  const [selectedLocation, setSelectedLocation] = useState<string>(pickupLocation || "")
  const router = useRouter()
  
  // Get locations from the imported JSON file
  const pickupLocations: PickupLocation[] = pickupLocationsData.locations

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
    <div className="container mx-auto max-w-4xl px-4">
      <div className="text-center mb-8 pt-8">
        <Text className="text-lg mb-2">
          A Community-run food network with local pickups every week.
        </Text>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-gray-100">
        <Heading level="h2" className="text-2xl mb-4 text-center">
          Choose Your Hub
        </Heading>
        
        <Text className="text-center mb-6">
          Select where you would like to pick up your order on Thursday 29th of May
        </Text>

        {/* Mobile-friendly scrollable container */}
        <div className="max-h-[70vh] overflow-y-auto pr-2 -mr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {pickupLocations.map((location) => (
              <div 
                key={location.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md flex flex-col ${
                  selectedLocation === location.name 
                    ? "border-2 border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleLocationSelect(location.name)}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Heading level="h3" className="text-lg">
                      {location.name}
                    </Heading>
                    <div className={`h-4 w-4 rounded-full ${
                      selectedLocation === location.name
                        ? "bg-blue-500"
                        : "bg-gray-200"
                    }`} />
                  </div>
                  <Text className="text-sm text-gray-600 mb-2">
                    {location.description}
                  </Text>
                  <div className="mt-2">
                    <Text className="text-xs font-medium text-gray-500 uppercase">
                      {location.area}
                    </Text>
                    <Text className="text-sm font-medium text-gray-700">
                      {location.times}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedLocation && (
          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleContinue}
              className="min-w-[200px] py-3 text-lg"
            >
              Continue to Store
            </Button>
          </div>
        )}

        {!selectedLocation && (
          <Text className="text-center text-gray-500 italic mt-4">
            Please select a pickup location to continue
          </Text>
        )}
      </div>
    </div>
  )
}

export default PickupLocationSelector 