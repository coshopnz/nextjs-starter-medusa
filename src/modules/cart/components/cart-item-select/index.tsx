"use client"

import { IconBadge, clx } from "@medusajs/ui"
import {
  SelectHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import ChevronDown from "@modules/common/icons/chevron-down"

type NativeSelectProps = {
  placeholder?: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">

const CartItemSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ placeholder = "Select...", className, children, ...props }, ref) => {
    const innerRef = useRef<HTMLSelectElement>(null)
    const [isPlaceholder, setIsPlaceholder] = useState(false)

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    )

    useEffect(() => {
      if (innerRef.current && innerRef.current.value === "") {
        setIsPlaceholder(true)
      } else {
        setIsPlaceholder(false)
      }
    }, [innerRef.current?.value])

    return (
      <div>
        <div
          className={clx(
            "relative border rounded flex items-center justify-center text-ui-fg-base",
            className,
            {
              "text-ui-fg-subtle": isPlaceholder,
            }
          )}
          onClick={() => innerRef.current?.focus()}
        >
          <select
            ref={innerRef}
            {...props}
            className="appearance-none bg-transparent border-none w-full text-center font-semibold text-lg pr-6 pl-0 py-1 focus:outline-none"
          >
            <option disabled value="">
              {placeholder}
            </option>
            {children}
          </select>
          <div className="absolute pointer-events-none right-1 top-1/2 transform -translate-y-1/2">
            <ChevronDown />
          </div>
        </div>
      </div>
    )
  }
)

CartItemSelect.displayName = "CartItemSelect"

export default CartItemSelect
