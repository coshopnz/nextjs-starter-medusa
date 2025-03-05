"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import OrderSummary from "../order-summary"
import { useSearchParams } from "next/navigation"
import { Cart } from "@medusajs/medusa"
import { useState, useEffect } from "react"
import { useCheckout } from "../../context/checkout-context"
import { usePickupLocation } from "@lib/context/pickup-location-context"

const Review = ({
  cart,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}) => {
  const searchParams = useSearchParams()
  const [pickupConfirmed, setPickupConfirmed] = useState(false)
  const { pickupLocation, setPickupLocation } = useCheckout()
  const [previousLocation, setPreviousLocation] = useState<string | null>(null)
  const { pickupLocation: globalPickupLocation } = usePickupLocation()

  const isOpen = searchParams?.get("step") === "review"

  // TODo remove paid by gift card logic
  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0
  
    
  // returns true if payment session is not null. !! used to convert payment session object to a boolean
  const previousStepsCompleted = !!cart.payment_session  

  // returns true if user selected manual payment option
  const isManualPayment = cart.payment_session?.provider_id === "manual"

  // Add minimum order check (cart.total is in cents, so 1000 = $10)
  const isOrderTotalValid = (cart.total ?? 0) >= 1000

  // Check if the customer has a previously selected pickup location
  useEffect(() => {
    // If the user hasn't selected a location yet
    if (!pickupLocation) {
      // First check if there's a globally selected location
      if (globalPickupLocation) {
        setPickupLocation(globalPickupLocation)
      } 
      // Then try to get location from customer metadata (for logged-in users with accounts)
      else if (cart.customer && cart.customer.has_account && cart.customer.metadata) {
        const customerMetadata = cart.customer.metadata as Record<string, any>
        
        if (customerMetadata?.pickup_location) {
          setPreviousLocation(customerMetadata.pickup_location)
        }
      }
      
      // If there's a shipping address with a pickup location in address_2
      if (cart.shipping_address?.address_2 && cart.shipping_address.address_2.startsWith('Pickup: ')) {
        const extractedLocation = cart.shipping_address.address_2.replace('Pickup: ', '');
        setPickupLocation(extractedLocation);
      }
    }
  }, [cart.customer, cart.shipping_address, pickupLocation, setPickupLocation, globalPickupLocation]);

  // Use the previously saved location
  const handleUsePreviousLocation = () => {
    if (previousLocation) {
      setPickupLocation(previousLocation)
    }
  }

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Review
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          {/* Order Details Summary */}
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <Heading level="h3" className="text-lg mb-2">
              Order Details
            </Heading>
            
            {/* Pickup Location Review Section */}
            <div className="mb-4">
              <Text className="font-medium text-gray-700">Pickup Location:</Text>
              {pickupLocation ? (
                <div className="mt-1 flex items-center">
                  <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-2">
                    ✓ Selected
                  </div>
                  <Text className="font-bold">{pickupLocation}</Text>
                </div>
              ) : (
                <div className="mt-1 flex items-center">
                  <div className="bg-red-50 text-red-800 px-3 py-1 rounded-full text-sm font-medium mr-2">
                    Required
                  </div>
                  <Text>No pickup location selected</Text>
                </div>
              )}
              <Text className="text-xs text-gray-500 mt-1">
                Thursday pickup times: 8:30am-10am and 5pm-6pm
              </Text>
            </div>
            
            {/* Customer Details */}
            {cart.shipping_address && (
              <div className="mb-4">
                <Text className="font-medium text-gray-700">Customer:</Text>
                <Text>
                  {cart.shipping_address.first_name} {cart.shipping_address.last_name}
                </Text>
                <Text>{cart.email}</Text>
              </div>
            )}
            
            {/* Payment Method */}
            <div>
              <Text className="font-medium text-gray-700">Payment Method:</Text>
              <Text>
                {isManualPayment 
                  ? "Bank Transfer (details provided after order placement)" 
                  : cart.payment_session?.provider_id === "stripe"
                    ? "Credit Card"
                    : cart.payment_session?.provider_id === "paypal"
                      ? "PayPal"
                      : "Other"}
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="w-full">
              {isOrderTotalValid ? (
                <>
                  <Text className="mb-4 txt-medium-plus text-ui-fg-base font-normal">
                    Please select your pickup location and confirm the notice below before placing your order.
                  </Text>
                  
                  {/* Pickup Location Selection */}
                  <div className="my-4 p-4 border rounded-lg">
                    <Text className="mb-2 font-medium">Select Pickup Location:</Text>
                    
                    {/* Show previously selected location for logged-in customer */}
                    {previousLocation && !pickupLocation && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-md">
                        <Text className="text-sm">
                          You previously selected <strong>{previousLocation}</strong> as your pickup location.
                        </Text>
                        <button
                          onClick={handleUsePreviousLocation}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-1"
                          type="button"
                        >
                          Use this location again
                        </button>
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-2">
                        <input
                          type="radio"
                          id="location-central-park"
                          name="pickup-location"
                          value="Central Park Flats"
                          checked={pickupLocation === "Central Park Flats"}
                          onChange={(e) => setPickupLocation(e.target.value)}
                          className="h-4 w-4"
                          data-testid="pickup-location-central-park"
                        />
                        <label htmlFor="location-central-park" className="text-base text-gray-700">
                          Central Park Flats
                        </label>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <input
                          type="radio"
                          id="location-karori"
                          name="pickup-location"
                          value="Karori Community Center"
                          checked={pickupLocation === "Karori Community Center"}
                          onChange={(e) => setPickupLocation(e.target.value)}
                          className="h-4 w-4"
                          data-testid="pickup-location-karori"
                        />
                        <label htmlFor="location-karori" className="text-base text-gray-700">
                          Karori Community Center
                        </label>
                      </div>
                    </div>
                    {pickupLocation && (
                      <Text className="mt-2 text-sm text-ui-fg-base">
                        Your pickup location ({pickupLocation}) will be stored with your order details.
                        {cart.customer?.has_account && " It will also be saved for future orders."}
                      </Text>
                    )}
                    {isOpen && pickupLocation === "" && (
                      <Text className="mt-1 text-sm text-ui-fg-error">
                        Please select a pickup location
                      </Text>
                    )}
                  </div>
                  
                  <div className="mt-4 p-4 border rounded-lg">
                    <Text className="font-medium mb-2">Pickup Policy:</Text>
                    <Text className="mb-3">
                      Information to complete your bank transfer will show once your order has been placed.
                    </Text>
                    <div className="flex items-center gap-x-2 mt-2">
                      <input
                        type="checkbox"
                        id="pickup-confirmation"
                        checked={pickupConfirmed}
                        onChange={(e) => setPickupConfirmed(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="pickup-confirmation" className="text-base text-gray-700">
                        ⚠️ I understand that if I fail to pick up my order by 6pm, my order will be donated to the Pataka Kai and no refund will be given.
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                <Text className="mb-1 txt-medium-plus text-ui-fg-error">
                  Minimum order amount is $10. Please add more items to your cart.
                </Text>
              )}
            </div>
            
            {/* Order Summary */}
            <div>
              {pickupLocation && <OrderSummary cart={cart} pickupLocation={pickupLocation} />}
            </div>
          </div>
          
          {isOrderTotalValid && pickupConfirmed && pickupLocation !== "" && (
            <div className="flex justify-center mt-6">
              <PaymentButton cart={cart} data-testid="submit-order-button" />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Review
