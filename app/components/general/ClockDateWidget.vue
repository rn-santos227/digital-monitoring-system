<template>
  <div class="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
    <ClockIcon class="h-4 w-4 text-slate-500" aria-hidden="true" />
    <span>{{ formattedDateTime }}</span>
  </div>
</template>

<script setup lang="ts">
import { ClockIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { useDateDisplay } from '~/composables/useDateDisplay'
import { useApplicationSettingsStore } from '~/stores/application-settings'

const now = ref(new Date())
const { formatDate } = useDateDisplay()
const applicationSettingsStore = useApplicationSettingsStore()
const { item } = storeToRefs(applicationSettingsStore)

const formatTime = (date: Date): string => {
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  if (item.value?.defaultTimeFormat === '12h') {
    const meridiem = hours >= 12 ? 'PM' : 'AM'
    const normalizedHour = hours % 12 || 12
    return `${String(normalizedHour).padStart(2, '0')}:${minutes}:${seconds} ${meridiem}`
  }

  return `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`
}

const formattedDateTime = computed(() => {
  const currentDate = now.value
  const formattedDate = formatDate(currentDate.toISOString(), '—')
  const formattedTime = formatTime(currentDate)

  return `${formattedDate} ${formattedTime}`
})

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>
