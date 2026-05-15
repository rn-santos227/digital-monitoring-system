import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useApplicationSettingsStore } from '~/stores/application-settings'
import type { DateFormat } from '~/types/enums'
import { normalizeDateFormat } from '~/utils/date-format'

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const
const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

const pad2 = (value: number): string => String(value).padStart(2, '0')

const formatByPattern = (date: Date, pattern: DateFormat): string => {
  const year = date.getFullYear()
  const monthIndex = date.getMonth()
  const day = date.getDate()

  switch (pattern) {
    case 'yyyy-MM-dd':
      return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`
    case 'MM/dd/yyyy':
      return `${pad2(monthIndex + 1)}/${pad2(day)}/${year}`
    case 'dd/MM/yyyy':
      return `${pad2(day)}/${pad2(monthIndex + 1)}/${year}`
    case 'dd-MM-yyyy':
      return `${pad2(day)}-${pad2(monthIndex + 1)}-${year}`
    case 'MMMM d, yyyy':
      return `${MONTH_NAMES[monthIndex] ?? MONTH_NAMES[0]} ${day}, ${year}`
    case 'EEE, MMM d, yyyy':
      return `${WEEKDAY_NAMES[date.getDay()] ?? WEEKDAY_NAMES[0]}, ${MONTH_NAMES[monthIndex]?.slice(0, 3) ?? MONTH_NAMES[0].slice(0, 3)} ${day}, ${year}`
    default:
      return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`
  }
}

const parseIsoDate = (value: string): Date | null => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed
}

export const useDateDisplay = () => {
  const applicationSettingsStore = useApplicationSettingsStore()
  const { item } = storeToRefs(applicationSettingsStore)

  const dateFormat = computed<DateFormat>(() => normalizeDateFormat(item.value?.defaultDateFormat))

  const formatDate = (value: string | null | undefined, fallback = '—'): string => {
    if (!value) {
      return fallback
    }

    const parsed = parseIsoDate(value)
    if (!parsed) {
      return fallback
    }

    return formatByPattern(parsed, dateFormat.value)
  }

  return {
    dateFormat,
    formatDate,
  }
}
