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
import { isEqual } from "lodash"

type ProductActionsProps = {
  product: PricedProduct
  region: Region
}

export default function ProductActions({ product, region }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPrice, setTotalPrice] = useState<string>("")
  const [options, setOptions] = useState<Record<string, string>>({})
  
  // Get the product weight if available
  const productWeight = product.weight

  // Initialize options
  useEffect(() => {
    const optionObj: Record<string, string> = {}
    
    for (const option of product.options || []) {
      Object.assign(optionObj, { [option.id]: undefined })
    }
    
    setOptions(optionObj)
    
    // If product only has one variant, select it
    if (product.variants && product.variants.length === 1 && product.variants[0].options) {
      const variantOptions: Record<string, string> = {}
      
      for (const option of product.variants[0].options) {
        variantOptions[option.option_id] = option.value
      }
      
      setOptions(variantOptions)
    }
  }, [product])

  // Create a variant record for option selection
  const variantRecord = product.variants?.reduce((acc, variant) => {
    if (!variant.options || !variant.id) return acc
    
    const optionRecord: Record<string, string> = {}
    
    for (const option of variant.options) {
      optionRecord[option.option_id] = option.value
    }
    
    acc[variant.id] = optionRecord
    return acc
  }, {} as Record<string, Record<string, string>>) || {}

  // Find the selected variant based on options
  const selectedVariant = product.variants?.find((v) => {
    if (!v.id || !variantRecord[v.id]) return false
    return isEqual(variantRecord[v.id], options)
  })

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

  // Update options when a variant is selected
  const updateOptions = (update: Record<string, string>) => {
    setOptions({ ...options, ...update })
  }

  // Calculate total price based on quantity and selected variant
  useEffect(() => {
    if (selectedVariant) {
      const unitPrice = selectedVariant.original_price_incl_tax || 0
      const total = unitPrice * quantity
      setTotalPrice(getAmount(total))
    } else if (product?.variants?.[0]) {
      const unitPrice = product.variants[0].original_price_incl_tax || 0
      const total = unitPrice * quantity
      setTotalPrice(getAmount(total))
    }
  }, [quantity, selectedVariant, product])

  const handleAddToCart = async () => {
    const variantId = selectedVariant?.id || product?.variants?.[0]?.id
    if (!variantId) return

    setIsAdding(true)
    setError(null)

    try {
      await addToCart({
        variantId: variantId,
        quantity: quantity,
        countryCode: region.countries[0]?.iso_2 || "NZ",
      })
    } catch (err) {
      setError("Error adding to cart")
    } finally {
      setIsAdding(false)
    }
  }

  // Check if the selected variant is in stock
  const inventoryQuantity = selectedVariant?.inventory_quantity || product.variants?.[0]?.inventory_quantity || 0
  const inStock = inventoryQuantity > 0

  // Check if this product has a slicing option
  const hasSlicingOption = product.options?.some(option => option.title === "Slicing")

  return (
    <div className="flex flex-col w-full">
      {/* Show slicing option selector if available */}
      {hasSlicingOption && (
        <div className="mb-2">
          {product.options?.map(option => {
            if (option.title === "Slicing") {
              return (
                <div key={option.id} className="flex flex-col gap-1 mb-2">
                  <div className="flex flex-wrap gap-2">
                    {option.values.map(value => (
                      <button
                        key={value.id}
                        className={`text-xs px-2 py-1 border rounded-md ${
                          options[option.id] === value.value
                            ? "border-gray-900 bg-gray-100"
                            : "border-gray-200"
                        }`}
                        onClick={() => updateOptions({ [option.id]: value.value })}
                      >
                        {value.value}
                      </button>
                    ))}
                  </div>
                </div>
              )
            }
            return null
          })}
        </div>
      )}
      
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