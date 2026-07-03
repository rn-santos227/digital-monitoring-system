<template>

</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseModal from '~/components/ui/BaseModal.vue'
import { CALENDAR_EVENT_TONE_CLASSES } from '~/constants/calendar.constants'
import type { CalendarEventItem } from '~/types/domain/calendar'


const props = defineProps<{
  title: string
  description?: string
  events: CalendarEventItem[]
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const eventDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

const formatEventRange = (event: CalendarEventItem): string => {
  const start = new Date(event.startDate)
  const end = event.endDate ? new Date(event.endDate) : null

  if (Number.isNaN(start.getTime())) {
    return event.startDate
  }

  if (!end || Number.isNaN(end.getTime())) {
    return eventDateFormatter.format(start)
  }

  return `${eventDateFormatter.format(start)} – ${eventDateFormatter.format(end)}`
}

void props
</script>
