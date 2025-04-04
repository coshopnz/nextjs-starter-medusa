"use client"

import { Button } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { CartWithCheckoutStep } from "types/global"
import { formatAmount } from "@lib/util/prices"

type MobileCartCheckoutButtonProps = {
  cart: CartWithCheckoutStep
}

const MobileCartCheckoutButton = ({ cart }: MobileCartCheckoutButtonProps) => {
  const router = useRouter()
  const isOrderTotalValid = (cart.total ?? 0) >= 999

  const handleCheckout = () => {
    if (isOrderTotalValid) {
      router.push(`/checkout?step=${cart.checkout_step}`)
    }
  }

  // Format the total amount
  const formattedTotal = cart?.total && cart?.region 
    ? formatAmount({
        amount: cart.total,
        region: cart.region,
        includeTaxes: false,
      }) 
    : "$0.00"

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 md:hidden">
      <Button
        onClick={handleCheckout}
        disabled={!isOrderTotalValid}
        variant="primary"
        className="w-full h-12 text-base font-medium"
        size="large"
        data-testid="mobile-checkout-button"
      >
        {!isOrderTotalValid 
          ? "Minimum order $9.99" 
          : `Go to checkout • ${formattedTotal}`}
      </Button>
    </div>
  )
}

export default MobileCartCheckoutButton 