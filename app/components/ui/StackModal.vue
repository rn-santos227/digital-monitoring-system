<template>
  <Teleport to="body">
    <div v-for="modal in modals" :key="modal.id">
      <BaseModal
        :title="modal.title"
        :description="modal.description"
        :size="modal.size"
        :close-on-backdrop="modal.closeOnBackdrop"
        @close="closeModal(modal.id)"
      >
        <component
          :is="modal.component"
          v-bind="resolveProps(modal)"
          @close="closeModal(modal.id)"
        />
      </BaseModal>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import type { ModalState } from '../../composables/useModal'
import { useModal } from '../../composables/useModal'

const { modals, closeModal } = useModal()

const resolveProps = (modal: ModalState) => ({
  ...modal.props,
  close: () => closeModal(modal.id)
})

</script>
