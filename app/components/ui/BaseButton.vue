<template>
  <button
    :type="type"
    :disabled="disabled"
    :aria-label="resolvedAriaLabel"
    :class="[
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      fullWidth ? 'w-full' : 'w-auto',
      iconOnly ? iconOnlyClasses[size] : '',
      disabled ? 'opacity-60 cursor-not-allowed' : ''
    ]"
  >
    <component
      v-if="icon"
      :is="icon"
      class="h-4 w-4"
      aria-hidden="true"
    />
    <slot v-if="!iconOnly" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UiSize } from '../../constants/ui.constants'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: UiSize
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    fullWidth?: boolean
    icon?: unknown
    iconOnly?: boolean
    ariaLabel?: string
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,

    fullWidth: false,
    icon: undefined,
    iconOnly: false,
    ariaLabel: ''
  }
)

const resolvedAriaLabel = computed(() => (props.iconOnly ? props.ariaLabel : undefined))

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold uppercase tracking-wide shadow-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:shadow-sm'

const sizeClasses: Record<UiSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base'
}

const iconOnlyClasses: Record<UiSize, string> = {
  sm: 'h-9 w-9 p-0',
  md: 'h-10 w-10 p-0',
  lg: 'h-12 w-12 p-0'
}

const variantClasses: Record<'primary' | 'secondary' | 'ghost' | 'danger', string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-white text-slate-900 border border-slate-300 hover:bg-slate-100',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  danger: 'bg-rose-600 text-white hover:bg-rose-700'
}

</script>
