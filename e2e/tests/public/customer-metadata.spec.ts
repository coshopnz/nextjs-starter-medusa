import { test, expect } from "@playwright/test"

/**
 * This test attempts to update customer metadata with pickup location
 * to check if it's a viable alternative to using cart context
 */
test("should update customer metadata with pickup location", async ({ request }) => {
  // Step 1: Create a customer
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
  
  // Step 3: Try to update customer metadata with pickup location
  console.log("Updating customer metadata with pickup location...")
  const metadata = {
    pickup_location: "Central Park Apartments Community Room",
    pickup_preferences: {
      time_window: "morning",
      special_instructions: "Call upon arrival"
    },
    updated_at: new Date().toISOString()
  }
  
  const updateResponse = await request.post("http://localhost:9000/store/customers/me", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwtToken}`
    },
    data: {
      metadata
    }
  })
  
  // Log the response status
  console.log("Update response status:", updateResponse.status())
  
  // Check if the response has valid JSON
  let updateResult
  try {
    updateResult = await updateResponse.json()
    console.log("Update response body:", JSON.stringify(updateResult, null, 2))
  } catch (error) {
    console.log("Response is not valid JSON:", await updateResponse.text())
  }
  
  if (updateResponse.ok()) {
    console.log("Customer metadata updated successfully")
    
    // Step 4: Verify the metadata was updated by retrieving the customer
    console.log("Verifying customer metadata...")
    const getCustomerResponse = await request.get("http://localhost:9000/store/customers/me", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      }
    })
    
    expect(getCustomerResponse.ok()).toBeTruthy()
    const customer = await getCustomerResponse.json()
    console.log("Retrieved customer metadata:", JSON.stringify(customer.customer.metadata, null, 2))
    
    // Verify the metadata contains our pickup location
    expect(customer.customer.metadata).toBeDefined()
    expect(customer.customer.metadata.pickup_location).toBe("Central Park Apartments Community Room")
  } else {
    console.log("Failed to update customer metadata, this may not be supported in the Store API")
  }
}) 