import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonProductGrid = () => {
  return (
    <ul className="grid grid-cols-1 xsmall:grid-cols-2 tablet:grid-cols-3 small:grid-cols-4 medium:grid-cols-5 gap-x-3 gap-y-6 flex-1" data-testid="products-list-loader">
      {repeat(10).map((index) => (
        <li key={index}>
          <SkeletonProductPreview />
        </li>
      ))}
    </ul>
  )
}

export default SkeletonProductGrid
