<template>
  <BaseModal
    title="Assign Personnel to Company"
    description="Search and select personnel to assign to this company."
    scroll-body
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert
        v-if="warningMessage"
        :message="warningMessage"
        tone="warning"
      />

      <BaseAlert
        v-if="errorMessage"
        :message="errorMessage"
        tone="danger"
      />

      <PersonnelSuggestionField v-model="personnelId" />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">
          Cancel
        </BaseButton>

        <BaseButton
          :disabled="!personnelId || isSubmitting"
          @click="onSubmit"
        >
          Assign
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PersonnelSuggestionField from '~/components/general/PersonnelSuggestionField.vue'

withDefaults(defineProps<{
  isSubmitting?: boolean
  warningMessage?: string
  errorMessage?: string
}>(), {
  isSubmitting: false,
  warningMessage: '',
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: { personnelId: string }): void
}>()

const personnelId = ref<string | null>(null)

const onSubmit = () => {
  if (!personnelId.value) {
    return
  }

  emit('submit', { personnelId: personnelId.value })
}
</script>
