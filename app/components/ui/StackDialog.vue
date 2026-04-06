<template>
  <Teleport to="body">
    <BaseDialog
      v-if="dialog"
      :dialog="dialog"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </Teleport>
</template>

<script setup lang="ts">
import BaseDialog from './BaseDialog.vue'
import { useDialog } from '../../composables/useDialog'

const { dialog, closeDialog } = useDialog()

const handleConfirm = (value?: string) => {
  closeDialog({ confirmed: true, value })
}

const handleCancel = () => {
  closeDialog({ confirmed: false })
}
</script>
