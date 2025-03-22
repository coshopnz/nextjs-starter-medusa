import { LineItem } from "@medusajs/medusa"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import { enrichLineItems, retrieveCart } from "@modules/cart/actions"
import { BsCart } from 'react-icons/bs'
import CartDropdown from "../cart-dropdown"
import { formatAmount } from "@lib/util/prices"

const fetchCart = async () => {
  const cart = await retrieveCart()

  if (cart?.items.length) {
    const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id)
    cart.items = enrichedItems as LineItem[]
    
  }

  return cart
}

export default async function CartButton() {
  const cart = await fetchCart()
  
  // Get the number of unique items
  const uniqueItemCount = cart?.items?.length || 0
  
  // Format the cart total if available
  const formattedTotal = cart?.total && cart?.region ? 
    formatAmount({
      amount: cart.total,
      region: cart.region,
      includeTaxes: false,
    }) : null

  return (
    <div className="flex items-center"> 
      <CartDropdown cart={cart} />
      <LocalizedClientLink href="/cart" className="ml-2 mr-4 relative flex items-center">
        <BsCart className="h-5 w-5" />
        {uniqueItemCount > 0 && (
          <span className="absolute -top-2 -right-2 h-4 w-4 text-xs flex items-center justify-center bg-black text-white rounded-full">
            {uniqueItemCount}
          </span>
        )}
        {formattedTotal && uniqueItemCount > 0 && (
          <span className="ml-2 text-xs font-medium">
            {formattedTotal}
          </span>
        )}
      </LocalizedClientLink>
    </div>
  );
}
