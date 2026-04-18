<template>

</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import {
  USERS_ACCOUNT_CODE_LABEL,
  USERS_ACCOUNT_CODE_PLACEHOLDER,
  USERS_ACCOUNT_CREATE_MODAL_DESCRIPTION,
  USERS_ACCOUNT_CREATE_MODAL_TITLE,
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
  USERS_MODAL_CANCEL_LABEL,
  USERS_MODAL_CREATE_LABEL,
} from '~/constants/page.constants'
import type { SuggestionFieldOption } from '~/constants/ui.constants'
import type { CreateAccountTypePayload } from '~/types/domain/users'
import { validateAccountTypeForm } from '~/utils/users-validation'

interface PrivilegeOption {
  value: string
  code: string
  name: string
  module: string
}

const props = withDefaults(defineProps<{ isSubmitting?: boolean; privilegeOptions: PrivilegeOption[] }>(), {
  isSubmitting: false,
  privilegeOptions: () => [],
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: CreateAccountTypePayload): void
}>()

const form = reactive<{
  code: string
  name: string
  description: string
  isSystem: boolean
  permissionIds: string[]
}>({
  code: '',
  name: '',
  description: '',
  isSystem: false,
  permissionIds: [],
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
    .map((segment) => {
      return `${segment[0]?.toUpperCase() ?? ''}${segment.slice(1)}`
    })
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

</script>
