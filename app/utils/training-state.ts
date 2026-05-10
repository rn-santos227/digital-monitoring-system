import type { TrainingManagementKpiCounts } from '~/types/domain/training'

export const updateTrainingKpis = (
  kpis: TrainingManagementKpiCounts,
  updates: Partial<TrainingManagementKpiCounts>,
): TrainingManagementKpiCounts => ({
  totalRecords: Math.max(0, updates.totalRecords ?? kpis.totalRecords),
  totalTrainings: Math.max(0, updates.totalTrainings ?? kpis.totalTrainings),
  totalCategories: Math.max(0, updates.totalCategories ?? kpis.totalCategories),
  unusedCategories: Math.max(0, updates.unusedCategories ?? kpis.unusedCategories),
})
