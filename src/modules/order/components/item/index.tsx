import { LineItem, Region } from "@medusajs/medusa"
import { Table, Text } from "@medusajs/ui"

import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"
import { formatAmount } from "@lib/util/prices"

type ItemProps = {
  item: Omit<LineItem, "beforeInsert">
  region: Region
}

const Item = ({ item, region }: ItemProps) => {
  // Get product weight from the variant's product
  const productWeight = item.variant.product.weight
  
  // Format unit weight
  const formatUnitWeight = (weight?: number | null): string => {
    if (!weight) return "";
    
    if (weight < 1000) {
      return `${Math.round(weight)}g`;
    } else {
      return `${(weight / 1000).toFixed(1)}kg`;
    }
  };
  
  // Get unit weight display
  const unitWeightDisplay = formatUnitWeight(productWeight);
  
  // Format unit price
  const unitPrice = item.unit_price || 0;
  const formattedUnitPrice = formatAmount({
    amount: unitPrice,
    region: region,
    includeTaxes: true,
  });
  
  // Remove currency prefix (NZ) for display in calculation
  const displayUnitPrice = formattedUnitPrice.replace("NZ", "");
  
  // Create display in format "unit weight @ price × quantity"
  const hasWeight = typeof productWeight === 'number' && productWeight > 0;
  const atSymbol = hasWeight ? "@" : "";
  const calculationDisplay = unitWeightDisplay 
    ? `${unitWeightDisplay} ${atSymbol} ${displayUnitPrice} × ${item.quantity}`
    : `${displayUnitPrice} × ${item.quantity}`;
  
  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="!pl-0 p-4 w-16">
        <div className="flex w-12 small:w-16">
          <Thumbnail thumbnail={item.thumbnail} size="square" />
        </div>
      </Table.Cell>

      <Table.Cell className="text-left max-w-[40%]">
        <Text className="txt-medium-plus text-ui-fg-base" data-testid="product-name">{item.title}</Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" isHidden />
        
        {/* Display calculation on mobile screens */}
        <div className="mt-1 block small:hidden">
          <Text className="text-sm text-ui-fg-muted" data-testid="product-calculation-mobile">
            {calculationDisplay}
          </Text>
        </div>
      </Table.Cell>

      <Table.Cell className="!pr-0">
        <span className="!pr-0 flex flex-col items-end h-full justify-center">
          {/* Hide calculation on small screens, show on larger screens */}
          <Text className="text-ui-fg-muted hidden small:block" data-testid="product-calculation-display">
            {calculationDisplay}
          </Text>
          <LineItemPrice item={item} region={region} style="tight" />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
