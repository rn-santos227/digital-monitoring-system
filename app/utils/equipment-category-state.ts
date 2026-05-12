import type { EquipmentCategoryKpiCounts } from '~/types/domain/equipment'

export const updateEquipmentCategoryKpis = (
  kpis: EquipmentCategoryKpiCounts,
  updates: Partial<EquipmentCategoryKpiCounts>,
): EquipmentCategoryKpiCounts => ({
  totalCategories: Math.max(0, updates.totalCategories ?? kpis.totalCategories),
  unusedCategories: Math.max(0, updates.unusedCategories ?? kpis.unusedCategories),
})
