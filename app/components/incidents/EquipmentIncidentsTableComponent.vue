<template>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EQUIPMENT_PRIVILEGES } from '~/constants/privileges.constants'
import {
  EQUIPMENT_INCIDENTS_TABLE_ACTIONS,
  EQUIPMENT_INCIDENTS_TABLE_ACTIONS_COLUMN_LABEL,
  EQUIPMENT_INCIDENTS_TABLE_COLUMNS,
  EQUIPMENT_INCIDENTS_TABLE_EMPTY_MESSAGE,
  EQUIPMENT_INCIDENTS_TABLE_TITLE,
} from '~/constants/table.constants'
import { useAuthStore } from '~/stores/auth'
import type { EquipmentIncidentTableRow } from '~/types/domain/incident'

const props = withDefaults(defineProps<{

}>(), {
  
)
</script>
