"use client"
import { Order } from "@medusajs/medusa"
import { Heading, Text } from "@medusajs/ui"
import { formatAmount } from "@lib/util/prices"

type BankPaymentInstructionsProps = {
  order: Order
}

const BankPaymentInstructions: React.FC<BankPaymentInstructionsProps> = ({ order })  => {
  const getAmount = (amount: number | null | undefined) => {
    return formatAmount({
      amount: amount || 0,
      region: order.region,
      includeTaxes: false,
    })
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-2xl-regular mb-2">
        Bank payment instructions
      </Heading>
      <Text className="mb-2">
        Thanks for using our platform! You are one step away from completing your order!
        The final step is to manually transfer us the money. You can find the transfer details below.
        Please put the <span className="font-semibold">order number #<span data-testid="order-id">{order.display_id}</span></span> in the reference field.
      </Text>
    
      <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
        <div className="flex flex-col space-y-3">
          <Text><span className="font-semibold">Bank account name:</span> CoShop</Text>
          <Text><span className="font-semibold">Account number:</span> 38-9025-0215033-00</Text>
          <Text><span className="font-semibold">Reference:</span> {order.display_id}</Text>
          <Text><span className="font-semibold">Amount due (incl GST):</span> {getAmount(order.total)}</Text>
        </div>
      </div>

      <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 mt-2">
        <Text className="font-medium">
          <span className="font-bold">NOTE:</span> Your order is not ready until you have paid the amount due.
        </Text>
      </div>
      
      <Text className="mt-2">
        If you have any questions or feedback, reach out to <a className="underline text-blue-600 hover:text-blue-800" href="mailto:orders@coshop.nz">orders@coshop.nz</a>
      </Text>
    </div>
  )
}

export default BankPaymentInstructions
