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
    const formattedPrice = formatAmount({
      amount: amount || 0,
      region: region,
      includeTaxes: false,
    })
    
    // Remove currency code but keep the dollar sign
    // This will change e.g. "NZ$1.23" to "$1.23"
    return formattedPrice.replace(/^[A-Z]{2,3}\$/, "$")
  }

  const priceInclGst = getAmount(pricedProduct.variants[0]?.original_price_incl_tax)

  return (
    <div className="group h-full">
      <div data-testid="product-wrapper" className="flex flex-col h-full">
        <div className="flex-grow">
          <LocalizedClientLink href={`/products/${productPreview.handle}`}>
            <Thumbnail
              thumbnail={productPreview.thumbnail}
              size="full"
              isFeatured={isFeatured}
            />
          </LocalizedClientLink>
        </div>
        <div className="flex flex-col mt-2">
          <div className="flex flex-col mb-1">
            <Text className="text-ui-fg-subtle font-medium" data-testid="product-title">{productPreview.title}</Text>
            <Text className="text-ui-fg-subtle font-medium">{priceInclGst}</Text>
          </div>
          <ProductActions product={pricedProduct} region={region} />
        </div>
      </div>
    </div>
  )
}
