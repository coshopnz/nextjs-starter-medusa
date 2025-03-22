"use client"

import { Button, Heading, Text } from "@medusajs/ui"
import { usePickupLocation } from "@lib/context/pickup-location-context"
import { useRouter } from "next/navigation"


// Component not being used at the moment
//
// TODO: Remove this component

const Hero = () => {
  const { pickupLocation } = usePickupLocation()
  const router = useRouter()

  return (
    <div className="h-[40vh] w-full border-b border-ui-border-base relative bg-green-50">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-16 gap-6">
        <div>
          <Heading
            level="h1"
            className="text-3xl leading-8 text-ui-fg-base font-normal mb-2"
          >
            Hauora Kai Karori
          </Heading>
          <Heading
            level="h2"
            className="text-2xl leading-8 text-ui-fg-base font-normal mb-4"
          >
            Ordering Now Open For Thursday 27th March Pickup
          </Heading>
          <Text className="text-lg">
            Choose your preferred pickup location below to get started
          </Text>
        </div>
        
        {pickupLocation && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 max-w-md">
            <Text className="font-medium">Your selected pickup location:</Text>
            <Text className="text-lg font-bold mb-2">{pickupLocation}</Text>
            <Text className="text-sm text-gray-600 mb-3">8:30am-10am and 5pm-6pm on Thursday</Text>
            <Button 
              variant="secondary"
              onClick={() => router.push("/nz/store")}
              className="min-w-[200px]"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Hero
