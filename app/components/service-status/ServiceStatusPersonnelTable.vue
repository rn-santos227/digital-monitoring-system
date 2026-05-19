<template>
  <DataTable
    :title="SERVICE_STATUS_PERSONNEL_TABLE_TITLE"
    :columns="SERVICE_STATUS_PERSONNEL_TABLE_COLUMNS"
    :rows="rows"
    row-key="id"
    :actions="SERVICE_STATUS_PERSONNEL_TABLE_ACTIONS"
    :action-button-count="SERVICE_STATUS_PERSONNEL_TABLE_ACTIONS.length"
    :actions-column-label="SERVICE_STATUS_PERSONNEL_TABLE_ACTIONS_COLUMN_LABEL"
    :show-search="false"
    :empty-message="SERVICE_STATUS_PERSONNEL_TABLE_EMPTY_MESSAGE"
    @action="handleAction"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DataTable from '~/components/table/DataTable.vue'
import {
  SERVICE_STATUS_PERSONNEL_TABLE_ACTIONS,
  SERVICE_STATUS_PERSONNEL_TABLE_ACTIONS_COLUMN_LABEL,
  SERVICE_STATUS_PERSONNEL_TABLE_COLUMNS,
  SERVICE_STATUS_PERSONNEL_TABLE_EMPTY_MESSAGE,
  SERVICE_STATUS_PERSONNEL_TABLE_NO_COORDINATES,
  SERVICE_STATUS_PERSONNEL_TABLE_TITLE,
  SERVICE_STATUS_PERSONNEL_TABLE_UNNAMED_PERSONNEL,
  SERVICE_STATUS_PERSONNEL_TABLE_UNSPECIFIED_OPERATION,
} from '~/constants/table.constants'
import type { PersonnelLocationItem } from '~/types/domain/personnel'

interface ServiceStatusTableRow {
  id: string
  personnelName: string
  operationName: string
  deploymentArea: string
  coordinates: string
  item: PersonnelLocationItem
}

type ServiceStatusTableActionKey = 'assign-deployment' | 'assign-engagement' | 'assign-training'

const props = defineProps<{ items: PersonnelLocationItem[] }>()
const emit = defineEmits<{
  (event: 'assign-deployment', item: PersonnelLocationItem): void
  (event: 'assign-engagement', item: PersonnelLocationItem): void
  (event: 'assign-training', item: PersonnelLocationItem): void
}>()

const formatCoordinates = (latitude: number | null, longitude: number | null) => {
  if (latitude === null || longitude === null) {
    return SERVICE_STATUS_PERSONNEL_TABLE_NO_COORDINATES
  }

  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
}

const rows = computed<ServiceStatusTableRow[]>(() => {
  return props.items.map((item) => ({
    id: item.personnelId,
    personnelName: item.personnelName ?? SERVICE_STATUS_PERSONNEL_TABLE_UNNAMED_PERSONNEL,
    operationName: item.operationName ?? SERVICE_STATUS_PERSONNEL_TABLE_UNSPECIFIED_OPERATION,
    deploymentArea: item.deploymentArea,
    coordinates: formatCoordinates(item.latitude, item.longitude),
    item,
  }))
})

const handleAction = (payload: { actionKey: string; row: ServiceStatusTableRow }) => {
  const actionKey = payload.actionKey as ServiceStatusTableActionKey
  const { item } = payload.row

  if (actionKey === 'assign-deployment') {
    emit('assign-deployment', item)
    return
  }

  if (actionKey === 'assign-engagement') {
    emit('assign-engagement', item)
    return
  }

  if (actionKey === 'assign-training') {
    emit('assign-training', item)
  }
}
</script>
