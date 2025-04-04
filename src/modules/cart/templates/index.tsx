import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import { CartWithCheckoutStep } from "types/global"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { Customer } from "@medusajs/medusa"
import MobileCartCheckoutButton from "./mobile-cart-checkout-button"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: CartWithCheckoutStep | null
  customer: Omit<Customer, "password_hash"> | null
}) => {
  return (
    <div className="py-14 pb-32 md:pb-14">
      <div className="content-container" data-testid="cart-container">
        {cart?.items.length ? (
          <div className="flex flex-col small:grid small:grid-cols-[1fr_360px] gap-x-8 gap-y-8">
            <div className="flex flex-col bg-white p-6 small:p-8 rounded-lg shadow-sm gap-y-6 small:order-1">
              {!customer && (
                <>
                  {/* <SignInPrompt /> */}
                  <Divider />
                </>
              )}
              <ItemsTemplate region={cart?.region} items={cart?.items} />
            </div>
            {/* Summary for desktop - shown on the right side */}
            <div className="hidden small:block relative small:order-2">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.region && (
                  <>
                    <div className="bg-white p-6 small:p-8 rounded-lg shadow-sm">
                      <Summary cart={cart} />
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* Summary for mobile - shown at the bottom */}
            <div className="small:hidden mt-8">
              {cart && cart.region && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <Summary cart={cart} displayCheckoutButton={false} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
      
      {/* Fixed bottom checkout button for mobile */}
      {cart?.items.length ? (
        <MobileCartCheckoutButton cart={cart} />
      ) : null}
    </div>
  )
}

export default CartTemplate
