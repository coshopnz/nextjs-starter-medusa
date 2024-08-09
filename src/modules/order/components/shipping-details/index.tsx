import { Order } from "@medusajs/medusa"
import { Heading, Text } from "@medusajs/ui"
import { formatAmount } from "@lib/util/prices"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: Order
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  console.log("order", order)
  return (
    <div>
      <Heading level="h2" className="flex flex-row my-6 text-3xl-regular">
        Delivery
      </Heading>
      <div className="flex items-start gap-x-8">
        <div className="flex flex-col w-1/3" data-testid="shipping-address-summary">
          <Text className="mb-1 txt-medium-plus text-ui-fg-base">
            Shipping Address
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address.first_name}{" "}
            {order.shipping_address.last_name}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address.address_1}{" "}
            {order.shipping_address.address_2}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address.postal_code}, {order.shipping_address.city}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address.country_code?.toUpperCase()}
          </Text>
        </div>

        <div className="flex flex-col w-1/3 " data-testid="shipping-contact-summary">
          <Text className="mb-1 txt-medium-plus text-ui-fg-base">Contact</Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address.phone}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">{order.email}</Text>
        </div>

        <div className="flex flex-col w-1/3" data-testid="shipping-method-summary">
          <Text className="mb-1 txt-medium-plus text-ui-fg-base">Method</Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_methods[0].shipping_option?.name} (
            {formatAmount({
              amount: order.shipping_methods[0].price,
              region: order.region,
              includeTaxes: false,
            })
              .replace(/,/g, "")
              .replace(/\./g, ",")}
            )
          </Text>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails
