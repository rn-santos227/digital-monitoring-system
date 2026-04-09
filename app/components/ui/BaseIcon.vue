<template>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getHeroIcon } from '~/utils/icon-map'
import type { IconName } from '~/types/domain/misc'

const props = withDefaults(
  defineProps<{
    name: IconName
    size?: 'sm' | 'md' | 'lg'
    class?: string
  }>(),
  {
    size: 'md',
    class: ''
  }
)

const iconSizeClassMap = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
} as const
</script>
