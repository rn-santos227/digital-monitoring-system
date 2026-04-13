<template>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  BASE_TABLE_ACTIONS_CELL_CLASSES,
  BASE_TABLE_BODY_CELL_CLASSES,
  BASE_TABLE_CLASSES,
  BASE_TABLE_EMPTY_STATE_CLASSES,
  BASE_TABLE_HEAD_CELL_CLASSES,
  BASE_TABLE_HEAD_CLASSES,
  BASE_TABLE_HEADING_CLASSES,
  BASE_TABLE_ROW_CLASSES,
  BASE_TABLE_SCROLL_CLASSES,
  BASE_TABLE_SEARCH_WRAPPER_CLASSES,
  BASE_TABLE_WINDOW_WRAPPER_CLASSES,
  type DataTableAction,
  type DataTableColumn,
} from '~/constants/ui.constants'
import { resolveDataTableAlignClass, resolveDataTableRowKey } from '~/utils/data-table'
</script>
