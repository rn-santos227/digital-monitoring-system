<template>
  <section class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
    <div>
      <h2 class="text-sm font-semibold text-slate-900">{{ USERS_PROFILE_FILTER_CARD_TITLE }}</h2>
      <p class="mt-1 text-sm text-slate-600">
        {{ activeConditionCount ? `${activeConditionCount} advanced search condition${activeConditionCount === 1 ? '' : 's'} applied` : 'No advanced search conditions applied' }}
      </p>
    </div>
    <div class="flex gap-2">
      <BaseButton
        v-if="activeConditionCount"
        type="button"
        variant="ghost"
        size="sm"
        @click="emit('reset')"
      >
        {{ USERS_PROFILE_FILTER_RESET_LABEL }}
      </BaseButton>
      <BaseButton type="button" size="sm" icon-name="magnifying-glass" @click="isModalOpen = true">
        Advanced search
      </BaseButton>
    </div>

    <AdvancedSearchModal
      v-if="isModalOpen"
      :fields="fieldOptions"
      :model-value="advancedSearchValue"
      @apply="emitApply"
      @clear="emitReset"
      @close="isModalOpen = false"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import type { UserProfileSearchCondition, UserProfilesSearchQuery } from '~/types/domain/users'
import {
  USERS_PROFILE_FILTER_CARD_TITLE,
  USERS_PROFILE_FILTER_FIELD_OPTIONS,
  USERS_PROFILE_FILTER_RESET_LABEL,
} from '~/constants/page.constants'

const props = withDefaults(defineProps<{
  modelValue: Partial<UserProfilesSearchQuery>
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<UserProfilesSearchQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = USERS_PROFILE_FILTER_FIELD_OPTIONS.filter(option => option.value)
const conditions = computed<UserProfileSearchCondition[]>(() => {
  if (!props.modelValue.conditions) {
    return props.modelValue.term
      ? [{
          id: 'legacy-condition',
          field: props.modelValue.fields || fieldOptions[0]?.value || '',
          operator: 'contains',
          value: props.modelValue.term || '',
        }]
      : []
  }

  try {
    const parsed: unknown = JSON.parse(props.modelValue.conditions)
    return Array.isArray(parsed) ? parsed as UserProfileSearchCondition[] : []
  } catch {
    return []
  }
})
const activeConditionCount = computed(() => conditions.value.length)
const advancedSearchValue = computed<AdvancedSearchValue>(() => ({
  match: props.modelValue.match ?? 'all',
  conditions: conditions.value,
}))

const emitApply = (value: AdvancedSearchValue) => {
  emit('apply', { conditions: JSON.stringify(value.conditions), match: value.match })
  isModalOpen.value = false
}

const emitReset = () => {
  emit('reset')
  isModalOpen.value = false
}
</script>
