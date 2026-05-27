<template>

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
