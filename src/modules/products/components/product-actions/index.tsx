"use client"

import { Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { Button } from "@medusajs/ui"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import { useIntersection } from "@lib/hooks/use-in-view"
import { addToCart } from "@modules/cart/actions"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/option-select"
import { formatAmount } from "@lib/util/prices"
import { formatQuantityUnit } from "@modules/common/lib/format-quantity-unit"

import MobileActions from "../mobile-actions"
import ProductPrice from "../product-price"

type ProductActionsProps = {
  product: PricedProduct
  region: Region
  disabled?: boolean
}

export type PriceType = {
  calculated_price: string
  original_price?: string
  price_type?: "sale" | "default"
  percentage_diff?: string
}

export default function ProductActions({
  product = {} as PricedProduct,
  region,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [dynamicPrice, setDynamicPrice] = useState<string | null>(null)

  const countryCode = useParams().countryCode as string

  const variants = product.variants

  // initialize the option state
  useEffect(() => {
    const optionObj: Record<string, string> = {}

    for (const option of product.options || []) {
      Object.assign(optionObj, { [option.id]: undefined })
    }

    setOptions(optionObj)

  }, [product])

  // memoized record of the product's variants
  const variantRecord = useMemo(() => {
    const map: Record<string, Record<string, string>> = {}

    for (const variant of variants) {
      if (!variant.options || !variant.id) continue

      const temp: Record<string, string> = {}

      for (const option of variant.options) {
        temp[option.option_id] = option.value
      }

      map[variant.id] = temp
    }

    return map
  }, [variants])

  // memoized function to check if the current options are a valid variant
  const variant = useMemo(() => {
    let variantId: string | undefined = undefined

    for (const key of Object.keys(variantRecord)) {
      if (isEqual(variantRecord[key], options)) {
        variantId = key
      }
    }

    return variants.find((v) => v.id === variantId)
  }, [options, variantRecord, variants])

  // Format amount helper
  const getAmount = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return ""
    
    const formattedPrice = formatAmount({
      amount: amount,
      region,
      includeTaxes: false,
    })
    
    // Remove currency code but keep the dollar sign
    return formattedPrice.replace(/^[A-Z]{2,3}\$/, "$")
  }

  // Update dynamic price based on variant and quantity
  useEffect(() => {
    if (variant) {
      const unitPrice = variant.original_price_incl_tax || 0
      const total = unitPrice * quantity
      setDynamicPrice(getAmount(total))
    } else {
      setDynamicPrice(null)
    }
  }, [variant, quantity])

  // if product only has one variant, then select it
  useEffect(() => {
    if (variants.length === 1 && variants[0].id) {
      setOptions(variantRecord[variants[0].id])
    }
  }, [variants, variantRecord])

  // update the options when a variant is selected
  const updateOptions = (update: Record<string, string>) => {
    setOptions({ ...options, ...update })
  }

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (variant && !variant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (variant && variant.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (variant?.inventory_quantity && variant.inventory_quantity > 0) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [variant])

  const actionsRef = useRef<HTMLDivElement>(null) //references the div element of this component when mouunted
  // a boolean that indicates whether the `actionsRef` element is currently in view within the viewport and triggers the MobileActions component to render.
  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!variant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: variant.id,
      quantity: quantity,
      countryCode,
    })

    setIsAdding(false)
  }

  // Format weight for display
  const formatWeight = (weight?: number | null): string => {
    if (!weight) return "";
    
    if (weight < 1000) {
      return `${Math.round(weight)}g`;
    } else {
      return `${(weight / 1000).toFixed(1)}kg`;
    }
  };

  // Product weight from the variant if available
  const productWeight = variant?.product?.weight || product?.weight || null;
  const weightDisplay = formatWeight(productWeight);

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {product.variants.length > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={updateOptions}
                      title={option.title}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
          
          {/* Quantity selector */}
          <div className="flex flex-col gap-y-2 mt-4">
            <span className="text-sm">Quantity</span>
            <select 
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border-ui-border-base bg-ui-bg-subtle border text-small-regular h-10 rounded-rounded p-2 w-full 2xsmall:w-36 xsmall:w-40"
              disabled={!!disabled || isAdding}
            >
              {Array.from(
                { length: 10 },
                (_, i) => (
                  <option value={i + 1} key={i}>
                    {formatQuantityUnit(i + 1, productWeight)}
                  </option>
                )
              )}
            </select>
          </div>
          
          <Divider className="mt-4" />
        </div>

        {/* Show dynamic price if available */}
        {dynamicPrice ? (
          <div className="flex flex-col text-ui-fg-base mb-2">
            <span className="text-xl-semi">
              {dynamicPrice}
              {quantity > 1 && weightDisplay && (
                <span className="text-sm text-ui-fg-subtle ml-2">
                  {`for ${formatQuantityUnit(quantity, productWeight)}`}
                </span>
              )}
            </span>
          </div>
        ) : (
          <ProductPrice product={product} variant={variant} region={region} />
        )}

        <Button
          onClick={handleAddToCart}
          disabled={!inStock || !variant || !!disabled || isAdding}
          variant="primary"
          className="w-full h-12 text-base font-medium py-3 px-6"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!variant
            ? "Select variant"
            : !inStock
            ? "Out of stock"
            : "Add to cart"}
        </Button>
        <MobileActions
          product={product}
          variant={variant}
          region={region}
          options={options}
          updateOptions={updateOptions}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </div>
    </>
  )
}
