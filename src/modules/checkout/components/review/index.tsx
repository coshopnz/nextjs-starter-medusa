"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import { Cart } from "@medusajs/medusa"
import { useState } from "react"
import { useCheckout } from "../../context/checkout-context"

const Review = ({
  cart,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}) => {
  const searchParams = useSearchParams()
  const [pickupConfirmed, setPickupConfirmed] = useState(false)
  const { pickupLocation, setPickupLocation } = useCheckout()

  const isOpen = searchParams.get("step") === "review"

  // TODo remove paid by gift card logic
  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0
  
    
  // returns true if payment session is not null. !! used to convert payment session object to a boolean
  const previousStepsCompleted = !!cart.payment_session  

  // returns true if user selected manual payment option
  const isManualPayment = cart.payment_session?.provider_id === "manual"

  // Add minimum order check (cart.total is in cents, so 1000 = $10)
  const isOrderTotalValid = (cart.total ?? 0) >= 1000

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
          <div className="flex items-start w-full mb-6 gap-x-1">
            <div className="w-full">
              {isOrderTotalValid ? (
                <>
                  <Text className="mb-1 txt-medium-plus text-ui-fg-base font-normal">
                    Produce must be picked up at 8:30am-10am and 5pm-6pm on the Thursday the same week as your order is placed.
                  </Text>
                  
                  {/* Pickup Location Selection */}
                  <div className="my-4">
                    <Text className="mb-2 font-medium">Please select your pickup location:</Text>
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
                    {isOpen && pickupLocation === "" && (
                      <Text className="mt-1 text-sm text-ui-fg-error">
                        Please select a pickup location
                      </Text>
                    )}
                  </div>
                  
                  <Text>
                    Please confirm the notice below and then click the Place Order button to confirm your order. Information to complete your bank transfer will show once your order has been placed.
                  </Text>
                  {isManualPayment ? (
                    <>
                      <div className="flex items-center gap-x-2 mt-4">
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
                    </>
                  ) : (
                    <>
                      <Text>Details to pick up your order will show once your order has been placed.</Text>
                      <div className="flex items-center gap-x-2 mt-4">
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
                    </>
                  )}
                </>
              ) : (
                <Text className="mb-1 txt-medium-plus text-ui-fg-error">
                  Minimum order amount is $10. Please add more items to your cart.
                </Text>
              )}
            </div>
          </div>
          {isOrderTotalValid && pickupConfirmed && pickupLocation !== "" && (
            <PaymentButton cart={cart} data-testid="submit-order-button" />
          )}
        </>
      )}
    </div>
  )
}

export default Review
