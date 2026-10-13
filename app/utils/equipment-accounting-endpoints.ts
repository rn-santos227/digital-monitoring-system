import { EQUIPMENT_ACCOUNTING_API_ENDPOINT } from '~/constants/api.constants'
import type { EquipmentAccountingQuery, EquipmentAccountingResponse } from '~/types/domain/equipment-accounting'
import { createSessionHeaders } from '~/utils/auth-session'

export const getEquipmentAccountingEndpoint = async (
  query: EquipmentAccountingQuery,
): Promise<EquipmentAccountingResponse> => {
  return await $fetch<EquipmentAccountingResponse>(EQUIPMENT_ACCOUNTING_API_ENDPOINT, {
    method: 'GET',
    headers: createSessionHeaders(),
    query,
  })
}
