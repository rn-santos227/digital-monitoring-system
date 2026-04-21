<template>
  <BaseSuggestionField
    :model-value="modelValue"
    :options="suggestionOptions"
    :label="label"
    :placeholder="placeholder"
    :helper-text="helperText"
    :empty-message="emptyMessage"
    :error="error"
    :disabled="disabled"
    @update:model-value="onModelValueUpdate"
    @query-change="onQueryChange"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { SuggestionFieldOption } from '~/constants/ui.constants'
import {
  USERS_PROFILE_PERSONNEL_EMPTY_MESSAGE,
  USERS_PROFILE_PERSONNEL_HELPER_TEXT,
  USERS_PROFILE_PERSONNEL_LABEL,
  USERS_PROFILE_PERSONNEL_PLACEHOLDER,
} from '~/constants/page.constants'
import type { UserPersonnelSuggestion } from '~/types/domain/users'
import { getUserPersonnelSuggestionsEndpoint } from '~/utils/users-endpoints'

const props = withDefaults(
  defineProps<{
    modelValue: string | null
    selectedPersonnelId?: string | null
    label?: string
    placeholder?: string
    helperText?: string
    emptyMessage?: string
    error?: string
    disabled?: boolean
  }>(),
  {
    selectedPersonnelId: null,
    label: USERS_PROFILE_PERSONNEL_LABEL,
    placeholder: USERS_PROFILE_PERSONNEL_PLACEHOLDER,
    helperText: USERS_PROFILE_PERSONNEL_HELPER_TEXT,
    emptyMessage: USERS_PROFILE_PERSONNEL_EMPTY_MESSAGE,
    error: '',
    disabled: false,
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void
  (event: 'select', payload: UserPersonnelSuggestion | null): void
}>()

const suggestions = ref<UserPersonnelSuggestion[]>([])
const searchTerm = ref('')

const suggestionOptions = computed<SuggestionFieldOption[]>(() => {
  return suggestions.value.map((item) => ({
    value: item.id,
    label: `${item.fullName} (${item.personnelCode})`,
    description: `${item.rankName} • ${item.serviceNumber}`,
  }))
})

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const fetchSuggestions = async () => {
  const response = await getUserPersonnelSuggestionsEndpoint({
    term: searchTerm.value,
    pageSize: 10,
    selectedPersonnelId: props.selectedPersonnelId ?? undefined,
  })

  suggestions.value = response.items
}

watch(
  () => props.modelValue,
  async (nextValue) => {
    if (nextValue && !suggestions.value.some(item => item.id === nextValue)) {
      await fetchSuggestions()
    }
  },
  { immediate: true }
)

watch(searchTerm, () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    void fetchSuggestions()
  }, 250)
})

const onModelValueUpdate = (value: string | string[] | null) => {
  if (Array.isArray(value)) {
    return
  }

  const nextValue = value && value.length > 0 ? value : null
  emit('update:modelValue', nextValue)

  const selectedItem = suggestions.value.find((item) => item.id === nextValue) ?? null
  emit('select', selectedItem)

  if (!selectedItem) {
    searchTerm.value = ''
    return
  }

  searchTerm.value = selectedItem.fullName
}

const onQueryChange = (value: string) => {
  searchTerm.value = value
}
</script>
