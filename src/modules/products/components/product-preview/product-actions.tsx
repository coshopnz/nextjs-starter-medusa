"use client"

import { Text, Button } from "@medusajs/ui"
import { useState } from "react"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import { addToCart } from "@modules/cart/actions"
import Spinner from "@modules/common/icons/spinner"
import { Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"

type ProductActionsProps = {
  product: PricedProduct
  region: Region
}

export default function ProductActions({ product, region }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    <div className="flex flex-col">
      <div className="flex items-center justify-end gap-2">
        <CartItemSelect
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="h-8 w-16 text-sm"
        >
          {Array.from(
            { length: Math.min(inStock ? inventoryQuantity : 10, 10) },
            (_, i) => (
              <option value={i + 1} key={i}>
                {i + 1}
              </option>
            )
          )}
        </CartItemSelect>
        <Button
          className="h-8 text-sm px-3 w-24"
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
        <Text className="text-red-500 text-xs mt-1 text-right">{error}</Text>
      )}
    </div>
  )
} 