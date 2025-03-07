import { test, expect } from "@playwright/test"
import { APIRequestContext } from '@playwright/test'

/**
 * Tests the checkout process with pickup location storage
 * Verifies that pickup location is stored in:
 * 1. Customer metadata for logged-in users
 * 2. Cart context for guest users
 */
test("should store pickup location correctly based on user type", async ({ request }) => {
  // Test for guest user first (using cart context)
  await testGuestUserPickupLocation(request)
  
  // Then test for logged-in user (using customer metadata)
  await testLoggedInUserPickupLocation(request)
})

/**
 * Tests pickup location storage for guest users
 */
async function testGuestUserPickupLocation(request: APIRequestContext) {
  console.log("\n--- Testing Guest User Pickup Location Storage ---\n")
  
  // Step 1: Create a new cart
  console.log("Creating a new cart for guest user...")
  const createCartResponse = await request.post("http://localhost:9000/store/carts", {
    headers: {
      "Content-Type": "application/json"
    }
  })
  
  expect(createCartResponse.ok()).toBeTruthy()
  
  const cart = await createCartResponse.json()
  const cartId = cart.cart.id
  console.log("Created cart with ID:", cartId)
  
  // Step 2: Simulate checkout process by setting pickup location in cart context
  console.log("Setting pickup location in cart context...")
  const pickupLocation = "Central Park Apartments Community Room"
  
  const updateResponse = await request.post(`http://localhost:9000/store/carts/${cartId}`, {
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      context: {
        pickup_location: pickupLocation
      }
    }
  })
  
  expect(updateResponse.ok()).toBeTruthy()
  
  // Step 3: Verify the pickup location was stored in the context
  const updatedCart = await updateResponse.json()
  console.log("Cart context:", JSON.stringify(updatedCart.cart.context, null, 2))
  
  expect(updatedCart.cart.context).toHaveProperty("pickup_location")
  expect(updatedCart.cart.context.pickup_location).toBe(pickupLocation)
  
  console.log("✅ Guest user pickup location successfully stored in cart context")
}

/**
 * Tests pickup location storage for logged-in users
 */
async function testLoggedInUserPickupLocation(request: APIRequestContext) {
  console.log("\n--- Testing Logged-in User Pickup Location Storage ---\n")
  
  // Step 1: Create a test customer
  console.log("Creating a test customer...")
  const customerData = {
    email: `test-${Date.now()}@example.com`,
    password: "password123",
    first_name: "Test",
    last_name: "Customer"
  }
  
  const createCustomerResponse = await request.post("http://localhost:9000/store/customers", {
    headers: {
      "Content-Type": "application/json"
    },
    data: customerData
  })
  
  expect(createCustomerResponse.ok()).toBeTruthy()
  console.log("Customer created successfully")
  
  // Step 2: Get JWT token for authentication
  console.log("Getting JWT token...")
  const tokenResponse = await request.post("http://localhost:9000/store/auth/token", {
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      email: customerData.email,
      password: customerData.password
    }
  })
  
  expect(tokenResponse.ok()).toBeTruthy()
  const tokenData = await tokenResponse.json()
  const jwtToken = tokenData.access_token
  console.log("Obtained JWT token successfully")
  
  // Step 3: Directly test updating customer metadata with pickup location
  console.log("Updating customer metadata with pickup location...")
  const pickupLocation = "Karori Community Center"
  
  const updateCustomerResponse = await request.post("http://localhost:9000/store/customers/me", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwtToken}`
    },
    data: {
      metadata: {
        pickup_location: pickupLocation,
        last_updated: new Date().toISOString()
      }
    }
  })
  
  expect(updateCustomerResponse.ok()).toBeTruthy()
  console.log("Customer metadata updated successfully")
  
  // Step 4: Verify the pickup location was stored in customer metadata
  const getCustomerResponse = await request.get("http://localhost:9000/store/customers/me", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwtToken}`
    }
  })
  
  expect(getCustomerResponse.ok()).toBeTruthy()
  const customer = await getCustomerResponse.json()
  console.log("Customer metadata:", JSON.stringify(customer.customer.metadata, null, 2))
  
  expect(customer.customer.metadata).toBeDefined()
  expect(customer.customer.metadata.pickup_location).toBe(pickupLocation)
  
  console.log("✅ Logged-in user pickup location successfully stored in customer metadata")
} 