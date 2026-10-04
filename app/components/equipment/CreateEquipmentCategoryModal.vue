<template>
  <BaseModal
    title="Create Equipment Category"
    description="Register a new equipment category for equipment item classification."
    @close="onCloseRequest"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />
      <BaseTextField v-model="form.code" label="Category code" placeholder="e.g., WEAPONS" :error="errors.code" required />
      <BaseTextField v-model="form.name" label="Category name" placeholder="e.g., Weapons and Arms" :error="errors.name" required />
      <BaseCheckbox v-model="form.isActive" label="Active" />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="onCloseRequest">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Create</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useDialog } from '~/composables/useDialog'
import type { CreateEquipmentCategoryPayload } from '~/types/domain/equipment'
import { requestCloseForRequiredFields } from '~/utils/form-close-guard'
import { validateCreateEquipmentCategoryForm } from '~/utils/equipment-validation'

withDefaults(
  defineProps<{
    isSubmitting?: boolean
    warningMessage?: string
    errorMessage?: string
  }>(),
  {
    isSubmitting: false,
    warningMessage: '',
    errorMessage: '',
  },
)

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

const onCloseRequest = async () => {
  const shouldClose = await requestCloseForRequiredFields({ formValues: form, showDialog })

  if (shouldClose) {
    emit('close')
  }
}
</script>
