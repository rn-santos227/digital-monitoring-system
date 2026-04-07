<template>
  <div class="space-y-1">
    <label v-if="label" :for="inputId" class="text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-rose-600">*</span>
    </label>
    <div class="relative">
      <input
        :id="inputId"
        :type="resolvedType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full rounded-xl border px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus-visible:outline-none focus-visible:ring-2',
          isPassword ? 'pr-14' : '',
          error
            ? 'border-rose-500 focus-visible:ring-rose-500'
            : 'border-slate-300 focus-visible:border-indigo-500 focus-visible:ring-indigo-500',
          disabled ? 'bg-slate-100 text-slate-400' : 'bg-slate-50'
        ]"
        @input="onInput"
      />
      <button
        v-if="isPassword"
        type="button"
        class="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-1 text-slate-500 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        :disabled="disabled"
        @click="togglePassword"
      >
        <component :is="showPassword ? EyeSlashIcon : EyeIcon" class="h-5 w-5" aria-hidden="true" />
        <span class="sr-only">{{ showPassword ? 'Hide password' : 'Show password' }}</span>
      </button>
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
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { computed, ref, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    label?: string
    type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'
    placeholder?: string
    helperText?: string
    error?: string
    id?: string
    required?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    helperText: '',
    error: '',
    required: false,
    disabled: false
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `text-field-${generatedId}`)
const showPassword = ref(false)
const isPassword = computed(() => props.type === 'password')
const resolvedType = computed(() => (isPassword.value && showPassword.value ? 'text' : props.type))

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const togglePassword = () => {
  if (props.disabled) return
  showPassword.value = !showPassword.value
}
</script>
