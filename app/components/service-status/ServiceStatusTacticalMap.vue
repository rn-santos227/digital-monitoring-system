<template>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import serviceStatusPinIcon from '~/assets/icons/service-status-pin.svg'
import type { PersonnelLocationItem } from '~/utils/service-status-endpoints'

const props = defineProps<{ items: PersonnelLocationItem[]; selectedPersonnelId: string | null }>()
const emit = defineEmits<{ (event: 'select', item: PersonnelLocationItem): void }>()

const clusterSelection = ref<PersonnelLocationItem[]>([])


</script>
