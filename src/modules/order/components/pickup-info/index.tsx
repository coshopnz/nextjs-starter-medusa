"use client"

import { Order } from "@medusajs/medusa"
import { Heading, Text } from "@medusajs/ui"

type PickUpInfoProps = {
  order: Order
}

const PickUpInfo = ({ order }: PickUpInfoProps) => {
  // Check if this is a manual payment
  const isManualPayment = order.payments[0]?.provider_id === "manual"

  // Extract pickup location from the shipping address's address_2 field
  const pickupLocation = order.shipping_address?.address_2?.replace("Pickup: ", "") || ""
  
  // Determine pickup times based on the location
  const getPickupTime = (location: string) => {
    if (location.includes("Karori")) {
      return "Thursday 5pm-6pm only"
    }
    return "Thursday 10am-12pm and 5pm-6pm"
  }

  const pickupTime = getPickupTime(pickupLocation)

  if (!pickupLocation) {
    return null
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
      <Heading level="h2" className="text-2xl-regular mb-4">
        Pickup Information
      </Heading>
      
      {isManualPayment && (
        <Text className="mb-4 font-medium">
          Once your payment is received, your order will be ready for pickup at the following location and times:
        </Text>
      )}
      
      <div className="bg-green-50 p-6 rounded-lg mb-4 border border-green-100">
        <div className="flex items-center mb-4">
          <div className="h-6 w-6 rounded-full bg-green-500 mr-3 flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
          <Text className="font-medium text-lg">Location: {pickupLocation}</Text>
        </div>
        <div className="flex items-center mb-4">
          <div className="w-6 mr-3 flex justify-center">📅</div>
          <Text className="font-medium">
            Time: {pickupTime}
          </Text>
        </div>
        <div className="flex items-start">
          <div className="w-6 mr-3 flex justify-center mt-1">📝</div>
          <div>
            <Text className="font-medium">Important:</Text>
            <ul className="list-disc ml-5 mt-2">
              <li>
                <Text className="text-sm mb-2">
                  Please note your order number for reference when collecting: #{order.display_id}
                </Text>
              </li>
              <li>
                <Text className="text-sm">
                  You will need to bring a bag or container to collect your order.
                </Text>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Text className="text-ui-fg-subtle text-sm font-medium p-3 bg-amber-50 rounded-lg border border-amber-100">
        ⚠️ If you fail to pick up your order during the scheduled time, it will be donated.
      </Text>
    </div>
  )
}

export default PickUpInfo