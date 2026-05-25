<template>

</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useDialog } from '~/composables/useDialog'
import type { CreateEquipmentCategoryPayload } from '~/types/domain/equipment'
import { requestCloseForRequiredFields } from '~/utils/form-close-guard'
import { validateCreateEquipmentCategoryForm } from '~/utils/equipment-validation'

withDefaults(defineProps<{ isSubmitting?: boolean; warningMessage?: string; errorMessage?: string }>(), {
  isSubmitting: false,
  warningMessage: '',
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: CreateEquipmentCategoryPayload): void
}>()

const form = reactive({ code: '', name: '', isActive: true })
const errors = reactive<Record<string, string>>({})
const { showDialog } = useDialog()

const onSubmit = () => {
  const result = validateCreateEquipmentCategoryForm(form)
  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, result.errors)

  if (!result.payload) {
    return
  }

  emit('submit', result.payload)
}

</script>
