import type { Ref } from 'vue'
import type { AuditLogListItem } from '~/types/domain/audit'
import type { EquipmentIncidentListItem } from '~/types/domain/incident'
import { getEquipmentIncidentByIdEndpoint } from '~/utils/incident-endpoints'
import { searchAuditLogsEndpoint } from '~/utils/audit-endpoints'

interface UseIncidentProfileLoaderOptions {
  incident: Ref<EquipmentIncidentListItem | null>
  incidentAuditLogs: Ref<AuditLogListItem[]>
  auditError: Ref<string>
  isLoadingAuditLogs: Ref<boolean>
}

export const useIncidentProfileLoader = ({
  incident,
  incidentAuditLogs,
  auditError,
  isLoadingAuditLogs,
}: UseIncidentProfileLoaderOptions) => {
  const loadIncidentAuditLogs = async (id: string) => {
    isLoadingAuditLogs.value = true
    auditError.value = ''

    try {
      const response = await searchAuditLogsEndpoint({
        page: 1,
        pageSize: 25,
        term: id,
        fields: 'recordId',
      })
      incidentAuditLogs.value = response.items.filter((item) => item.tableName === 'equipment_incidents')
    } catch {
      auditError.value = 'Unable to load incident update and status-change audit logs.'
    } finally {
      isLoadingAuditLogs.value = false
    }
  }

  const loadIncidentProfile = async (id: string) => {
    incident.value = await getEquipmentIncidentByIdEndpoint(id)
    await loadIncidentAuditLogs(id)
  }

  return {
    loadIncidentProfile,
  }
}
