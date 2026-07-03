<template>
  <BaseModal
    :title="title"
    :description="description"
    size="lg"
    scroll-body
    @close="emit('close')"
  >
    <div v-if="events.length" class="space-y-3">
      <article
        v-for="event in events"
        :key="event.id"
        class="rounded-xl border p-4"
        :class="CALENDAR_EVENT_TONE_CLASSES[event.tone ?? 'neutral']"
      >
        <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div class="space-y-1">
            <p class="text-sm font-semibold uppercase tracking-wide">
              {{ event.categoryLabel || event.tone || 'Calendar event' }}
            </p>
            <h3 class="text-base font-semibold text-slate-950">
              {{ event.title }}
            </h3>
          </div>
          <p class="text-sm font-medium text-slate-700">
            {{ formatEventRange(event) }}
          </p>
        </div>
        <dl class="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <div v-if="event.location">
            <dt class="font-semibold text-slate-900">Location</dt>
            <dd>{{ event.location }}</dd>
          </div>
          <div v-if="event.description">
            <dt class="font-semibold text-slate-900">Details</dt>
            <dd>{{ event.description }}</dd>
          </div>
        </dl>
      </article>
    </div>
    <p v-else class="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
      No calendar events are scheduled on this date.
    </p>
    <template #footer>
      <div class="flex justify-end">
        <BaseButton variant="secondary" @click="emit('close')">
          Close
        </BaseButton>
      </div>
    </template>
  </BaseModal>
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
