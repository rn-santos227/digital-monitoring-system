<template>
  <BaseCard :class="SERVICE_STATUS_PERSONNEL_TABLE_CARD_CLASSES">
    <div :class="SERVICE_STATUS_PERSONNEL_TABLE_HEADER_CLASSES">
      <h3 :class="SERVICE_STATUS_PERSONNEL_TABLE_TITLE_CLASSES">{{ SERVICE_STATUS_PERSONNEL_TABLE_TITLE }}</h3>
      <p :class="SERVICE_STATUS_PERSONNEL_TABLE_SUBTITLE_CLASSES">{{ SERVICE_STATUS_PERSONNEL_TABLE_SUBTITLE }}</p>
    </div>
    <div :class="SERVICE_STATUS_PERSONNEL_TABLE_SCROLL_CLASSES">
      <table :class="SERVICE_STATUS_PERSONNEL_TABLE_CLASSES">
        <thead :class="SERVICE_STATUS_PERSONNEL_TABLE_HEAD_CLASSES">
          <tr>
            <th :class="SERVICE_STATUS_PERSONNEL_TABLE_TH_CLASSES">{{ SERVICE_STATUS_PERSONNEL_TABLE_COLUMN_PERSONNEL }}</th>
            <th :class="SERVICE_STATUS_PERSONNEL_TABLE_TH_CLASSES">{{ SERVICE_STATUS_PERSONNEL_TABLE_COLUMN_OPERATION }}</th>
            <th :class="SERVICE_STATUS_PERSONNEL_TABLE_TH_CLASSES">{{ SERVICE_STATUS_PERSONNEL_TABLE_COLUMN_AREA }}</th>
            <th :class="SERVICE_STATUS_PERSONNEL_TABLE_TH_CLASSES">{{ SERVICE_STATUS_PERSONNEL_TABLE_COLUMN_COORDINATES }}</th>
          </tr>
        </thead>
        <tbody :class="SERVICE_STATUS_PERSONNEL_TABLE_BODY_CLASSES">
          <tr
            v-for="item in items"
            :key="item.personnelId"
            :class="SERVICE_STATUS_PERSONNEL_TABLE_ROW_CLASSES"
            @click="$emit('select', item)"
          >
            <td :class="SERVICE_STATUS_PERSONNEL_TABLE_CELL_PRIMARY_CLASSES">{{ item.personnelName ?? SERVICE_STATUS_PERSONNEL_TABLE_UNNAMED_PERSONNEL }}</td>
            <td :class="SERVICE_STATUS_PERSONNEL_TABLE_CELL_CLASSES">{{ item.operationName ?? SERVICE_STATUS_PERSONNEL_TABLE_UNSPECIFIED_OPERATION }}</td>
            <td :class="SERVICE_STATUS_PERSONNEL_TABLE_CELL_CLASSES">{{ item.deploymentArea }}</td>
            <td :class="SERVICE_STATUS_PERSONNEL_TABLE_CELL_CLASSES">{{ formatCoordinates(item.latitude, item.longitude) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'
import {
  SERVICE_STATUS_PERSONNEL_TABLE_BODY_CLASSES,
  SERVICE_STATUS_PERSONNEL_TABLE_CARD_CLASSES,
  SERVICE_STATUS_PERSONNEL_TABLE_CELL_CLASSES,
  SERVICE_STATUS_PERSONNEL_TABLE_CELL_PRIMARY_CLASSES,
  SERVICE_STATUS_PERSONNEL_TABLE_HEAD_CLASSES,
  SERVICE_STATUS_PERSONNEL_TABLE_HEADER_CLASSES,
  SERVICE_STATUS_PERSONNEL_TABLE_ROW_CLASSES,
  SERVICE_STATUS_PERSONNEL_TABLE_SCROLL_CLASSES,
  SERVICE_STATUS_PERSONNEL_TABLE_SUBTITLE_CLASSES,
  SERVICE_STATUS_PERSONNEL_TABLE_TH_CLASSES,
  SERVICE_STATUS_PERSONNEL_TABLE_TITLE_CLASSES,
  SERVICE_STATUS_PERSONNEL_TABLE_CLASSES,
} from '~/constants/ui.constants'
import {
  SERVICE_STATUS_PERSONNEL_TABLE_COLUMN_AREA,
  SERVICE_STATUS_PERSONNEL_TABLE_COLUMN_COORDINATES,
  SERVICE_STATUS_PERSONNEL_TABLE_COLUMN_OPERATION,
  SERVICE_STATUS_PERSONNEL_TABLE_COLUMN_PERSONNEL,
  SERVICE_STATUS_PERSONNEL_TABLE_NO_COORDINATES,
  SERVICE_STATUS_PERSONNEL_TABLE_SUBTITLE,
  SERVICE_STATUS_PERSONNEL_TABLE_TITLE,
  SERVICE_STATUS_PERSONNEL_TABLE_UNNAMED_PERSONNEL,
  SERVICE_STATUS_PERSONNEL_TABLE_UNSPECIFIED_OPERATION,
} from '~/constants/table.constants'
import type { PersonnelLocationItem } from '~/types/domain/personnel'

defineProps<{ items: PersonnelLocationItem[] }>()
defineEmits<{ (event: 'select', item: PersonnelLocationItem): void }>()

const formatCoordinates = (latitude: number | null, longitude: number | null) => {
  if (latitude === null || longitude === null) {
    return SERVICE_STATUS_PERSONNEL_TABLE_NO_COORDINATES
  }

  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
}
</script>
