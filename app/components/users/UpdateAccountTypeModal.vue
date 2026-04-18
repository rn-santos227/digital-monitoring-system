<template>
  <BaseModal
    :title="USERS_ACCOUNT_UPDATE_MODAL_TITLE"
    :description="USERS_ACCOUNT_UPDATE_MODAL_DESCRIPTION"
    size="lg"
    scroll-body
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseTextField
        v-model="form.code"
        :label="USERS_ACCOUNT_CODE_LABEL"
        :placeholder="USERS_ACCOUNT_CODE_PLACEHOLDER"
        :error="errors.code"
        required
      />

      <BaseTextField
        v-model="form.name"
        :label="USERS_ACCOUNT_NAME_LABEL"
        :placeholder="USERS_ACCOUNT_NAME_PLACEHOLDER"
        :error="errors.name"
        required
      />

      <fieldset class="space-y-3">
        <BaseSuggestionField
          v-model="form.permissionIds"
          :label="USERS_ACCOUNT_PRIVILEGES_LABEL"
          :helper-text="USERS_ACCOUNT_PRIVILEGES_DESCRIPTION"
          :placeholder="USERS_ACCOUNT_PRIVILEGES_PLACEHOLDER"
          :empty-message="USERS_ACCOUNT_PRIVILEGES_EMPTY_MESSAGE"
          :options="privilegeSuggestionOptions"
          multiple
        />

        <div v-if="selectedPrivilegeItems.length" class="flex flex-wrap gap-2">
          <BaseChip
            v-for="selectedPrivilege in selectedPrivilegeItems"
            :key="selectedPrivilege.value"
            :label="`${selectedPrivilege.name} (${selectedPrivilege.code})`"
            tone="info"
          />
        </div>
      </fieldset>

      <BaseTextArea
        v-model="form.description"
        :label="USERS_ACCOUNT_DESCRIPTION_LABEL"
        :placeholder="USERS_ACCOUNT_DESCRIPTION_PLACEHOLDER"
      />

      <BaseCheckbox
        v-model="form.isSystem"
        :label="USERS_ACCOUNT_IS_SYSTEM_LABEL"
        :description="USERS_ACCOUNT_IS_SYSTEM_DESCRIPTION"
      />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">{{ USERS_MODAL_CANCEL_LABEL }}</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">{{ USERS_MODAL_UPDATE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import {
  USERS_ACCOUNT_CODE_LABEL,
  USERS_ACCOUNT_CODE_PLACEHOLDER,
  USERS_ACCOUNT_DESCRIPTION_LABEL,
  USERS_ACCOUNT_DESCRIPTION_PLACEHOLDER,
  USERS_ACCOUNT_IS_SYSTEM_DESCRIPTION,
  USERS_ACCOUNT_IS_SYSTEM_LABEL,
  USERS_ACCOUNT_NAME_LABEL,
  USERS_ACCOUNT_NAME_PLACEHOLDER,
  USERS_ACCOUNT_PRIVILEGES_CODE_PREFIX,
  USERS_ACCOUNT_PRIVILEGES_DESCRIPTION,
  USERS_ACCOUNT_PRIVILEGES_EMPTY_MESSAGE,
  USERS_ACCOUNT_PRIVILEGES_LABEL,
  USERS_ACCOUNT_PRIVILEGES_PLACEHOLDER,
  USERS_ACCOUNT_UPDATE_MODAL_DESCRIPTION,
  USERS_ACCOUNT_UPDATE_MODAL_TITLE,
  USERS_MODAL_CANCEL_LABEL,
  USERS_MODAL_UPDATE_LABEL,
} from '~/constants/page.constants'
import type { SuggestionFieldOption } from '~/constants/ui.constants'
import type { UpdateAccountTypePayload } from '~/types/domain/users'
import { validateAccountTypeForm } from '~/utils/users-validation'

interface PrivilegeOption {
  value: string
  code: string
  name: string
  module: string
}

const props = withDefaults(defineProps<{
  initialValues: {
    code: string
    name: string
    description: string | null
    isSystem: boolean
    permissionIds: string[]
  }
  isSubmitting?: boolean
  privilegeOptions: PrivilegeOption[]
}>(), {
  isSubmitting: false,
  privilegeOptions: () => [],
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: UpdateAccountTypePayload): void
}>()

const form = reactive<{
  code: string
  name: string
  description: string
  isSystem: boolean
  permissionIds: string[]
}>({
  code: props.initialValues.code,
  name: props.initialValues.name,
  description: props.initialValues.description ?? '',
  isSystem: props.initialValues.isSystem,
  permissionIds: [...props.initialValues.permissionIds],
})

const errors = reactive<Record<string, string>>({})

const onSubmit = () => {
  const result = validateAccountTypeForm(form)

  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })

  Object.assign(errors, result.errors)

  if (!result.payload) {
    return
  }

  emit('submit', result.payload)
}

const toModuleLabel = (moduleName: string) => {
  return moduleName
    .split('_')
    .filter((segment) => segment.length > 0)
    .map((segment) => `${segment[0]?.toUpperCase() ?? ''}${segment.slice(1)}`)
    .join(' ')
}

const groupedPrivilegeOptions = computed(() => {
  const grouped = (props.privilegeOptions ?? []).reduce<Record<string, PrivilegeOption[]>>((accumulator, option) => {
    const moduleOptions = accumulator[option.module] ?? []
    moduleOptions.push(option)
    accumulator[option.module] = moduleOptions
    return accumulator
  }, {})

  return Object.entries(grouped).map(([module, items]) => ({
    module,
    moduleLabel: toModuleLabel(module),
    items,
  }))
})

const privilegeSuggestionOptions = computed<SuggestionFieldOption[]>(() => {
  return groupedPrivilegeOptions.value.flatMap((group) => {
    return group.items.map((privilege) => ({
      value: privilege.value,
      label: privilege.name,
      description: `${group.moduleLabel} • ${USERS_ACCOUNT_PRIVILEGES_CODE_PREFIX}: ${privilege.code}`,
    }))
  })
})

const selectedPrivilegeItems = computed(() => {
  const selectedIds = new Set(form.permissionIds)
  return (props.privilegeOptions ?? []).filter((item) => selectedIds.has(item.value))
})
</script>
