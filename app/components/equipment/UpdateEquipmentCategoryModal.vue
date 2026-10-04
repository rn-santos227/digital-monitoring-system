<template>
  <BaseModal
    title="Update Equipment Category"
    description="Update equipment category details and status."
    @close="onCloseRequest"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />
      <BaseTextField v-model="form.code" label="Category code" :error="errors.code" required />
      <BaseTextField v-model="form.name" label="Category name" :error="errors.name" required />
      <BaseCheckbox v-model="form.isActive" label="Active" />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="onResetForm">Reset</BaseButton>
        <BaseButton variant="ghost" @click="onCloseRequest">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Update</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useDialog } from '~/composables/useDialog'
import type { UpdateEquipmentCategoryPayload } from '~/types/domain/equipment'
import { validateUpdateEquipmentCategoryForm } from '~/utils/equipment-validation'
import { requestCloseForChangedValues, resetFormValues } from '~/utils/form-close-guard'

const props = withDefaults(
  defineProps<{
    initialValues:{
      code: string
      name: string
      isActive: boolean
    }
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

const onCloseRequest = async () => {
  const shouldClose = await requestCloseForChangedValues({ formValues: form, originalValues: props.initialValues, showDialog })
  if (shouldClose) {
    emit('close')
  }
}

const onResetForm = () => {
  resetFormValues(form, props.initialValues)
}
</script>
