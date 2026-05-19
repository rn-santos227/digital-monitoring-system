<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import DataTable from '~/components/table/DataTable.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import {
  SERVICE_STATUS_PERSONNEL_TABLE_COLUMNS,
  SERVICE_STATUS_PERSONNEL_TABLE_EMPTY_MESSAGE,
  SERVICE_STATUS_PERSONNEL_TABLE_NO_COORDINATES,
  SERVICE_STATUS_PERSONNEL_TABLE_SEARCH_PLACEHOLDER,
  SERVICE_STATUS_PERSONNEL_TABLE_TITLE,
  SERVICE_STATUS_PERSONNEL_TABLE_UNNAMED_PERSONNEL,
  SERVICE_STATUS_PERSONNEL_TABLE_UNSPECIFIED_OPERATION,
} from '~/constants/table.constants'
import type { PersonnelLocationItem } from '~/types/domain/personnel'
</script>