import type { Ref } from 'vue'
import {
  getPersonnelDeploymentRecordsEndpoint,
  getPersonnelEngagementRecordsEndpoint,
  getPersonnelEquipmentIssuancesEndpoint,
  getPersonnelTrainingRecordsEndpoint,
} from '~/utils/personnel-endpoints'
import { usePersonnelStore } from '~/stores/personnel'
import type {
  PersonnelDeploymentRecordListItem,
  PersonnelDetail,
  PersonnelEngagementRecordListItem,
  PersonnelEquipmentIssuanceListItem,
  PersonnelTrainingRecordListItem,
} from '~/types/domain/personnel'
import type {
  PersonnelProfileTrainingRow,
  PersonnelProfileDeploymentRow,
  PersonnelProfileEngagementRow,
  PersonnelProfileEquipmentRow,
} from '~/constants/ui.constants'

interface UsePersonnelProfileLoaderOptions {
  personnelStore: ReturnType<typeof usePersonnelStore>
  personnel: Ref<(PersonnelDetail & { fullName: string }) | null>
  trainingRows: Ref<PersonnelProfileTrainingRow[]>
  deploymentRows: Ref<PersonnelProfileDeploymentRow[]>
  engagementRows: Ref<PersonnelProfileEngagementRow[]>
  equipmentAssignmentRows: Ref<PersonnelProfileEquipmentRow[]>
}

export const usePersonnelProfileLoader = ({
  personnelStore,
  personnel,
  trainingRows,
  deploymentRows,
  engagementRows,
  equipmentAssignmentRows,
}: UsePersonnelProfileLoaderOptions) => {
  const loadPersonnelProfile = async (id: string) => {
    const response = await personnelStore.fetchPersonnelById(id)
    const [trainingResponse, deploymentResponse, engagementResponse, equipmentResponse] = await Promise.all([
      getPersonnelTrainingRecordsEndpoint(id),
      getPersonnelDeploymentRecordsEndpoint(id),
      getPersonnelEngagementRecordsEndpoint(id),
      getPersonnelEquipmentIssuancesEndpoint(id),
    ])

    const fullName = [response.firstName, response.middleName, response.lastName].filter(Boolean).join(' ')
    personnel.value = {
      ...response,
      fullName,
    }
    trainingRows.value = trainingResponse.items.map((item: PersonnelTrainingRecordListItem) => ({
      id: item.id,
      courseName: item.title,
      provider: item.category ?? 'N/A',
      completedAt: item.endDate ?? item.validUntil ?? item.startDate ?? 'Not set',
      remarks: item.remarks ?? '—',
    }))
    deploymentRows.value = deploymentResponse.items.map((item: PersonnelDeploymentRecordListItem) => ({
      id: item.id,
      location: item.location ?? item.deploymentArea,
      operationName: item.operationName ?? 'N/A',
      startedAt: item.startDate,
      endedAt: item.endDate ?? 'Ongoing',
      status: item.status,
    }))
    engagementRows.value = engagementResponse.items.map((item: PersonnelEngagementRecordListItem) => ({
      id: item.id,
      eventType: item.type,
      location: item.title,
      recordedAt: item.startDate ?? 'Not set',
      outcome: item.status,
    }))
    equipmentAssignmentRows.value = equipmentResponse.items.map((item: PersonnelEquipmentIssuanceListItem) => ({
      id: item.id,
      assetCode: item.assetTag,
      itemName: item.equipmentItemName,
      issuedAt: item.issueDate,
      returnedAt: item.actualReturnDate ?? 'Not returned',
      assignmentStatus: item.status,
    }))
  }

  return {
    loadPersonnelProfile,
  }
}
