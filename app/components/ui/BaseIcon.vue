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
</script>
