"use client"

import { Text, Button } from "@medusajs/ui"
import { useState, useEffect } from "react"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import { addToCart } from "@modules/cart/actions"
import Spinner from "@modules/common/icons/spinner"
import { Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { formatQuantityUnit } from "@modules/common/lib/format-quantity-unit"
import { formatAmount } from "@lib/util/prices"

type ProductActionsProps = {
  product: PricedProduct
  region: Region
}

export default function ProductActions({ product, region }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPrice, setTotalPrice] = useState<string>("")
  
  // Get the product weight if available
  const productWeight = product.weight

  // Format amount helper
  const getAmount = (amount: number | null | undefined) => {
    const formattedPrice = formatAmount({
      amount: amount || 0,
      region: region,
      includeTaxes: false,
    })
    
    // Remove currency code but keep the dollar sign
    return formattedPrice.replace(/^[A-Z]{2,3}\$/, "$")
  }

  // Calculate total price based on quantity
  useEffect(() => {
    if (product?.variants?.[0]) {
      const unitPrice = product.variants[0].original_price_incl_tax || 0
      const total = unitPrice * quantity
      setTotalPrice(getAmount(total))
    }
  }, [quantity, product])

  const handleAddToCart = async () => {
    if (!product?.variants?.[0]?.id) return

    setIsAdding(true)
    setError(null)

    try {
      await addToCart({
        variantId: product.variants[0].id,
        quantity: quantity,
        countryCode: region.countries[0]?.iso_2 || "NZ",
      })
    } catch (err) {
      setError("Error adding to cart")
    } finally {
      setIsAdding(false)
    }
  }

  const inventoryQuantity = product.variants[0]?.inventory_quantity || 0
  const inStock = inventoryQuantity > 0

  return (
    <div className="flex flex-col w-full">
      {/* Display the total price */}
      <Text className="text-ui-fg-base font-medium mb-2">
        {totalPrice} {quantity > 1 && `for ${formatQuantityUnit(quantity, productWeight)}`}
      </Text>
      <div className="flex flex-col 2xsmall:flex-row items-start 2xsmall:items-center gap-2">
        <CartItemSelect
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="h-10 w-full 2xsmall:w-20 xsmall:w-24 flex-shrink-0"
        >
          {Array.from(
            { length: Math.min(inStock ? inventoryQuantity : 10, 10) },
            (_, i) => (
              <option value={i + 1} key={i}>
                {formatQuantityUnit(i + 1, productWeight)}
              </option>
            )
          )}
        </CartItemSelect>
        <Button
          className="h-10 text-sm px-4 w-full 2xsmall:w-auto min-w-[100px] font-medium"
          variant="primary"
          onClick={handleAddToCart}
          disabled={!inStock || isAdding}
        >
          {isAdding ? (
            <Spinner />
          ) : !inStock ? (
            "Out of stock"
          ) : (
            "Add to cart"
          )}
        </Button>
      </div>
      {error && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}
    </div>
  )
} 