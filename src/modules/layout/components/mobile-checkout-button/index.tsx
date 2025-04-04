"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { retrieveCart } from "@modules/cart/actions"
import { formatAmount } from "@lib/util/prices"
import { Cart } from "@medusajs/medusa"
import { Button } from "@medusajs/ui"

const MobileCheckoutButton = () => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true)
      try {
        const cartData = await retrieveCart()
        setCart(cartData as Cart)
      } catch (error) {
        console.error("Error fetching cart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()

    // Set up polling to check for cart updates every 2 seconds
    const intervalId = setInterval(fetchCart, 2000)
    
    return () => clearInterval(intervalId)
  }, [])

  const handleClick = () => {
    router.push("/cart")
  }

  if (!shouldShow || isLoading) {
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