"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { retrieveCart } from "@modules/cart/actions"
import { formatAmount } from "@lib/util/prices"
import { Cart } from "@medusajs/medusa"
import { Button } from "@medusajs/ui"

const MobileCheckoutButton = () => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  // Excluded paths where we don't want to show the button
  // Added root path check to hide on the homepage/location selector
  const excludedPaths = ["/cart", "/checkout", "/order/confirmed"]
  const shouldShow = !excludedPaths.some(path => pathname?.includes(path)) && 
                     !isHomePage(pathname)

  // Check if the current path is the homepage (location selector)
  function isHomePage(path: string | null): boolean {
    if (!path) return false
    // Check if path matches the pattern: /[countryCode] with nothing after
    // This matches paths like /nz, /us, but not /nz/store or other subpaths
    return /^\/[a-z]{2}$/i.test(path)
  }

  // Helper function to compare carts
  function isCartChanged(oldCart: Cart | null, newCart: Cart | null): boolean {
    if (!oldCart && !newCart) return false
    if (!oldCart || !newCart) return true
    
    // Check total and number of items
    if (oldCart.total !== newCart.total || 
        oldCart.items.length !== newCart.items.length) {
      return true
    }
    
    return false
  }

  useEffect(() => {
    let isMounted = true

    const fetchCart = async () => {
      try {
        const cartData = await retrieveCart() as Cart
        
        if (isMounted) {
          // Only update state if cart has changed
          if (isCartChanged(cart, cartData)) {
            setCart(cartData)
          }
          
          // Only set initial loading to false once
          if (initialLoading) {
            setInitialLoading(false)
          }
        }
      } catch (error) {
        console.error("Error fetching cart:", error)
        if (isMounted && initialLoading) {
          setInitialLoading(false)
        }
      }
    }

    fetchCart()

    // Set up polling with a slightly longer interval
    const intervalId = setInterval(fetchCart, 5000)
    
    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [cart, initialLoading])

  const handleClick = () => {
    router.push("/cart")
  }

  if (!shouldShow) {
    return null
  }

  // Only show loading state during initial load
  if (initialLoading) {
    return null
  }

  const isEmpty = !cart || cart.items.length === 0
  const formattedTotal = cart?.total && cart?.region ? 
    formatAmount({
      amount: cart.total,
      region: cart.region,
      includeTaxes: false,
    }) : "$0.00"

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 md:hidden">
      <Button
        onClick={handleClick}
        disabled={isEmpty}
        variant={isEmpty ? "secondary" : "primary"}
        className="w-full h-12 text-base font-medium"
        size="large"
      >
        {isEmpty ? (
          "Cart Empty"
        ) : (
          <>View Cart • {formattedTotal}</>
        )}
      </Button>
    </div>
  )
}

export default MobileCheckoutButton 