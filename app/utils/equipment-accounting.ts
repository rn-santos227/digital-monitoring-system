import { EQUIPMENT_PRICE_UNKNOWN } from '~/constants/page.constants'

const equipmentPriceFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatEquipmentPrice = (value: number | null): string => {
  return value === null ? EQUIPMENT_PRICE_UNKNOWN : equipmentPriceFormatter.format(value)
}
