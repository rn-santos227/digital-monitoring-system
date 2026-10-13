import { PERSONNEL_FEEDBACK_TIMESTAMP_OPTIONS } from '~/constants/page.constants'

const feedbackTimeFormatter = new Intl.DateTimeFormat('en-PH', PERSONNEL_FEEDBACK_TIMESTAMP_OPTIONS)

export const formatPersonnelFeedbackTime = (value: string): string => {
  const date = new Date(value)
  return Number.isFinite(date.getTime()) ? feedbackTimeFormatter.format(date) : '—'
}
