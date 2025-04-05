"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import OrderSummary from "../order-summary"
import { useSearchParams } from "next/navigation"
import { Cart } from "@medusajs/medusa"
import { useState, useEffect } from "react"
import { useCheckout } from "../../context/checkout-context"
import { usePickupLocation } from "@lib/context/pickup-location-context"
import { formatQuantityUnit } from "@modules/common/lib/format-quantity-unit"
import dynamic from "next/dynamic"
import pickupLocationsData from "../../../home/components/pickup-location-selector/pickup-locations.json"

// Import the ReviewLocationMap component dynamically with no SSR
const ReviewLocationMap = dynamic(
  () => import("../review-location-map/index"),
  { ssr: false }
)

const Review = ({
  cart,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}) => {
  const searchParams = useSearchParams()
  const { pickupLocation, setPickupLocation, donationConsent, setDonationConsent } = useCheckout()
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

  // Add minimum order check (cart.total is in cents, so 999 = $9.99)
  const isOrderTotalValid = (cart.total ?? 0) >= 999

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
          {/* Order Summary */}
          <div className="mb-6 p-6 border rounded-lg bg-gray-50">
            <Heading level="h3" className="text-xl mb-4 pb-3 border-b">
              Order Summary
            </Heading>
            
            {/* Pickup Location Section */}
            <div className="mb-6 pb-4 border-b">
              <div className="flex justify-between items-center mb-3">
                <Text className="font-medium text-gray-700">Select Pickup Location:</Text>
                {pickupLocation ? (
                  <div className="flex items-center">
                    <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      ✓ Location Selected
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="bg-red-50 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                      Required
                    </div>
                  </div>
                )}
              </div>
              
              {/* Previously selected location */}
              {previousLocation && !pickupLocation && (
                <div className="mb-3 p-3 bg-white rounded-md border">
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
              
              {/* Button-style location selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                {pickupLocationsData.locations.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => setPickupLocation(location.name)}
                    className={`p-4 rounded-md border transition-colors ${
                      pickupLocation === location.name
                        ? "border-2 border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                    data-testid={`pickup-location-${location.id}`}
                  >
                    <div className="flex items-start">
                      <div className={`h-5 w-5 rounded-full mr-3 mt-0.5 ${
                        pickupLocation === location.name
                          ? "bg-blue-500"
                          : "bg-gray-200"
                      }`}></div>
                      <div className="text-left">
                        <Text className="font-medium">{location.name}</Text>
                        <Text className="text-sm text-gray-600">
                          Thursday pickup: {location.times}
                        </Text>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Display the location map for the selected location */}
              {pickupLocation && (
                <div className="mt-4">
                  <ReviewLocationMap locationName={pickupLocation} height="250px" />
                </div>
              )}
            </div>
            
            {/* Items Summary */}
            {cart.items.length > 0 && (
              <div className="mb-6 pb-4 border-b">
                <Text className="font-medium text-gray-700 mb-3">Items</Text>
                <ul className="divide-y">
                  {cart.items.map((item) => (
                    <li key={item.id} className="py-2 flex justify-between">
                      <div>
                        <Text className="font-medium">{item.title}</Text>
                        <Text className="text-sm text-gray-500">
                          Quantity: {formatQuantityUnit(item.quantity, item.variant.product.weight)}
                        </Text>
                      </div>
                      <Text className="font-medium">
                        ${((item.total || 0) / 100).toFixed(2)}
                      </Text>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Customer Details */}
            {cart.shipping_address && (
              <div className="mb-6 pb-4 border-b">
                <Text className="font-medium text-gray-700 mb-2">Customer:</Text>
                <Text>
                  {cart.shipping_address.first_name} {cart.shipping_address.last_name}
                </Text>
                <Text>{cart.email}</Text>
              </div>
            )}
            
            {/* Payment Method */}
            <div className="mb-6 pb-4 border-b">
              <Text className="font-medium text-gray-700 mb-2">Payment Method:</Text>
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
            
            {/* Totals */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <Text>Subtotal</Text>
                <Text className="font-medium">${((cart.subtotal || 0) / 100).toFixed(2)}</Text>
              </div>
              
              {cart.discounts.length > 0 && (
                <div className="flex items-center justify-between mb-1 text-green-600">
                  <Text>Discounts</Text>
                  <Text>- ${((cart.discount_total || 0) / 100).toFixed(2)}</Text>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-1">
                <Text>Shipping</Text>
                <Text>${((cart.shipping_total || 0) / 100).toFixed(2)}</Text>
              </div>
              
              <div className="flex items-center justify-between mb-1">
                <Text>Tax</Text>
                <Text>${((cart.tax_total || 0) / 100).toFixed(2)}</Text>
              </div>
              
              <div className="flex items-center justify-between border-t mt-2 pt-2">
                <Text className="font-bold">Total</Text>
                <Text className="font-bold">${((cart.total || 0) / 100).toFixed(2)}</Text>
              </div>
            </div>
          </div>
          
          {/* Donation Consent Checkbox */}
          <div className="mb-6 p-4 border border-blue-300 rounded-lg bg-blue-50">
            <div className="flex flex-col space-y-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="donation-consent"
                  checked={donationConsent}
                  onChange={(e) => setDonationConsent(e.target.checked)}
                  className="mt-1 h-8 w-8 md:h-5 md:w-5 text-blue-600 border-blue-400 rounded focus:ring-blue-500 focus:ring-2"
                  data-testid="donation-consent-checkbox"
                />
                <Text className="ml-3 md:ml-2 text-gray-800">
                  I understand that Hauora Kai cannot store food after the pickup time and if I miss my pickup time, any food items will be donated.
                </Text>
              </div>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => setDonationConsent(true)}
                  className="ml-auto px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-testid="donation-consent-agree-button"
                >
                  I Agree
                </button>
              </div>
            </div>
          </div>
          
          {isOrderTotalValid && pickupLocation !== "" && donationConsent && (
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
