/**
 * Formats a quantity with appropriate units based on product weight
 * @param quantity - The quantity value
 * @param weight - The weight in grams (optional)
 * @returns Formatted quantity with appropriate unit
 */
export const formatQuantityUnit = (
  quantity: number,
  weight?: number | null
): string => {
  // If no weight is provided, return the quantity as count
  if (weight === undefined || weight === null) {
    return `${quantity}`
  }

  // Use the weight of a single unit to calculate the total
  const unitWeight = weight;
  const totalWeight = quantity * unitWeight;

  // For order summary display, we want to show the total weight
  // If total weight is less than 1000g, display in grams
  if (totalWeight < 1000) {
    return `${Math.round(totalWeight)}g`
  }

  // If total weight is 1000g or more, display in kilograms with one decimal place
  const kgWeight = totalWeight / 1000
  return `${kgWeight.toFixed(1)}kg`
} 