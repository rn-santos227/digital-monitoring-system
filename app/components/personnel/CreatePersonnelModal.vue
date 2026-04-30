<template>
  <BaseModal
    :title="PERSONNEL_CREATE_MODAL_TITLE"
    :description="PERSONNEL_CREATE_MODAL_DESCRIPTION"
    size="lg"
    scroll-body
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />
      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField
          v-model="form.personnelCode"
          :label="PERSONNEL_CREATE_PERSONNEL_CODE_LABEL"
          :placeholder="PERSONNEL_CREATE_PERSONNEL_CODE_PLACEHOLDER"
          :error="errors.personnelCode"
          required
        />

        <BaseTextField
          v-model="form.serviceNumber"
          :label="PERSONNEL_CREATE_SERVICE_NUMBER_LABEL"
          :placeholder="PERSONNEL_CREATE_SERVICE_NUMBER_PLACEHOLDER"
          :error="errors.serviceNumber"
          required
        />
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <BaseTextField
          v-model="form.lastName"
          :label="PERSONNEL_CREATE_LAST_NAME_LABEL"
          :placeholder="PERSONNEL_CREATE_LAST_NAME_PLACEHOLDER"
          :error="errors.lastName"
          required
        />

        <BaseTextField
          v-model="form.firstName"
          :label="PERSONNEL_CREATE_FIRST_NAME_LABEL"
          :placeholder="PERSONNEL_CREATE_FIRST_NAME_PLACEHOLDER"
          :error="errors.firstName"
          required
        />

        <BaseTextField
          v-model="form.middleName"
          :label="PERSONNEL_CREATE_MIDDLE_NAME_LABEL"
          :placeholder="PERSONNEL_CREATE_MIDDLE_NAME_PLACEHOLDER"
          :error="errors.middleName"
        />
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <BaseSelect
          v-model="form.sex"
          :label="PERSONNEL_CREATE_SEX_LABEL"
          :placeholder="PERSONNEL_CREATE_SEX_PLACEHOLDER"
          :options="PERSONNEL_CREATE_SEX_OPTIONS"
          :error="errors.sex"
          required
        />

        <BaseDatePicker
          v-model="form.birthdate"
          :label="PERSONNEL_CREATE_BIRTHDATE_LABEL"
          :error="errors.birthdate"
        />

        <BaseDatePicker
          v-model="form.dateEnlisted"
          :label="PERSONNEL_CREATE_DATE_ENLISTED_LABEL"
          :error="errors.dateEnlisted"
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <RankSuggestionField
          v-model="form.rankId"
          :label="PERSONNEL_CREATE_RANK_ID_LABEL"
          :placeholder="PERSONNEL_CREATE_RANK_ID_PLACEHOLDER"
          :error="errors.rankId"
          required
        />
        <BaseTextField
          v-model="form.contactNumber"
          :label="PERSONNEL_CREATE_CONTACT_NUMBER_LABEL"
          :placeholder="PERSONNEL_CREATE_CONTACT_NUMBER_PLACEHOLDER"
          :error="errors.contactNumber"
        />
        <BaseTextField
          v-model="form.position"
          :label="PERSONNEL_CREATE_POSITION_LABEL"
          :placeholder="PERSONNEL_CREATE_POSITION_PLACEHOLDER"
          :error="errors.position"
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <CompaniesSuggestionField
          v-model="form.companyId"
          :label="PERSONNEL_CREATE_COMPANY_ID_LABEL"
          :placeholder="PERSONNEL_CREATE_COMPANY_ID_PLACEHOLDER"
          :battalion-id="form.battalionId"
          :disabled="!form.battalionId"
          :error="errors.companyId"
        />

        <BattalionsSuggestionField
          v-model="form.battalionId"
          :label="PERSONNEL_CREATE_BATTALION_ID_LABEL"
          :placeholder="PERSONNEL_CREATE_BATTALION_ID_PLACEHOLDER"
          :error="errors.battalionId"
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseSuggestionField
          v-model="form.employmentStatusId"
          :options="PERSONNEL_CREATE_EMPLOYMENT_STATUS_OPTIONS"
          :label="PERSONNEL_CREATE_EMPLOYMENT_STATUS_ID_LABEL"
          :placeholder="PERSONNEL_CREATE_EMPLOYMENT_STATUS_ID_PLACEHOLDER"
          panel-position="top"
          :error="errors.employmentStatusId"
          required
        />

        <BaseSuggestionField
          v-model="form.serviceStatusId"
          :options="PERSONNEL_CREATE_SERVICE_STATUS_OPTIONS"
          :label="PERSONNEL_CREATE_SERVICE_STATUS_ID_LABEL"
          :placeholder="PERSONNEL_CREATE_SERVICE_STATUS_ID_PLACEHOLDER"
          panel-position="top"
          :error="errors.serviceStatusId"
          required
        />
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">{{ PERSONNEL_MODAL_CANCEL_LABEL }}</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">{{ PERSONNEL_MODAL_CREATE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import BattalionsSuggestionField from '~/components/general/BattalionsSuggestionField.vue'
import CompaniesSuggestionField from '~/components/general/CompaniesSuggestionField.vue'
import RankSuggestionField from '~/components/general/RankSuggestionField.vue'
import { FILE_UPLOAD_CONSTRAINTS } from '~/constants/api.constants'
import {
  PERSONNEL_CREATE_BATTALION_ID_LABEL,
  PERSONNEL_CREATE_BATTALION_ID_PLACEHOLDER,
  PERSONNEL_CREATE_BIRTHDATE_LABEL,
  PERSONNEL_CREATE_COMPANY_ID_LABEL,
  PERSONNEL_CREATE_COMPANY_ID_PLACEHOLDER,
  PERSONNEL_CREATE_CONTACT_NUMBER_LABEL,
  PERSONNEL_CREATE_CONTACT_NUMBER_PLACEHOLDER,
  PERSONNEL_CREATE_POSITION_LABEL,
  PERSONNEL_CREATE_POSITION_PLACEHOLDER,
  PERSONNEL_CREATE_PROFILE_IMAGE_HELPER,
  PERSONNEL_CREATE_PROFILE_IMAGE_LABEL,
  PERSONNEL_CREATE_PROFILE_IMAGE_URL_LABEL,
  PERSONNEL_CREATE_PROFILE_IMAGE_URL_PLACEHOLDER,
  PERSONNEL_CREATE_DATE_ENLISTED_LABEL,
  PERSONNEL_CREATE_EMPLOYMENT_STATUS_ID_LABEL,
  PERSONNEL_CREATE_EMPLOYMENT_STATUS_OPTIONS,
  PERSONNEL_CREATE_EMPLOYMENT_STATUS_ID_PLACEHOLDER,
  PERSONNEL_CREATE_FIRST_NAME_LABEL,
  PERSONNEL_CREATE_FIRST_NAME_PLACEHOLDER,
  PERSONNEL_CREATE_LAST_NAME_LABEL,
  PERSONNEL_CREATE_LAST_NAME_PLACEHOLDER,
  PERSONNEL_CREATE_MIDDLE_NAME_LABEL,
  PERSONNEL_CREATE_MIDDLE_NAME_PLACEHOLDER,
  PERSONNEL_CREATE_MODAL_DESCRIPTION,
  PERSONNEL_CREATE_MODAL_TITLE,
  PERSONNEL_CREATE_PERSONNEL_CODE_LABEL,
  PERSONNEL_CREATE_PERSONNEL_CODE_PLACEHOLDER,
  PERSONNEL_CREATE_RANK_ID_LABEL,
  PERSONNEL_CREATE_RANK_ID_PLACEHOLDER,
  PERSONNEL_CREATE_SERVICE_NUMBER_LABEL,
  PERSONNEL_CREATE_SERVICE_NUMBER_PLACEHOLDER,
  PERSONNEL_CREATE_SERVICE_STATUS_ID_LABEL,
  PERSONNEL_CREATE_SERVICE_STATUS_OPTIONS,
  PERSONNEL_CREATE_SERVICE_STATUS_ID_PLACEHOLDER,
  PERSONNEL_CREATE_SEX_LABEL,
  PERSONNEL_CREATE_SEX_OPTIONS,
  PERSONNEL_CREATE_SEX_PLACEHOLDER,
  PERSONNEL_MODAL_CANCEL_LABEL,
  PERSONNEL_MODAL_CREATE_LABEL,
} from '~/constants/page.constants'
import type { CreatePersonnelPayload } from '~/types/domain/personnel'
import { uploadFileEndpoint } from '~/utils/file-management-endpoints'
import { formatFileSizeLabel } from '~/utils/file-upload'
import { extractApiErrorMessage } from '~/utils/api-request'
import { validateCreatePersonnelForm } from '~/utils/personnel-validation'

withDefaults(defineProps<{ isSubmitting?: boolean; warningMessage?: string; errorMessage?: string }>(), {
  isSubmitting: false,
  warningMessage: '',
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: CreatePersonnelPayload): void
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
  serviceStatusId: 'Active Duty',
  contactNumber: '',
  position: '',
  dateEnlisted: '',
  profileImageUrl: '',
})

const errors = reactive<Record<string, string>>({})
const isProfileImageUploading = ref(false)
const profileImageFile = ref<File | null>(null)

const profileImageUploadHelperText = computed(() => {
  const maxSizeLabel = formatFileSizeLabel(FILE_UPLOAD_CONSTRAINTS.maxSizeBytes)
  return `${PERSONNEL_CREATE_PROFILE_IMAGE_HELPER} Max size: ${maxSizeLabel}.`
})

watch(
  () => form.battalionId,
  (nextBattalionId, previousBattalionId) => {
    if (!nextBattalionId || (previousBattalionId && nextBattalionId !== previousBattalionId)) {
      form.companyId = ''
    }
  }
)

const onProfileImageFileSelected = (file: File | null) => {
  delete errors.profileImageFile
  profileImageFile.value = file
}

const onSubmit = async () => {
  const result = validateCreatePersonnelForm(form)

  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })

  Object.assign(errors, result.errors)

  if (isProfileImageUploading.value) {
    errors.profileImageFile = 'Profile image upload is in progress. Please wait.'
    return
  }

  if (!result.payload) {
    return
  }

  if (profileImageFile.value) {
    isProfileImageUploading.value = true

    try {
      const response = await uploadFileEndpoint(profileImageFile.value, {
        allowedMimePrefixes: FILE_UPLOAD_CONSTRAINTS.imageMimePrefixes,
      })
      form.profileImageUrl = response.attachment.publicUrl
    } catch (error) {
      errors.profileImageFile = extractApiErrorMessage(error, 'Unable to upload profile image file.')
      return
    } finally {
      isProfileImageUploading.value = false
    }
  }

  emit('submit', result.payload)
}
</script>
