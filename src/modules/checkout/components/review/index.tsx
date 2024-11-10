"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import { Cart } from "@medusajs/medusa"
import { useState } from "react"

const Review = ({
  cart,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}) => {
  const searchParams = useSearchParams()
  const [pickupConfirmed, setPickupConfirmed] = useState(false)

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
                  <Text className="mb-1 txt-medium-plus text-ui-fg-base">
                    Please confirm the notice below and then click the Place Order button to confirm your order. 
                  </Text>
                  {isManualPayment ? (
                    <>
                      <Text>Information to complete your bank transfer will show once your order has been placed.</Text>
                      <div className="flex items-center gap-x-2 mt-4">
                        <input
                          type="checkbox"
                          id="pickup-confirmation"
                          checked={pickupConfirmed}
                          onChange={(e) => setPickupConfirmed(e.target.checked)}
                          className="h-10 w-10 rounded border-gray-300"
                        />
                          ⚠️ I understand that if I fail to pick up my order by 6pm, my order will be donated to the Pataka Kai and no refund will be given.
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
                          className="h-10 w-10 rounded border-gray-300"
                        />
                        <label htmlFor="pickup-confirmation" className="text-small-regular text-gray-700">
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
          {isOrderTotalValid && pickupConfirmed && (
            <PaymentButton cart={cart} data-testid="submit-order-button" />
          )}
        </>
      )}
    </div>
  )
}

export default Review
