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

const groupedPins = computed(() => {
  const groups = new Map<string, PersonnelLocationItem[]>()

  for (const item of props.items) {
    if (item.latitude === null || item.longitude === null) {
      continue
    }

    const key = `${item.latitude.toFixed(5)}:${item.longitude.toFixed(5)}`
    const current = groups.get(key) ?? []
    current.push(item)
    groups.set(key, current)
  }

  return Array.from(groups.entries()).map(([key, items]) => {
    const latitude = items[0]?.latitude ?? 0
    const longitude = items[0]?.longitude ?? 0
    return {
      id: key,
      items,
      x: ((longitude + 180) / 360) * 100,
      y: ((90 - latitude) / 180) * 100,
    }
  })
})

</script>
