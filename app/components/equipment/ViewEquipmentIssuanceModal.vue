<template>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDateDisplay } from '~/composables/useDateDisplay'
import type { EquipmentIssuanceListItem } from '~/types/domain/equipment'

const props = defineProps<{ issuance: EquipmentIssuanceListItem }>()
const emit = defineEmits<{ (event: 'close'): void }>()
const { formatDate } = useDateDisplay()

</script>
