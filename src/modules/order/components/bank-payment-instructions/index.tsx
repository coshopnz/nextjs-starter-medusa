"use client"
import { Order } from "@medusajs/medusa"
import { Heading, Text } from "@medusajs/ui"
import { formatAmount } from "@lib/util/prices"

type BankPaymentInstructionsProps = {
  order: Order
}

const BankPaymentInstructions: React.FC<BankPaymentInstructionsProps> = ({ order })  => {
  // Get pickup location from order metadata
  const pickupLocation = order.metadata?.pickup_location as string || "Karori Community Centre"

  const getAmount = (amount: number | null | undefined) => {
    return formatAmount({
      amount: amount || 0,
      region: order.region,
      includeTaxes: false,
    })
  }

  return (
    <div className="flex flex-col gap-y-3">
      <Heading level="h2" className="text-2xl-regular">
        Bank payment instructions
      </Heading>
      <Text>
      Thanks for using our platform! You are one step away from completing your order!
      The final step is to manually transfer us the money. You can find the transfer details below.
      Please put the <span className="font-semibold">order number #<span data-testid="order-id">{order.display_id}</span></span> in the reference field.
      </Text>
    
      <div className="flex flex-col space-y-2">
        <Text><span className="font-semibold">Bank account name:</span> CoShop</Text>
        <Text><span className="font-semibold">Account number:</span> 38-9025-0215033-00</Text>
        <Text><span className="font-semibold">Reference:</span> {order.display_id}</Text>
        <Text><span className="font-semibold">Amount due (incl GST):</span> {getAmount(order.total)}</Text>
        <Text><span className="font-semibold">NOTE:</span> Your order is not ready until you have paid the amount due.</Text>
        <Text>If you have any questions or feedback, reach out to <a className="underline" href="mailto:orders@coshop.nz">orders@coshop.nz</a></Text>
      </div>

      <div className="mt-6 flex flex-col gap-y-3">
        <Heading level="h2" className="text-2xl-regular">
          Pickup information
        </Heading>
        <Text>
          Once your payment is received, your food bag(s) will be ready for pickup:
        </Text>
        <div className="flex flex-col space-y-2">
          <Text><span className="font-semibold">When:</span> Every Thursday, between 8:30am - 10am and 5pm - 6pm</Text>
          <Text><span className="font-semibold">Where:</span> {pickupLocation}</Text>
          <Text className="text-ui-fg-error font-medium">
            ⚠️ If you fail to pick up your order by 6pm, it will be donated to the Pataka Kai and no refund will be given.
          </Text>
        </div>
      </div>
    </div>
  )
}

export default BankPaymentInstructions
