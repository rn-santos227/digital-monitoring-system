<template>
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
</script>