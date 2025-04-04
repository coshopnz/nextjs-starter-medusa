import { Text } from "@medusajs/ui"
import { ProductPreviewType } from "types/global"
import { retrievePricedProductById } from "@lib/data"
import { Region } from "@medusajs/medusa"
import Thumbnail from "../thumbnail"
import { formatAmount } from "@lib/util/prices"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductActions from "./product-actions"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"

export default async function ProductPreview({
  productPreview,
  isFeatured,
  region,
}: {
  productPreview: ProductPreviewType | PricedProduct
  isFeatured?: boolean
  region: Region
}) {
  // If we already have a PricedProduct, use it directly
  const pricedProduct = 'options' in productPreview && productPreview.options 
    ? productPreview as PricedProduct 
    : productPreview.id
      ? await retrievePricedProductById({
          id: productPreview.id,
          regionId: region.id,
        }).then((product) => product)
      : null

  if (!pricedProduct) {
    return null
  }

  // Get the handle safely ensuring it's a string
  const handle = typeof productPreview.handle === 'string' ? productPreview.handle : '';

  return (
    <div className="group h-full">
      <div data-testid="product-wrapper" className="flex flex-col h-full">
        <div className="flex-grow">
          <LocalizedClientLink href={`/products/${handle}`}>
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
          </div>
          <ProductActions product={pricedProduct} region={region} />
        </div>
      </div>
    </div>
  )
}
