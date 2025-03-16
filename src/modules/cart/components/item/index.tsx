"use client"

import { LineItem, Region } from "@medusajs/medusa"
import { Table, Text, clx } from "@medusajs/ui"

import CartItemSelect from "@modules/cart/components/cart-item-select"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"
import { updateLineItem } from "@modules/cart/actions"
import Spinner from "@modules/common/icons/spinner"
import { useState } from "react"
import ErrorMessage from "@modules/checkout/components/error-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { formatQuantityUnit } from "@modules/common/lib/format-quantity-unit"
import { formatAmount } from "@lib/util/prices"
import { CalculatedVariant } from "types/medusa"

type ItemProps = {
  item: Omit<LineItem, "beforeInsert">
  region: Region
  type?: "full" | "preview"
}

const Item = ({ item, region, type = "full" }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { handle } = item.variant.product
  // Get the product weight from dimensions if available
  const productWeight = item.variant.product.weight
  
  // Calculate unit weight and quantity with explicit type handling
  const unitWeight = typeof productWeight === 'number' ? productWeight : 0
  const quantity = typeof item.quantity === 'number' ? item.quantity : parseInt(String(item.quantity || '0'), 10)
  
  // Calculate total weight
  const totalWeight = unitWeight * quantity
  
  // Format weight displays with explicit checks
  let unitWeightDisplay = '1'
  if (unitWeight > 0) {
    unitWeightDisplay = unitWeight < 1000 
      ? `${unitWeight}g` 
      : `${(unitWeight / 1000).toFixed(1)}kg`
  }
  
  let totalWeightDisplay = String(quantity)
  if (unitWeight > 0) {
    if (totalWeight < 1000) {
      totalWeightDisplay = `${totalWeight}g`
    } else {
      // Explicitly calculate kg value
      const kgValue = totalWeight / 1000
      totalWeightDisplay = `${kgValue.toFixed(1)}kg`
    }
  }
  
  // Extra debug info
  console.log({
    title: item.title,
    unitWeight,
    quantity,
    totalWeight,
    totalWeightDisplay,
    formattedQuantity: formatQuantityUnit(quantity, unitWeight)
  })
  
  // Calculate unit price and total for display
  const unitPrice = item.unit_price || 0
  const formattedUnitPrice = formatAmount({
    amount: unitPrice,
    region: region,
    includeTaxes: true,
  })
  
  // Remove currency prefix (NZ) if present for display in calculation
  const displayUnitPrice = formattedUnitPrice.replace("NZ", "")
  
  const formattedTotal = formatAmount({
    amount: item.total || 0,
    region: region,
    includeTaxes: false,
  })

  // Calculate the weight display text before rendering
  const calculateWeightDisplay = () => {
    // Get precise weight value
    const actualUnitWeight = typeof productWeight === 'number' ? productWeight : 0;
    
    // Don't show weight if product has no weight or weight is 0
    if (!actualUnitWeight) {
      return "";
    }
    
    // Format display based on unit weight (NOT total weight)
    if (actualUnitWeight < 1000) {
      // For small weights, show grams
      return `${Math.round(actualUnitWeight)}g`;
    } else {
      // For larger weights, show kilograms with fixed precision
      const kgWeight = actualUnitWeight / 1000;
      return `${kgWeight.toFixed(1)}kg`;
    }
  }
  
  // Get the unit weight display (not total weight)
  const weightDisplay = calculateWeightDisplay();
  
  // Determine if we should show the @ symbol
  const hasWeight = typeof productWeight === 'number' && productWeight > 0;
  const atSymbol = hasWeight ? "@" : "";
  
  // Create the final calculation display
  const calculationDisplay = weightDisplay 
    ? `${weightDisplay} ${atSymbol} ${displayUnitPrice} × ${quantity}`
    : `${displayUnitPrice} × ${quantity}`;

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    const message = await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        return err.message
      })
      .finally(() => {
        setUpdating(false)
      })

    message && setError(message)
  }

  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="!pl-0 p-4 w-24">
        <LocalizedClientLink
          href={`/products/${handle}`}
          className={clx("flex", {
            "w-16": type === "preview",
            "small:w-24 w-12": type === "full",
          })}
        >
          <Thumbnail thumbnail={item.thumbnail} size="square" />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text className="txt-medium-plus text-ui-fg-base" data-testid="product-title">{item.title}</Text>
        {/* <LineItemOptions variant={item.variant} data-testid="product-variant" /> */}
        
        {/* Display calculation on mobile screens */}
        {type === "full" && (
          <div className="mt-1 block small:hidden">
            <Text className="text-sm text-ui-fg-muted" data-testid="product-calculation-mobile">
              {calculationDisplay}
            </Text>
          </div>
        )}
      </Table.Cell>

      {type === "full" && (
        <Table.Cell>
          <div className="flex items-center gap-2 w-36">
            <DeleteButton id={item.id} data-testid="product-delete-button" />
            <CartItemSelect
              value={item.quantity}
              onChange={(value) => changeQuantity(parseInt(value.target.value))}
              className="h-10 w-24 flex-shrink-0"
              data-testid="product-select-button"
            >
              {Array.from(
                {
                  // Ensure we can display at least the current quantity in the dropdown
                  // or up to a max of 20 items (whichever is higher)
                  length: Math.max(
                    Math.min(
                      item.variant.inventory_quantity > 0
                        ? item.variant.inventory_quantity
                        : 20,
                      20
                    ),
                    item.quantity
                  ),
                },
                (_, i) => (
                  <option value={i + 1} key={i}>
                    {formatQuantityUnit(i + 1, productWeight)}
                  </option>
                )
              )}
            </CartItemSelect>
            {updating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell">
          <div className="flex flex-col">
            <Text className="text-ui-fg-base">
              {calculationDisplay}
            </Text>
          </div>
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{formatQuantityUnit(item.quantity, productWeight)} x </Text>
              <LineItemUnitPrice item={item} region={region} style="tight" />
            </span>
          )}
          <LineItemPrice item={item} region={region} style="tight" />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
