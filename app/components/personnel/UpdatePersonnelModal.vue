<template>
  <BaseModal
    :title="PERSONNEL_UPDATE_MODAL_TITLE"
    :description="PERSONNEL_UPDATE_MODAL_DESCRIPTION"
    size="lg"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField v-model="form.personnelCode" :label="PERSONNEL_CREATE_PERSONNEL_CODE_LABEL" :placeholder="PERSONNEL_CREATE_PERSONNEL_CODE_PLACEHOLDER" :error="errors.personnelCode" required />
        <BaseTextField v-model="form.serviceNumber" :label="PERSONNEL_CREATE_SERVICE_NUMBER_LABEL" :placeholder="PERSONNEL_CREATE_SERVICE_NUMBER_PLACEHOLDER" :error="errors.serviceNumber" required />
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <BaseTextField v-model="form.lastName" :label="PERSONNEL_CREATE_LAST_NAME_LABEL" :placeholder="PERSONNEL_CREATE_LAST_NAME_PLACEHOLDER" :error="errors.lastName" required />
        <BaseTextField v-model="form.firstName" :label="PERSONNEL_CREATE_FIRST_NAME_LABEL" :placeholder="PERSONNEL_CREATE_FIRST_NAME_PLACEHOLDER" :error="errors.firstName" required />
        <BaseTextField v-model="form.middleName" :label="PERSONNEL_CREATE_MIDDLE_NAME_LABEL" :placeholder="PERSONNEL_CREATE_MIDDLE_NAME_PLACEHOLDER" :error="errors.middleName" />
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <BaseSelect v-model="form.sex" :label="PERSONNEL_CREATE_SEX_LABEL" :placeholder="PERSONNEL_CREATE_SEX_PLACEHOLDER" :options="PERSONNEL_CREATE_SEX_OPTIONS" :error="errors.sex" required />
        <BaseDatePicker v-model="form.birthdate" :label="PERSONNEL_CREATE_BIRTHDATE_LABEL" :error="errors.birthdate" />
        <BaseDatePicker v-model="form.dateEnlisted" :label="PERSONNEL_CREATE_DATE_ENLISTED_LABEL" :error="errors.dateEnlisted" />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField v-model="form.rankId" :label="PERSONNEL_CREATE_RANK_ID_LABEL" :placeholder="PERSONNEL_CREATE_RANK_ID_PLACEHOLDER" :error="errors.rankId" required />
        <BaseTextField v-model="form.contactNumber" :label="PERSONNEL_CREATE_CONTACT_NUMBER_LABEL" :placeholder="PERSONNEL_CREATE_CONTACT_NUMBER_PLACEHOLDER" :error="errors.contactNumber" />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <CompaniesSuggestionField v-model="form.companyId" :label="PERSONNEL_CREATE_COMPANY_ID_LABEL" :placeholder="PERSONNEL_CREATE_COMPANY_ID_PLACEHOLDER" :battalion-id="form.battalionId" :error="errors.companyId" />
        <BattalionsSuggestionField v-model="form.battalionId" :label="PERSONNEL_CREATE_BATTALION_ID_LABEL" :placeholder="PERSONNEL_CREATE_BATTALION_ID_PLACEHOLDER" :error="errors.battalionId" />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField v-model="form.employmentStatusId" :label="PERSONNEL_CREATE_EMPLOYMENT_STATUS_ID_LABEL" :placeholder="PERSONNEL_CREATE_EMPLOYMENT_STATUS_ID_PLACEHOLDER" :error="errors.employmentStatusId" required />
        <BaseTextField v-model="form.serviceStatusId" :label="PERSONNEL_CREATE_SERVICE_STATUS_ID_LABEL" :placeholder="PERSONNEL_CREATE_SERVICE_STATUS_ID_PLACEHOLDER" :error="errors.serviceStatusId" required />
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">{{ PERSONNEL_MODAL_CANCEL_LABEL }}</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">{{ PERSONNEL_MODAL_UPDATE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import BattalionsSuggestionField from '~/components/general/BattalionsSuggestionField.vue'
import CompaniesSuggestionField from '~/components/general/CompaniesSuggestionField.vue'
import {
  PERSONNEL_CREATE_BATTALION_ID_LABEL,
  PERSONNEL_CREATE_BATTALION_ID_PLACEHOLDER,
  PERSONNEL_CREATE_BIRTHDATE_LABEL,
  PERSONNEL_CREATE_COMPANY_ID_LABEL,
  PERSONNEL_CREATE_COMPANY_ID_PLACEHOLDER,
  PERSONNEL_CREATE_CONTACT_NUMBER_LABEL,
  PERSONNEL_CREATE_CONTACT_NUMBER_PLACEHOLDER,
  PERSONNEL_CREATE_DATE_ENLISTED_LABEL,
  PERSONNEL_CREATE_EMPLOYMENT_STATUS_ID_LABEL,
  PERSONNEL_CREATE_EMPLOYMENT_STATUS_ID_PLACEHOLDER,
  PERSONNEL_CREATE_FIRST_NAME_LABEL,
  PERSONNEL_CREATE_FIRST_NAME_PLACEHOLDER,
  PERSONNEL_CREATE_LAST_NAME_LABEL,
  PERSONNEL_CREATE_LAST_NAME_PLACEHOLDER,
  PERSONNEL_CREATE_MIDDLE_NAME_LABEL,
  PERSONNEL_CREATE_MIDDLE_NAME_PLACEHOLDER,
  PERSONNEL_CREATE_PERSONNEL_CODE_LABEL,
  PERSONNEL_CREATE_PERSONNEL_CODE_PLACEHOLDER,
  PERSONNEL_CREATE_RANK_ID_LABEL,
  PERSONNEL_CREATE_RANK_ID_PLACEHOLDER,
  PERSONNEL_CREATE_SERVICE_NUMBER_LABEL,
  PERSONNEL_CREATE_SERVICE_NUMBER_PLACEHOLDER,
  PERSONNEL_CREATE_SERVICE_STATUS_ID_LABEL,
  PERSONNEL_CREATE_SERVICE_STATUS_ID_PLACEHOLDER,
  PERSONNEL_CREATE_SEX_LABEL,
  PERSONNEL_CREATE_SEX_OPTIONS,
  PERSONNEL_CREATE_SEX_PLACEHOLDER,
  PERSONNEL_MODAL_CANCEL_LABEL,
  PERSONNEL_MODAL_UPDATE_LABEL,
  PERSONNEL_UPDATE_MODAL_DESCRIPTION,
  PERSONNEL_UPDATE_MODAL_TITLE,
} from '~/constants/page.constants'
import type { PersonnelDetail, UpdatePersonnelPayload } from '~/types/domain/personnel'
import { validateCreatePersonnelForm } from '~/utils/personnel-validation'

const props = withDefaults(defineProps<{ initialValues: PersonnelDetail, isSubmitting?: boolean }>(), { isSubmitting: false })

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: UpdatePersonnelPayload): void
}>()

const form = reactive({
  personnelCode: '',
  serviceNumber: '',
  lastName: '',
  firstName: '',
  middleName: '',
  sex: '',
  birthdate: '',
  rankId: '',
  companyId: '',
  battalionId: '',
  employmentStatusId: '',
  serviceStatusId: '',
  contactNumber: '',
  dateEnlisted: '',
})

const syncForm = (value: PersonnelDetail) => {
  form.personnelCode = value.personnelCode
  form.serviceNumber = value.serviceNumber
  form.lastName = value.lastName
  form.firstName = value.firstName
  form.middleName = value.middleName ?? ''
  form.sex = value.sex
  form.birthdate = value.birthdate ?? ''
  form.rankId = value.rankId
  form.companyId = value.companyId ?? ''
  form.battalionId = value.battalionId ?? ''
  form.employmentStatusId = value.employmentStatusId
  form.serviceStatusId = value.serviceStatusId
  form.contactNumber = value.contactNumber ?? ''
  form.dateEnlisted = value.dateEnlisted ?? ''
}

watch(() => props.initialValues, syncForm, { immediate: true, deep: true })

const errors = reactive<Record<string, string>>({})

const onSubmit = () => {
  const result = validateCreatePersonnelForm(form)

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