<template>
  <BaseButton
    :disabled="disabled || isProcessing"
    variant="secondary"
    size="md"
    :icon="isProcessing ? ArrowPathIcon : PrinterIcon"
    :icon-only="!showLabel"
    :aria-label="isProcessing ? PRINT_DATA_LIST_LOADING_ARIA_LABEL : PRINT_DATA_LIST_BUTTON_ARIA_LABEL"
    :aria-busy="isProcessing"
    :title="isProcessing ? PRINT_DATA_LIST_LOADING_TOOLTIP : PRINT_DATA_LIST_BUTTON_TOOLTIP"
    class="border-slate-300 bg-white text-slate-700"
    :class="{ '[&>svg]:animate-spin': isProcessing }"
    @click="handlePrint"
  >
    <template v-if="showLabel">
      {{ isProcessing ? PRINT_DATA_LIST_LOADING_LABEL : PRINT_DATA_LIST_BUTTON_LABEL }}
    </template>
  </BaseButton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowPathIcon, PrinterIcon } from '@heroicons/vue/24/outline'
import BaseButton from '~/components/ui/BaseButton.vue'
import {
  PRINT_DATA_LIST_BUTTON_ARIA_LABEL,
  PRINT_DATA_LIST_BUTTON_LABEL,
  PRINT_DATA_LIST_BUTTON_TOOLTIP,
  PRINT_DATA_LIST_EMPTY_MESSAGE,
  PRINT_DATA_LIST_EMPTY_TITLE,
  PRINT_DATA_LIST_ERROR_MESSAGE,
  PRINT_DATA_LIST_ERROR_TITLE,
  PRINT_DATA_LIST_LOADING_ARIA_LABEL,
  PRINT_DATA_LIST_LOADING_LABEL,
  PRINT_DATA_LIST_LOADING_TOOLTIP,
} from '~/constants/ui.constants'
import { useToast } from '~/composables/useToast'
import { recordPrintedTableAuditEndpoint } from '~/utils/audit-endpoints'
import { isPrintDataListEmptyError } from '~/utils/print-errors'

interface PrintDataListButtonProps {
  tableName: string
  tableLabel?: string
  filters?: Record<string, unknown> | null
  disabled?: boolean
  showLabel?: boolean
  getPrintData: () => Promise<unknown>
}

const props = withDefaults(defineProps<PrintDataListButtonProps>(), {
  tableLabel: '',
  filters: null,
  disabled: false,
  showLabel: false,
})

const emit = defineEmits<{
  printed: [payload: unknown]
}>()

const isProcessing = ref(false)

const handlePrint = async (): Promise<void> => {
  if (isProcessing.value) {
    return
  }

  isProcessing.value = true

  try {
    const printData = await props.getPrintData()

    await recordPrintedTableAuditEndpoint({
      tableName: props.tableName,
      tableLabel: props.tableLabel || null,
      filters: props.filters,
    })

    emit('printed', printData)
  } finally {
    isProcessing.value = false
  }
}
</script>
