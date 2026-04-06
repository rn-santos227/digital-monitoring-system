<template>
  <div class="space-y-2">
    <p v-if="label" class="text-sm font-medium text-slate-700">
      {{ label }}
    </p>
    <div class="space-y-2">
      <label
        v-for="(option, index) in options"
        :key="option.value"
        class="flex items-center gap-3 text-sm text-slate-700"
        :for="`${inputId}-${index}`"
      >
        <input
          :id="`${inputId}-${index}`"
          type="radio"
          :name="name"
          :value="option.value"
          :checked="modelValue === option.value"
          :disabled="disabled"
          class="h-4 w-4 border-slate-300 text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60"
          @change="onChange"
        />
        <span>
          {{ option.label }}
          <span v-if="option.helper" class="block text-xs text-slate-500">
            {{ option.helper }}
          </span>
        </span>
      </label>
    </div>
    <p v-if="error" class="text-sm text-rose-600">
      {{ error }}
    </p>
    <p v-else-if="helperText" class="text-sm text-slate-500">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

type RadioOption = {
  label: string
  value: string
  helper?: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    options: RadioOption[]
    name?: string
    helperText?: string
    error?: string
    id?: string
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    label: '',
    name: 'radio-group',
    helperText: '',
    error: '',
    disabled: false
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `radio-group-${generatedId}`)

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
