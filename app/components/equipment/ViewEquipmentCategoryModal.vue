<template>
</template>

<script setup lang="ts">
import type { EquipmentCategoryDetailItem } from '~/types/domain/equipment'

defineProps<{ category: EquipmentCategoryDetailItem }>()
const emit = defineEmits<{ (event: 'close'): void }>()
</script>
