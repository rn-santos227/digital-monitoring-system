<template>
  <Transition name="dialog-fade" appear>
    <div class="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/40 p-4">
      <div
        class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`dialog-title-${dialog.id}`"
      >
        <div class="flex items-start gap-3 border-b border-slate-100 px-5 pb-4 pt-5">
          <div class="mt-1 h-3 w-3 rounded-full" :class="indicatorClass" aria-hidden="true" />
          <div class="flex-1">
            <p
              :id="`dialog-title-${dialog.id}`"
              class="text-lg font-semibold text-slate-900"
            >
              {{ dialog.title }}
            </p>
            <p v-if="dialog.message" class="mt-1 text-sm text-slate-600">
              {{ dialog.message }}
            </p>
          </div>
          <button
            type="button"
            class="text-slate-400 transition hover:text-slate-600"
            aria-label="Dismiss dialog"
            @click="handleCancel"
          >
            ✕
          </button>
        </div>
        <form v-if="dialog.type === 'prompt'" class="px-5 pt-4" @submit.prevent="handleConfirm">
          <label class="text-sm font-medium text-slate-700" :for="`dialog-input-${dialog.id}`">
            Response
          </label>
          <input
            :id="`dialog-input-${dialog.id}`"
            v-model="promptValue"
            :placeholder="dialog.placeholder"
            class="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
          />
        </form>
        <div class="flex items-center justify-end gap-3 px-5 pb-5 pt-4">
          <BaseButton
            v-if="dialog.showCancel"
            variant="ghost"
            size="sm"
            type="button"
            @click="handleCancel"
          >
            {{ dialog.cancelLabel }}
          </BaseButton>
          <BaseButton
            :variant="confirmVariant"
            size="sm"
            type="button"
            @click="handleConfirm"
          >
            {{ dialog.confirmLabel }}
          </BaseButton>
        </div>
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
    case 'info':
      return 'bg-sky-500'
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
