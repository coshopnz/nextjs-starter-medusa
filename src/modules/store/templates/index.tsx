import { Suspense } from "react"
import { getCollectionsList, getProductsByCollectionHandle, retrievePricedProductById } from "@lib/data"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getRegion } from "@lib/data"
import { ProductPreviewType } from "types/global"
import ProductPreview from "@modules/products/components/product-preview"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Define the collections we want to display in order
  const collectionHandles = ["produce", "bakery"]
  
  // Fetch products for each collection
  const collectionsWithProducts = await Promise.all(
    collectionHandles.map(async (handle) => {
      try {
        const { response } = await getProductsByCollectionHandle({
          handle,
          countryCode,
          limit: 100,
        })
        
        // Fetch full product data for each product to ensure we have options
        const productsWithOptions = await Promise.all(
          response.products.map(async (product) => {
            const fullProduct = await retrievePricedProductById({
              id: product.id,
              regionId: region.id,
            })
            return fullProduct || product
          })
        )
        
        return {
          handle,
          title: handle === "produce" ? "Produce" : "Shelly Bay Baker Bread",
          products: productsWithOptions as (ProductPreviewType | PricedProduct)[],
        }
      } catch (error) {
        console.error(`Error fetching products for collection ${handle}:`, error)
        return {
          handle,
          title: handle === "produce" ? "Produce" : "Shelly Bay Baker Bread",
          products: [],
        }
      }
    })
  )

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container" data-testid="category-container">
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
        </div>
        
        {collectionsWithProducts.map((collection) => (
          <div key={collection.handle} className="mb-12">
            <div className="content-container py-6">
              <h2 className="text-2xl font-semibold mb-6">{collection.title}</h2>
              <ul className="grid grid-cols-1 xsmall:grid-cols-2 tablet:grid-cols-3 small:grid-cols-4 medium:grid-cols-5 gap-x-3 gap-y-6">
                {collection.products && collection.products.map((product) => (
                  <li key={product.id}>
                    <ProductPreview 
                      productPreview={product as ProductPreviewType} 
                      region={region} 
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StoreTemplate

export const metadata = {
  scrollBehavior: 'auto',
};
