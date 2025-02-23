import { Text } from "@medusajs/ui"
import { ProductPreviewType } from "types/global"
import { retrievePricedProductById } from "@lib/data"
import { Region } from "@medusajs/medusa"
import Thumbnail from "../thumbnail"
import { formatAmount } from "@lib/util/prices"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductActions from "./product-actions"

export default async function ProductPreview({
  productPreview,
  isFeatured,
  region,
}: {
  productPreview: ProductPreviewType
  isFeatured?: boolean
  region: Region
}) {
  const pricedProduct = await retrievePricedProductById({
    id: productPreview.id,
    regionId: region.id,
  }).then((product) => product)

  if (!pricedProduct) {
    return null
  }

  const getAmount = (amount: number | null | undefined) => {
    return formatAmount({
      amount: amount || 0,
      region: region,
      includeTaxes: false,
    })
  }

    // Store the product price in a variable
    const priceInclGst = getAmount(pricedProduct.variants[0]?.original_price_incl_tax)

  return (
    <div className="group h-full">
      <div data-testid="product-wrapper" className="flex flex-col h-full">
        <LocalizedClientLink href={`/products/${productPreview.handle}`} className="flex-grow">
          <Thumbnail
            thumbnail={productPreview.thumbnail}
            size="full"
            isFeatured={isFeatured}
          />
        </LocalizedClientLink>
        <div className="flex flex-col mt-2">
          <div className="flex justify-between items-center mb-1">
            <Text className="text-ui-fg-subtle font-medium" data-testid="product-title">{productPreview.title}</Text>
            <Text className="text-ui-fg-subtle font-medium">{priceInclGst}</Text>
          </div>
          <ProductActions product={pricedProduct} region={region} />
        </div>
      </div>
    </div>
  )
}
