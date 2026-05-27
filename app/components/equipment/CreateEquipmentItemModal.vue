<template>

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