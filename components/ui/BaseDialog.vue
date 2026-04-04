<template>
  <Transition name="dialog-fade" appear>
    <div class="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/40 p-4">
      <div
        class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`dialog-title-${dialog.id}`"
      >
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { DialogState } from '../../composables/useDialog'
import BaseButton from './BaseButton.vue'

const props = defineProps<{
  dialog: DialogState
}>()

const emit = defineEmits<{
  (event: 'confirm', value?: string): void
  (event: 'cancel'): void
}>()

const promptValue = ref(props.dialog.defaultValue ?? '')

watch(
  () => props.dialog,
  (value) => {
    promptValue.value = value.defaultValue ?? ''
  }
)

const indicatorClass = computed(() => {
  switch (props.dialog.type) {
    case 'success':
      return 'bg-emerald-500'
    case 'warning':
      return 'bg-amber-500'
    case 'error':
      return 'bg-rose-500'
    case 'question':
      return 'bg-violet-500'
    case 'prompt':
      return 'bg-indigo-500'
    default:
      return 'bg-sky-500'
  }
})

const confirmVariant = computed(() => {
  if (props.dialog.type === 'error') {
    return 'danger'
  }
  if (props.dialog.type === 'warning') {
    return 'secondary'
  }
  return 'primary'
})

const handleConfirm = () => {
  emit('confirm', props.dialog.type === 'prompt' ? promptValue.value : undefined)
}

const handleCancel = () => {
  emit('cancel')
}
</script>