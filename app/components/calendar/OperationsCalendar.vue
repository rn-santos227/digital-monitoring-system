<template>
  <section class="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <header class="flex flex-col gap-4 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-wide text-emerald-700">{{ eyebrow }}</p>
        <h2 class="text-2xl font-semibold text-slate-950">{{ calendarTitle }}</h2>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <BaseButton variant="secondary" size="sm" @click="movePrevious">Previous</BaseButton>
        <BaseButton variant="ghost" size="sm" @click="setToday">Today</BaseButton>
        <BaseButton variant="secondary" size="sm" @click="moveNext">Next</BaseButton>
        <BaseTab v-model="selectedViewMode" :items="CALENDAR_VIEW_MODE_ITEMS" aria-label="Calendar view mode" />
      </div>
    </header>

    <div class="p-4">
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" class="mb-4" />
      <BaseInlineLoader v-if="isLoading" label="Loading calendar events..." class="mb-4" />

      <div v-if="selectedViewMode === 'month'" class="overflow-hidden rounded-xl border border-slate-200">
        <div class="grid grid-cols-7 bg-slate-50 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
          <div v-for="dayLabel in CALENDAR_WEEKDAY_LABELS" :key="dayLabel" class="border-r border-slate-200 px-2 py-3 last:border-r-0">
            {{ dayLabel }}
          </div>
        </div>
        <div class="grid grid-cols-7">
          <button
            v-for="cell in monthCells"
            :key="cell.key"
            type="button"
            class="min-h-32 border-r border-t border-slate-200 p-2 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 last:border-r-0"
            :class="cell.isCurrentMonth ? 'bg-white' : 'bg-slate-50/70 text-slate-400'"
            @click="openDateEvents(cell.date)"
          >
            <span class="inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold" :class="cell.isToday ? 'bg-emerald-700 text-white' : ''">
              {{ cell.dayNumber }}
            </span>
            <div class="mt-2 space-y-1">
              <p
                v-for="event in cell.events.slice(0, 3)"
                :key="event.id"
                class="truncate rounded-lg border px-2 py-1 text-xs font-medium"
                :class="CALENDAR_EVENT_TONE_CLASSES[event.tone ?? 'neutral']"
              >
                {{ event.title }}
              </p>
              <p v-if="cell.events.length > 3" class="text-xs font-medium text-slate-500">
                +{{ cell.events.length - 3 }} more
              </p>
            </div>
          </button>
        </div>
      </div>

      <div v-else class="overflow-hidden rounded-xl border border-slate-200">
        <div class="grid" :class="selectedViewMode === 'week' ? 'grid-cols-[5rem_repeat(7,minmax(8rem,1fr))]' : 'grid-cols-[5rem_minmax(12rem,1fr)]'">
          <div class="border-b border-r border-slate-200 bg-slate-50 p-3 text-xs font-semibold uppercase text-slate-500">Time</div>
          <button
            v-for="day in visibleDays"
            :key="day.dateKey"
            type="button"
            class="border-b border-r border-slate-200 bg-slate-50 p-3 text-left last:border-r-0 hover:bg-slate-100"
            @click="openDateEvents(day.date)"
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ day.weekday }}</p>
            <p class="text-sm font-semibold text-slate-900">{{ day.label }}</p>
          </button>

          <template v-for="hour in hourRows" :key="hour.label">
            <div class="border-r border-t border-slate-200 bg-slate-50 px-3 py-4 text-xs font-medium text-slate-500">
              {{ hour.label }}
            </div>
            <div
              v-for="day in visibleDays"
              :key="`${day.dateKey}-${hour.value}`"
              class="min-h-20 border-r border-t border-slate-200 p-2 last:border-r-0"
            >
              <button
                v-for="event in getEventsForDayAndHour(day.date, hour.value)"
                :key="event.id"
                type="button"
                class="mb-1 w-full rounded-lg border px-2 py-1 text-left text-xs font-medium"
                :class="CALENDAR_EVENT_TONE_CLASSES[event.tone ?? 'neutral']"
                @click="openDateEvents(day.date)"
              >
                <span class="block truncate">{{ event.title }}</span>
                <span v-if="event.location" class="block truncate font-normal opacity-80">{{ event.location }}</span>
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>

    <CalendarEventsModal
      v-if="selectedDate"
      :title="selectedDateModalTitle"
      :description="`${selectedDateEvents.length} event${selectedDateEvents.length === 1 ? '' : 's'} scheduled`"
      :events="selectedDateEvents"
      @close="selectedDate = null"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseAlert from '~/components/ui/BaseAlert.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInlineLoader from '~/components/ui/BaseInlineLoader.vue'
import BaseTab from '~/components/ui/BaseTab.vue'
import CalendarEventsModal from './CalendarEventsModal.vue'
import {
  CALENDAR_EVENT_TONE_CLASSES,
  CALENDAR_HOUR_LABELS,
  CALENDAR_VIEW_MODE_ITEMS,
  CALENDAR_WEEKDAY_LABELS,
} from '~/constants/calendar.constants'
import type { CalendarEventItem, CalendarViewMode } from '~/types/domain/calendar'
import {
  addDays,
  buildMonthCells,
  eventOccursOnDate,
  formatCalendarTitle,
  getEventHour,
  startOfMonthGrid,
  startOfDay,
  startOfWeek,
  toDateKey,
} from '~/utils/calendar'

const props = withDefaults(
  defineProps<{
    events?: CalendarEventItem[]
    eyebrow?: string
    description?: string
    initialDate?: string
    initialViewMode?: CalendarViewMode
    isLoading?: boolean
    errorMessage?: string
  }>(),
  {
    events: () => [],
    eyebrow: 'Operations calendar',
    description: 'View scheduled records by day, week, or month.',
    initialDate: undefined,
    initialViewMode: 'month',
    isLoading: false,
    errorMessage: '',
  }
)

const selectedViewMode = ref<CalendarViewMode>(props.initialViewMode)
const activeDate = ref(props.initialDate ? startOfDay(new Date(props.initialDate)) : startOfDay(new Date()))
const selectedDate = ref<Date | null>(null)

const calendarTitle = computed(() => formatCalendarTitle(activeDate.value, selectedViewMode.value))
const monthCells = computed(() => buildMonthCells(activeDate.value, props.events))

const visibleRangeQuery = computed(() => {
  if (selectedViewMode.value === 'month') {
    const rangeStart = startOfMonthGrid(activeDate.value)
    const rangeEnd = addDays(rangeStart, 41)

    return {
      viewMode: selectedViewMode.value,
      date: toDateKey(activeDate.value),
      rangeStart: toDateKey(rangeStart),
      rangeEnd: toDateKey(rangeEnd),
    }
  }

  if (selectedViewMode.value === 'week') {

  }
})

const visibleDays = computed(() => {
  const firstDay = selectedViewMode.value === 'week' ? startOfWeek(activeDate.value) : activeDate.value
  const dayCount = selectedViewMode.value === 'week' ? 7 : 1
  const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
  const dayFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

  return Array.from({ length: dayCount }, (_, index) => {
    const date = addDays(firstDay, index)
    return {
      date,
      dateKey: date.toISOString(),
      weekday: weekdayFormatter.format(date),
      label: dayFormatter.format(date),
    }
  })
})

const hourRows = computed(() => CALENDAR_HOUR_LABELS.map((label, value) => ({ label, value })))

const selectedDateEvents = computed(() => {
  if (!selectedDate.value) {
    return []
  }

  return props.events.filter((event) => eventOccursOnDate(event, selectedDate.value ?? activeDate.value))
})

const selectedDateModalTitle = computed(() => {
  if (!selectedDate.value) {
    return 'Calendar events'
  }

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(selectedDate.value)
})

const movePrevious = () => {
  if (selectedViewMode.value === 'month') {
    activeDate.value = new Date(activeDate.value.getFullYear(), activeDate.value.getMonth() - 1, 1)
    return
  }

  activeDate.value = addDays(activeDate.value, selectedViewMode.value === 'week' ? -7 : -1)
}

const moveNext = () => {
  if (selectedViewMode.value === 'month') {
    activeDate.value = new Date(activeDate.value.getFullYear(), activeDate.value.getMonth() + 1, 1)
    return
  }

  activeDate.value = addDays(activeDate.value, selectedViewMode.value === 'week' ? 7 : 1)
}

const setToday = () => {
  activeDate.value = startOfDay(new Date())
}

const openDateEvents = (date: Date) => {
  selectedDate.value = startOfDay(date)
}

const getEventsForDayAndHour = (date: Date, hour: number): CalendarEventItem[] =>
  props.events.filter((event) => eventOccursOnDate(event, date) && (event.allDay || getEventHour(event) === hour))
</script>
