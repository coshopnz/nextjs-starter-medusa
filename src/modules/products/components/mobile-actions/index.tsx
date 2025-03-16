import { Dialog, Transition } from "@headlessui/react"
import {
  PricedProduct,
  PricedVariant,
} from "@medusajs/medusa/dist/types/pricing"
import { Button, clx } from "@medusajs/ui"
import React, { Fragment, useMemo, useState, useEffect } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"

import { getProductPrice } from "@lib/util/get-product-price"
import { formatAmount } from "@lib/util/prices"
import { Region } from "@medusajs/medusa"
import OptionSelect from "../option-select"
import { formatQuantityUnit } from "@modules/common/lib/format-quantity-unit"

type MobileActionsProps = {
  product: PricedProduct
  variant?: PricedVariant
  region: Region
  options: Record<string, string>
  updateOptions: (update: Record<string, string>) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
  quantity?: number
  setQuantity?: (quantity: number) => void
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  region,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
  quantity = 1,
  setQuantity,
}) => {
  const { state, open, close } = useToggleState()
  const [localQuantity, setLocalQuantity] = useState(quantity)
  const [dynamicPrice, setDynamicPrice] = useState<string | null>(null)

  // Update local quantity when prop changes
  useEffect(() => {
    setLocalQuantity(quantity)
  }, [quantity])

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    setLocalQuantity(newQuantity)
    if (setQuantity) {
      setQuantity(newQuantity)
    }
  }

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
    region,
  })

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
      const total = unitPrice * localQuantity
      setDynamicPrice(getAmount(total))
    } else {
      setDynamicPrice(null)
    }
  }, [variant, localQuantity, region])

  // determines the price to display 
  const selectedPrice = useMemo(() => {
    if (!price) {
      return null
    }
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  // Product weight from the variant if available
  const productWeight = variant?.product?.weight || product?.weight || null;
  const formattedWeight = productWeight ? formatQuantityUnit(localQuantity, productWeight) : "";

  // Check if options are available - either the product has options or has a variant with options
  const hasOptions = Object.keys(options).length > 0;

  // If there are no options, don't render the component because all we will see if the same product details 
  // and add to cart button and an empty drop down to select options
  if (!hasOptions) {
    return null;
  }

  return (
    <>
      <div
        className={clx("lg:hidden inset-x-0 bottom-0 fixed", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="flex flex-col items-center justify-center w-full h-full p-4 bg-white border-t border-gray-200 gap-y-3 text-large-regular"
            data-testid="mobile-actions"
          >
            <div className="flex items-center gap-x-2">
              <span data-testid="mobile-title">{product.title}</span>
              <span>—</span>
              {dynamicPrice ? (
                <div className="flex items-end gap-x-2 text-ui-fg-base">
                  <p>
                    {dynamicPrice}
                    {localQuantity > 1 && formattedWeight && (
                      <span className="text-small-regular text-ui-fg-subtle ml-1">
                        {`for ${formattedWeight}`}
                      </span>
                    )}
                  </p>
                </div>
              ) : selectedPrice ? (
                <div className="flex items-end gap-x-2 text-ui-fg-base">
                  {/* show tax inclusive original price by default */}
                  {selectedPrice.price_type === "default" && (
                    <p>
                      <span className="">
                        {selectedPrice.original_price_incl_tax}
                      </span>
                    </p>
                  )}
                  {/* if price type is sale */}
                  {selectedPrice.price_type === "sale" && (
                    <>
                    {/* show original price, excluding tax, with a line through */}
                      <p>
                        <span className="line-through text-small-regular">
                          {selectedPrice.original_price}
                        </span>
                      </p>
                    
                    {/* then show the calculated price*/}
                    <span
                      className={clx({
                        "text-ui-fg-interactive":
                          selectedPrice.price_type === "sale",
                      })}
                    >
                      {selectedPrice.calculated_price}
                    </span>
                  </>
                  )}
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="grid w-full grid-cols-2 gap-x-4">
              <Button
                onClick={open}
                variant="secondary"
                className="w-full"
                data-testid="mobile-actions-button"
              >
                <div className="flex items-center justify-between w-full">
                  <span>
                    {variant
                      ? Object.values(options).join(" / ")
                      : "Select Options"}
                  </span>
                  <ChevronDown />
                </div>
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={!inStock || !variant}
                className="w-full"
                isLoading={isAdding}
                data-testid="mobile-cart-button"
              >
                {!variant
                  ? "Select variant"
                  : !inStock
                  ? "Out of stock"
                  : "Add to cart"}
              </Button>
            </div>
          </div>
        </Transition>
      </div>
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-x-0 bottom-0">
            <div className="flex items-center justify-center h-full min-h-full text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel
                  className="flex flex-col w-full h-full overflow-hidden text-left transform gap-y-3"
                  data-testid="mobile-actions-modal"
                >
                  <div className="flex justify-end w-full pr-6">
                    <button
                      onClick={close}
                      className="flex items-center justify-center w-12 h-12 bg-white rounded-full text-ui-fg-base"
                      data-testid="close-modal-button"
                    >
                      <X />
                    </button>
                  </div>
                  <div className="px-6 py-12 bg-white">
                    {product.variants.length > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {(product.options || []).map((option) => {
                          return (
                            <div key={option.id}>
                              <OptionSelect
                                option={option}
                                current={options[option.id]}
                                updateOption={updateOptions}
                                title={option.title}
                                disabled={optionsDisabled}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )}
                    
                    {/* Quantity selector */}
                    <div className="flex flex-col gap-y-2 mt-6">
                      <span className="text-sm font-medium">Quantity</span>
                      <select 
                        value={localQuantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                        className="border-ui-border-base bg-ui-bg-subtle border text-small-regular h-10 rounded-rounded p-2 w-full 2xsmall:w-36 xsmall:w-40"
                        disabled={optionsDisabled}
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
                    
                    {/* Dynamic price display */}
                    {dynamicPrice && (
                      <div className="mt-6 text-large-regular">
                        <span className="font-medium">Total: {dynamicPrice}</span>
                        {localQuantity > 1 && formattedWeight && (
                          <span className="text-small-regular text-ui-fg-subtle ml-2">
                            {`for ${formattedWeight}`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileActions
