<template>
  <section :class="EQUIPMENT_ACCOUNTING_SECTION_CLASSES">
    <BaseCard :title="EQUIPMENT_ACCOUNTING_TITLE" :subtitle="EQUIPMENT_ACCOUNTING_DESCRIPTION">
      <BaseAlert v-if="error" :message="error" tone="danger" />
      <BaseInlineLoader v-else-if="isLoading" :label="EQUIPMENT_ACCOUNTING_LOADING_MESSAGE" />
      <dl v-else-if="response" :class="EQUIPMENT_ACCOUNTING_SUMMARY_CLASSES">
        <div>
          <dt>{{ EQUIPMENT_ACCOUNTING_TOTAL_LABEL }}</dt>
          <dd>{{ formatEquipmentPrice(response.summary.totalValue) }}</dd>
        </div>
        <div>
          <dt>{{ EQUIPMENT_ACCOUNTING_ASSETS_LABEL }}</dt>
          <dd>{{ response.summary.assetCount }}</dd>
        </div>
        <div>
          <dt>{{ EQUIPMENT_ACCOUNTING_QUANTITY_LABEL }}</dt>
          <dd>{{ response.summary.quantity }}</dd>
        </div>
        <div>
          <dt>{{ EQUIPMENT_ACCOUNTING_UNPRICED_LABEL }}</dt>
          <dd>{{ response.summary.unpricedAssetCount }}</dd>
        </div>
      </dl>
    </BaseCard>
    <BaseAlert
      v-if="response && response.summary.unpricedAssetCount > 0"
      :message="EQUIPMENT_ACCOUNTING_UNPRICED_WARNING"
      tone="warning"
    />
    <DataTable
      v-if="!error"
      :title="EQUIPMENT_ACCOUNTING_TABLE_TITLE"
      :columns="EQUIPMENT_ACCOUNTING_TABLE_COLUMNS"
      :rows="rows"
      row-key="id"
      :show-search="false"
      :is-loading="isLoading"
      :empty-message="EQUIPMENT_ACCOUNTING_TABLE_EMPTY_MESSAGE"
      :current-page="page"
      :page-size="pageSize"
      :total-items="response?.totalItems ?? 0"
      :total-pages="response?.totalPages ?? 0"
      @update:current-page="page = $event"
      @update:page-size="onPageSizeChange"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  EQUIPMENT_ACCOUNTING_ASSETS_LABEL,
  EQUIPMENT_ACCOUNTING_DESCRIPTION,
  EQUIPMENT_ACCOUNTING_ERROR_MESSAGE,
  EQUIPMENT_ACCOUNTING_LOADING_MESSAGE,
  EQUIPMENT_ACCOUNTING_QUANTITY_LABEL,
  EQUIPMENT_ACCOUNTING_SECTION_CLASSES,
  EQUIPMENT_ACCOUNTING_SUMMARY_CLASSES,
  EQUIPMENT_ACCOUNTING_TITLE,
  EQUIPMENT_ACCOUNTING_TOTAL_LABEL,
  EQUIPMENT_ACCOUNTING_UNPRICED_LABEL,
  EQUIPMENT_ACCOUNTING_UNPRICED_WARNING,
} from '~/constants/page.constants'
import {
  EQUIPMENT_ACCOUNTING_TABLE_COLUMNS,
  EQUIPMENT_ACCOUNTING_TABLE_EMPTY_MESSAGE,
  EQUIPMENT_ACCOUNTING_TABLE_TITLE,
} from '~/constants/table.constants'
import type { EquipmentAccountingResponse, EquipmentAccountingSubject } from '~/types/domain/equipment-accounting'
import { formatEquipmentPrice } from '~/utils/equipment-accounting'
import { getEquipmentAccountingEndpoint } from '~/utils/equipment-accounting-endpoints'

const props = defineProps<{
  subject: EquipmentAccountingSubject
  subjectId: string
  refreshKey?: unknown
}>()

const page = ref(1)
const pageSize = ref(10)
const response = ref<EquipmentAccountingResponse | null>(null)
const isLoading = ref(false)
const error = ref('')
let requestVersion = 0

const rows = computed(() => (response.value?.items ?? []).map((item) => ({
  ...item,
  unitPriceDisplay: formatEquipmentPrice(item.unitPrice),
  assignedValueDisplay: formatEquipmentPrice(item.assignedValue),
})))

const onPageSizeChange = (value: number) => {
  page.value = 1
  pageSize.value = value
}

watch(() => [props.subject, props.subjectId, props.refreshKey], () => {
  page.value = 1
})

watch(
  () => [props.subject, props.subjectId, props.refreshKey, page.value, pageSize.value],
  async () => {
    const version = ++requestVersion
    response.value = null
    error.value = ''
    if (!props.subjectId) {
      isLoading.value = false
      return
    }
    isLoading.value = true

    try {
      const result = await getEquipmentAccountingEndpoint({
        subject: props.subject,
        subjectId: props.subjectId,
        page: page.value,
        pageSize: pageSize.value,
      })
      if (version === requestVersion) response.value = result
    } catch {
      if (version === requestVersion) error.value = EQUIPMENT_ACCOUNTING_ERROR_MESSAGE
    } finally {
      if (version === requestVersion) isLoading.value = false
    }
  },
  { immediate: true },
)
</script>
