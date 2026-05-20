<template>
  <BaseModal
    :title="RANK_CREATE_MODAL_TITLE"
    :description="RANK_CREATE_MODAL_DESCRIPTION"
    @close="onCloseRequest"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />
      <BaseTextField v-model="form.code" label="Rank Code" placeholder="Enter rank code" required />
      <BaseTextField v-model="form.name" label="Rank Name" placeholder="Enter rank name" required />
      <BaseTextField v-model="form.sortOrder" label="Sort Order" placeholder="0" type="number" required />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="onCloseRequest">Cancel</BaseButton>
        <BaseButton @click="onSubmit">Create</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useDialog } from '~/composables/useDialog'
import { RANK_CREATE_MODAL_DESCRIPTION, RANK_CREATE_MODAL_TITLE } from '~/constants/page.constants'
import type { CreateRankPayload } from '~/types/domain/rank'
import { requestCloseForRequiredFields } from '~/utils/form-close-guard'

withDefaults(defineProps<{ warningMessage?: string; errorMessage?: string }>(), {
  warningMessage: '',
  errorMessage: '',
})

const { showDialog } = useDialog()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: CreateRankPayload): void
}>()

const form = reactive({
  code: '',
  name: '',
  sortOrder: '0',
})

const onSubmit = () => {
  emit('submit', {
    code: form.code.trim(),
    name: form.name.trim(),
    sortOrder: Number.parseInt(form.sortOrder, 10) || 0,
  })
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
