import { defineEventHandler } from 'h3'
import { PERMISSION_CODES, TRAINING_PERMISSION_GROUPS } from '../../shared/constants'
import type { TrainingManagementKpiApiResponse } from '../../shared/responses'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchTrainingKpiCounts } from '../../utils/trainings/fetchTrainingKpiCounts'

const TRAINING_KPI_PERMISSION_CODES = [
  ...TRAINING_PERMISSION_GROUPS.trainingManagement,
  PERMISSION_CODES.trainingManage,
] as const

export default defineEventHandler(async (event): Promise<TrainingManagementKpiApiResponse> => {
  await requireAnyPermission(event, TRAINING_KPI_PERMISSION_CODES)
  return await fetchTrainingKpiCounts(getServiceSupabaseClient())
})
