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
    return "Thursday 8:30am-10am and 5pm-6pm"
  }

  const pickupTime = getPickupTime(pickupLocation)

  if (!pickupLocation) {
    return null
  }

  return (
    <div className="mt-8 border-t pt-6">
      <Heading level="h2" className="text-2xl-regular mb-4">
        Pickup Information
      </Heading>
      
      {isManualPayment && (
        <Text className="mb-4 font-medium">
          Once your payment is received, your food bag(s) will be ready for pickup:
        </Text>
      )}
      
      <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-100">
        <div className="flex items-center mb-3">
          <div className="h-5 w-5 rounded-full bg-green-500 mr-2"></div>
          <Text className="font-medium text-lg">Location: {pickupLocation}</Text>
        </div>
        <div className="flex items-center mb-3">
          <div className="w-5 mr-2 flex justify-center">📅</div>
          <Text className="font-medium">
            Time: {pickupTime}
          </Text>
        </div>
        <div className="flex items-start">
          <div className="w-5 mr-2 flex justify-center mt-1">📝</div>
          <div>
            <Text className="font-medium">Important:</Text>
            <ul className="list-disc ml-5 mt-1">
              <li>
                <Text className="text-sm">
                  Please bring your order confirmation or ID when collecting.
                </Text>
              </li>
              <li>
                <Text className="text-sm">
                  Order #{order.display_id}
                </Text>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Text className="text-ui-fg-subtle text-sm font-medium">
        ⚠️ If you fail to pick up your order during the scheduled time, it will be donated to the Pataka Kai.
      </Text>
    </div>
  )
}

export default PickUpInfo 