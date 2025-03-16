"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import { CartWithCheckoutStep } from "types/global"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type SummaryProps = {
  cart: CartWithCheckoutStep
}

const Summary = ({ cart }: SummaryProps) => {
  const isOrderTotalValid = (cart.total ?? 0) >= 1000

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-xl small:text-2xl leading-[1.75rem] small:leading-[2.75rem]">
        Summary
      </Heading>
      <Divider />
      <CartTotals data={cart} />
      {!isOrderTotalValid && (
        <div className="text-rose-500 text-small-regular mb-2">
          Minimum order amount is $10
        </div>
      )}
      <LocalizedClientLink 
        href={isOrderTotalValid ? "/checkout?step=" + cart.checkout_step : "#"}
        className={!isOrderTotalValid ? "cursor-not-allowed" : ""}
        data-testid="checkout-button"
      >
        <Button 
          className="w-full h-12 text-base font-medium" 
          disabled={!isOrderTotalValid}
        >
          Go to checkout
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
