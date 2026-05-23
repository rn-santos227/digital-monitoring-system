<template>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EQUIPMENT_PRIVILEGES } from '~/constants/privileges.constants'
import {
  EQUIPMENT_CATEGORIES_TABLE_ACTIONS,
  EQUIPMENT_CATEGORIES_TABLE_ACTIONS_COLUMN_LABEL,
  EQUIPMENT_CATEGORIES_TABLE_COLUMNS,
  EQUIPMENT_CATEGORIES_TABLE_EMPTY_MESSAGE,
  EQUIPMENT_CATEGORIES_TABLE_TITLE,
} from '~/constants/table.constants'
import { useAuthStore } from '~/stores/auth'

</script>