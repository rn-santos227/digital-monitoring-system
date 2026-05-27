<template>
  <BaseModal
    title="Create Equipment Item"
    description="Register a new equipment item for category-based asset tracking."
    @close="onCloseRequest"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />
      <BaseTextField v-model="form.equipmentCode" label="Equipment code" :error="errors.equipmentCode" required />
      <BaseTextField v-model="form.name" label="Item name" :error="errors.name" required />
      <EquipmentCategoriesSuggestionField v-model="form.categoryId" :error="errors.categoryId" />
      <BaseTextField v-model="form.model" label="Model" :error="errors.model" />
      <BaseTextField v-model="form.manufacturer" label="Manufacturer" :error="errors.manufacturer" />
      <BaseTextField v-model="form.unitOfMeasure" label="Unit of measure" :error="errors.unitOfMeasure" />
      <BaseTextArea v-model="form.description" label="Description" :error="errors.description" />
      <BaseTextField
        v-model="minimumStockLevelInput"
        type="number"
        label="Minimum stock level"
        :error="errors.minimumStockLevel"
        required
      />
      <BaseCheckbox v-model="form.isSerialized" label="Serialized item" />
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
import { computed, reactive } from 'vue'
import { useDialog } from '~/composables/useDialog'
import type { CreateEquipmentItemPayload } from '~/types/domain/equipment'
import { validateCreateEquipmentItemForm } from '~/utils/equipment-validation'
import { requestCloseForRequiredFields } from '~/utils/form-close-guard'

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
  (event: 'submit', payload: CreateEquipmentItemPayload): void
}>()

const form = reactive({
  equipmentCode: '',
  categoryId: '',
  name: '',
  model: '',
  manufacturer: '',
  description: '',
  unitOfMeasure: '',
  minimumStockLevel: 0,
  isSerialized: false,
  isActive: true,
})

const errors = reactive<Record<string, string>>({})
const { showDialog } = useDialog()

const minimumStockLevelInput = computed({
  get: () => String(form.minimumStockLevel),
  set: (value: string) => {
    form.minimumStockLevel = Number(value) || 0
  },
})

const onSubmit = () => {
  const result = validateCreateEquipmentItemForm(form)

  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, result.errors)

  if (!result.payload) {
    return
  }

  emit('submit', result.payload)
}

const onCloseRequest = async () => {
  const shouldClose = await requestCloseForRequiredFields({
    formValues: form,
    showDialog,
  })

  if (shouldClose) {
    emit('close')
  }
}
</script>