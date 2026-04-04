<template>

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

</script>