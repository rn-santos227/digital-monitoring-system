<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import {
  EQUIPMENT_ASSETS_FILTER_CARD_TITLE,
  EQUIPMENT_ASSETS_FILTER_FIELD_OPTIONS,
  EQUIPMENT_ASSETS_FILTER_RESET_LABEL,
} from '~/constants/page.constants'
import type { EquipmentAssetSearchCondition, EquipmentAssetSearchQuery } from '~/types/domain/equipment'

const props = withDefaults(defineProps<{
  modelValue: Partial<EquipmentAssetSearchQuery>
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<EquipmentAssetSearchQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = EQUIPMENT_ASSETS_FILTER_FIELD_OPTIONS
const conditions = computed<EquipmentAssetSearchCondition[]>(() => {
})
</script>