<template>

</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useDialog } from '~/composables/useDialog'
import type { UpdateEquipmentCategoryPayload } from '~/types/domain/equipment'
import { validateUpdateEquipmentCategoryForm } from '~/utils/equipment-validation'
import { requestCloseForChangedValues, resetFormValues } from '~/utils/form-close-guard'

const props = withDefaults(defineProps<{
  initialValues: { code: string; name: string; isActive: boolean }
  isSubmitting?: boolean
  warningMessage?: string
  errorMessage?: string
}>(), {
  isSubmitting: false,
  warningMessage: '',
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: UpdateEquipmentCategoryPayload): void
}>()

const form = reactive({ code: '', name: '', isActive: true })
watch(() => props.initialValues, (value) => {
  form.code = value.code
  form.name = value.name
  form.isActive = value.isActive
}, { immediate: true, deep: true })

const errors = reactive<Record<string, string>>({})
const { showDialog } = useDialog()

const onSubmit = () => {
  const result = validateUpdateEquipmentCategoryForm(form)
  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, result.errors)

  if (!result.payload) {
    return
  }

  emit('submit', result.payload)
}

</script>
