import { defineEventHandler, getQuery } from 'h3'
import { EQUIPMENT_ACCOUNTING_SUBJECT_CONFIG } from '../../shared/constants'
import type { EquipmentAccountingResponse } from '../../shared/responses'
import { parseEquipmentAccountingQuery } from '../../shared/validation'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { requireAuth } from '../../utils/auth/requireAuth'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEquipmentAccounting } from '../../utils/equipment-accounting/fetchEquipmentAccounting'

export default defineEventHandler(async (event): Promise<EquipmentAccountingResponse> => {
  await requireAuth(event)
  const { subject, subjectId, page, pageSize, rangeFrom, rangeTo } = parseEquipmentAccountingQuery(getQuery(event))
  await requireAnyPermission(event, EQUIPMENT_ACCOUNTING_SUBJECT_CONFIG[subject].permissions)

  const result = await fetchEquipmentAccounting(getServiceSupabaseClient(), subject, subjectId, rangeFrom, rangeTo)
  return {
    ...result,
    page,
    pageSize,
    totalPages: result.totalItems === 0 ? 0 : Math.ceil(result.totalItems / pageSize),
  }
})
