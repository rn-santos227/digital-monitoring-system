<template>
  <BaseModal
    :title="COMPANY_UPDATE_MODAL_TITLE"
    :description="COMPANY_UPDATE_MODAL_DESCRIPTION"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />
      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField
          v-model="form.code"
          :label="COMPANY_CREATE_CODE_LABEL"
          :placeholder="COMPANY_CREATE_CODE_PLACEHOLDER"
          :error="errors.code"
          required
        />

        <BaseTextField
          v-model="form.name"
          :label="COMPANY_CREATE_NAME_LABEL"
          :placeholder="COMPANY_CREATE_NAME_PLACEHOLDER"
          :error="errors.name"
          required
        />
      </div>

      <BattalionsSuggestionField
        v-model="form.battalionId"
        :label="COMPANY_CREATE_BATTALION_LABEL"
        :placeholder="COMPANY_CREATE_BATTALION_PLACEHOLDER"
        :error="errors.battalionId"
      />

      <BaseCheckbox
        v-model="form.isActive"
        :label="COMPANY_CREATE_ACTIVE_LABEL"
        :description="COMPANY_CREATE_ACTIVE_DESCRIPTION"
      />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">{{ UNITS_MODAL_CANCEL_LABEL }}</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">{{ UNITS_MODAL_UPDATE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import BattalionsSuggestionField from '~/components/general/BattalionsSuggestionField.vue'
import {
  COMPANY_CREATE_ACTIVE_DESCRIPTION,
  COMPANY_CREATE_ACTIVE_LABEL,
  COMPANY_CREATE_BATTALION_LABEL,
  COMPANY_CREATE_BATTALION_PLACEHOLDER,
  COMPANY_CREATE_CODE_LABEL,
  COMPANY_CREATE_CODE_PLACEHOLDER,
  COMPANY_CREATE_NAME_LABEL,
  COMPANY_CREATE_NAME_PLACEHOLDER,
  COMPANY_UPDATE_MODAL_DESCRIPTION,
  COMPANY_UPDATE_MODAL_TITLE,
  UNITS_MODAL_CANCEL_LABEL,
  UNITS_MODAL_UPDATE_LABEL,
} from '~/constants/page.constants'
import type { UpdateCompanyPayload } from '~/types/domain/units'
import { validateCreateCompanyForm } from '~/utils/units-validation'

const props = withDefaults(
  defineProps<{
    initialValues:{
      battalionId: string | null
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
  (event: 'submit', payload: UpdateCompanyPayload): void
}>()

const form = reactive({
  battalionId: '',
  code: '',
  name: '',
  isActive: true,
})

watch(() => props.initialValues, (value) => {
  form.battalionId = value.battalionId ?? ''
  form.code = value.code
  form.name = value.name
  form.isActive = value.isActive
}, { immediate: true, deep: true })

const errors = reactive<Record<string, string>>({})

const onSubmit = () => {
  const result = validateCreateCompanyForm(form)

  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })

  Object.assign(errors, result.errors)

  if (!result.payload) {
    return
  }

  emit('submit', result.payload)
}
</script>
