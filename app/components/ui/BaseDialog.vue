<template>
  <Transition name="dialog-fade" appear>
    <div class="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
      <div
        class="w-full max-w-md overflow-hidden rounded-3xl bg-white text-slate-900 shadow-[0_18px_48px_rgba(15,23,42,0.26)] ring-1 ring-slate-200"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`dialog-title-${dialog.id}`"
      >
        <div class="flex items-start gap-4 px-6 pb-4 pt-6">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" :class="indicatorContainerClass">
            <BaseIcon :name="dialogIconName" size="lg" :class="indicatorClass" />
          </div>
          <div class="flex-1 pt-1">
            <p
              :id="`dialog-title-${dialog.id}`"
              class="text-xl font-bold text-slate-900"
            >
              {{ dialog.title }}
            </p>
            <p v-if="dialog.message" class="mt-2 text-sm leading-6 text-slate-600">
              {{ dialog.message }}
            </p>
          </div>
          <button
            type="button"
            class="text-slate-400 transition hover:text-slate-600"
            aria-label="Dismiss dialog"
            @click="handleCancel"
          >
            <BaseIcon name="x-mark" />
          </button>
        </div>
        <form v-if="dialog.type === 'prompt'" class="px-6 pb-2 pt-2" @submit.prevent="handleConfirm">
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
        <div class="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 pb-6 pt-4">
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
import type { IconName } from '~/types/domain/misc'
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'

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
      return 'text-emerald-600'
    case 'warning':
      return 'text-amber-600'
    case 'error':
      return 'text-rose-600'
    case 'info':
      return 'text-sky-600'
    case 'question':
      return 'text-violet-600'
    case 'prompt':
      return 'text-indigo-600'
    default:
      return 'text-sky-600'
  }
})

const indicatorContainerClass = computed(() => {
  switch (props.dialog.type) {
    case 'success':
      return 'bg-emerald-100'
    case 'warning':
      return 'bg-amber-100'
    case 'error':
      return 'bg-rose-100'
    case 'question':
      return 'bg-violet-100'
    case 'prompt':
      return 'bg-indigo-100'
    case 'info':
    case 'information':
    default:
      return 'bg-sky-100'
  }
})

const dialogIconName = computed<IconName>(() => {
  switch (props.dialog.type) {
    case 'success':
      return 'check-circle'
    case 'warning':
      return 'exclamation'
    case 'error':
      return 'x-circle'
    case 'question':
    case 'prompt':
      return 'question-mark-circle'
    case 'info':
    case 'information':
    default:
      return 'information-circle'
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
