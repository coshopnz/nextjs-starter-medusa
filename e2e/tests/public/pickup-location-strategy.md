# Pickup Location Storage Strategy in MedusaJS v1

This document outlines our approach to storing pickup location data in MedusaJS v1 to ensure it's properly included in orders.

## The Challenge

In MedusaJS v1, we need a way to store pickup location information that:
1. Is accessible through the public Store API
2. Gets transferred to the order when a checkout is completed
3. Persists between sessions for logged-in users

## Our Dual-Storage Strategy

Our solution uses both shipping address fields and customer metadata to provide an optimal experience:

### Primary Storage for All Users: Shipping Address

- Store pickup location in the **shipping address's address_2 field**
- Benefits:
  - Works for both guest and logged-in users
  - Automatically transfers to the order when checkout completes
  - Visible in admin dashboard and order details
  - No custom backend code required

### Secondary Storage for Logged-in Customers (with accounts)

- Additionally store pickup location in **customer metadata**
- Benefits:
  - Persists across multiple orders
  - Allows us to show previously selected pickup locations
  - Improves the experience for returning customers

## Why Not Cart Context?

Initially, we considered using the cart context field for guest users since it's accessible through the public Store API. However, cart context data does **not** transfer to the order object when a cart is converted to an order during checkout. 

This would have resulted in pickup location data being lost after checkout completion.

## Implementation Details

### 1. Checkout Review Component

The review component:
- Displays a pickup location selector
- For logged-in users with accounts, checks for previously selected locations in customer metadata
- Offers the option to reuse a previously selected location
- Stores the selection in the checkout context for use during order placement

```jsx
// Key part of the review component
useEffect(() => {
  // If we have a customer with an account and they haven't selected a location yet
  if (cart.customer && cart.customer.has_account && cart.customer.metadata && !pickupLocation) {
    const customerMetadata = cart.customer.metadata as Record<string, any>
    
    if (customerMetadata?.pickup_location) {
      setPreviousLocation(customerMetadata.pickup_location)
    }
  }
}, [cart.customer, pickupLocation]);
```

### 2. Order Placement Action

When placing an order, our `placeOrder` function:
1. For customers with accounts:
   - Stores pickup location in customer metadata for future reference
2. For all users (including guests):
   - Stores pickup location in the shipping address's address_2 field
   - This ensures the data transfers to the order

```typescript
// Key part of the placeOrder function
// For customers with accounts, store in metadata for future use
if (currentCart && currentCart.customer && currentCart.customer.has_account) {
  try {
    const customer = await getCustomer()
    if (customer) {
      await updateCustomer({
        metadata: {
          ...(customer.metadata || {}),
          pickup_location: pickupLocation,
          last_updated: new Date().toISOString()
        }
      })
    }
  } catch (error) {
    console.error("Error updating customer metadata:", error)
  }
}

// For ALL users, store pickup location in the shipping address
// This ensures the information is transferred to the order
if (currentCart && currentCart.shipping_address) {
  await updateCart(cartId, {
    shipping_address: {
      ...currentCart.shipping_address,
      address_2: `Pickup: ${pickupLocation}`
    }
  } as unknown as StorePostCartsCartReq)
}
```

## Accessing Pickup Location in Orders

With this approach, the pickup location can be accessed in orders by looking at:

1. The shipping address's `address_2` field, which will contain: `Pickup: [location name]`

This makes it easy to identify the pickup location in the admin dashboard and in order processing systems.

## Benefits of This Approach

1. **Works for All Users**: Both guest and logged-in users have their pickup location preserved in orders
2. **No Data Loss**: Information transfers from cart to order reliably
3. **Persistence for Account Holders**: Returning customers see their previous preferences
4. **No Backend Changes**: Uses standard MedusaJS fields and APIs
5. **Admin Visibility**: Pickup locations are visible in the order details

## Conclusion

This dual-storage strategy provides a robust solution for storing pickup location data in MedusaJS v1, ensuring that the information is properly transferred to orders for all users while still providing a personalized experience for returning customers with accounts. 