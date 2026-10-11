<template>
  <BaseSuggestionField
    :model-value="modelValue"
    :options="options"
    :label="PERSONNEL_SKILL_TRAINING_LABEL"
    :placeholder="PERSONNEL_SKILL_TRAINING_PLACEHOLDER"
    :helper-text="PERSONNEL_SKILL_TRAINING_HELPER"
    :empty-message="PERSONNEL_SKILL_TRAINING_EMPTY_MESSAGE"
    :error="loadError || error"
    :is-loading="isLoading"
    required
    @update:model-value="onSelect"
    @query-change="term = $event"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { PersonnelSkillTrainingRow } from '~/types/domain/personnel-skills'
import {
  PERSONNEL_SKILL_TRAINING_LABEL,
  PERSONNEL_SKILL_TRAINING_PLACEHOLDER,
  PERSONNEL_SKILL_TRAINING_HELPER,
  PERSONNEL_SKILL_TRAINING_EMPTY_MESSAGE,
  PERSONNEL_SKILL_TRAINING_ERROR_MESSAGE,
} from '~/constants/page.constants'
import { getPersonnelSkillTrainingOptionsEndpoint } from '~/utils/personnel-skills-endpoints'
import { mapPersonnelSkillTrainingOption } from '~/utils/personnel-skills'

const props = withDefaults(defineProps<{ personnelId: string; modelValue: string; error?: string }>(), { error: '' })
const emit = defineEmits<{ (event: 'update:modelValue', value: string): void }>()
const term = ref('')
const items = ref<PersonnelSkillTrainingRow[]>([])
const isLoading = ref(false)
const loadError = ref('')
let requestVersion = 0
let timer: ReturnType<typeof setTimeout> | undefined

const options = computed(() => items.value.map(mapPersonnelSkillTrainingOption))

const onSelect = (value: string | string[] | null) => {
  if (!Array.isArray(value)) emit('update:modelValue', value ?? '')
}

watch(() => [props.personnelId, props.modelValue, term.value], () => {
  clearTimeout(timer)
  const version = ++requestVersion
  isLoading.value = true
  loadError.value = ''
  timer = setTimeout(async () => {
    try {
      const response = await getPersonnelSkillTrainingOptionsEndpoint(props.personnelId, term.value, props.modelValue)
      if (version === requestVersion) items.value = response.items
    } catch {
      if (version === requestVersion) {
        items.value = []
        loadError.value = PERSONNEL_SKILL_TRAINING_ERROR_MESSAGE
      }
    } finally {
      if (version === requestVersion) isLoading.value = false
    }
  }, 250)
}, { immediate: true })

onBeforeUnmount(() => {
  clearTimeout(timer)
  requestVersion += 1
})
</script>
