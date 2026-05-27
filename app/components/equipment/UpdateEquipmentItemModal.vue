<template>
  <BaseModal
    title="Update Equipment Item"
    description="Update equipment item details."
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
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Update</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useDialog } from '~/composables/useDialog'
import type { UpdateEquipmentItemPayload } from '~/types/domain/equipment'
import { validateUpdateEquipmentItemForm } from '~/utils/equipment-validation'
import { requestCloseForChangedValues } from '~/utils/form-close-guard'

const props = withDefaults(
  defineProps<{
    initialValues: {
      equipmentCode: string
      categoryId: string
      name: string
      model: string
      manufacturer: string
      description: string
      unitOfMeasure: string
      minimumStockLevel: number
      isSerialized: boolean
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
  (event: 'submit', payload: UpdateEquipmentItemPayload): void
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

watch(
  () => props.initialValues,
  (value) => {
    Object.assign(form, value)
  },
  { immediate: true, deep: true },
)

const minimumStockLevelInput = computed({
  get: () => String(form.minimumStockLevel),
  set: (value: string) => {
    form.minimumStockLevel = Number(value) || 0
  },
})

const errors = reactive<Record<string, string>>({})
const { showDialog } = useDialog()

const onSubmit = () => {
  const result = validateUpdateEquipmentItemForm(form)

  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, result.errors)

  if (!result.payload) {
    return
  }

  emit('submit', result.payload)
}

const onCloseRequest = async () => {
  const shouldClose = await requestCloseForChangedValues({
    formValues: form,
    originalValues: props.initialValues,
    showDialog,
  })

  if (shouldClose) {
    emit('close')
  }
}
</script>
