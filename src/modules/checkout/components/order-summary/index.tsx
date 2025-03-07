"use client"

import { Cart } from "@medusajs/medusa"
import { Heading, Text } from "@medusajs/ui"

type OrderSummaryProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
  pickupLocation: string
}

const OrderSummary = ({ cart, pickupLocation }: OrderSummaryProps) => {
  // Simple formatting function that formats cents to dollars with 2 decimal places
  const formatAmount = (amount: number | null | undefined): string => {
    if (!amount) {
      return "$0.00"
    }
    
    // Convert cents to dollars and format with 2 decimal places
    const dollars = (amount / 100).toFixed(2)
    return `$${dollars}`
  }

  return (
    <div className="border rounded-lg p-4 bg-white">
      <Heading level="h3" className="text-lg mb-3 pb-3 border-b">
        Order Summary
      </Heading>
      
      {/* Items Summary */}
      <div className="mb-4">
        <Text className="font-medium mb-2">Items</Text>
        <ul className="divide-y">
          {cart.items.map((item) => (
            <li key={item.id} className="py-2 flex justify-between">
              <div>
                <Text className="font-medium">{item.title}</Text>
                <Text className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </Text>
              </div>
              <Text className="font-medium">
                {formatAmount(item.total)}
              </Text>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Pickup Location */}
      <div className="mb-4 p-3 bg-green-50 rounded-lg">
        <Text className="font-medium">Pickup Details</Text>
        <div className="flex items-center mt-1">
          <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
          <Text className="font-bold">{pickupLocation}</Text>
        </div>
        <Text className="text-sm text-gray-600 mt-1">
          Thursday pickup times: 10am-12pm and 5pm-6pm
        </Text>
      </div>
      
      {/* Totals */}
      <div className="border-t pt-3">
        <div className="flex items-center justify-between mb-1">
          <Text>Subtotal</Text>
          <Text className="font-medium">{formatAmount(cart.subtotal)}</Text>
        </div>
        
        {cart.discounts.length > 0 && (
          <div className="flex items-center justify-between mb-1 text-green-600">
            <Text>Discounts</Text>
            <Text>- {formatAmount(cart.discount_total)}</Text>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-1">
          <Text>Shipping</Text>
          <Text>{formatAmount(cart.shipping_total)}</Text>
        </div>
        
        <div className="flex items-center justify-between mb-1">
          <Text>Tax</Text>
          <Text>{formatAmount(cart.tax_total)}</Text>
        </div>
        
        <div className="flex items-center justify-between border-t mt-2 pt-2">
          <Text className="font-bold">Total</Text>
          <Text className="font-bold">{formatAmount(cart.total)}</Text>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary 