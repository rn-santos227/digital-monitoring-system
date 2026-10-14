import { createError } from 'h3'
import type { PersonnelHistoryKind, PersonnelHistoryWrite } from '../../models'
import { validatePersonnelHistoryValues } from '../../utils/personnel-history'

export const requirePersonnelRecordBody = (body: unknown): Record<string, unknown> => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({ statusCode: 400, statusMessage: 'Record details are required.' })
  }
  return body as Record<string, unknown>
}

export const readPersonnelRecordText = (body: Record<string, unknown>, key: string): string => {
  const value = body[key]
  if (value === undefined || value === null) return ''
  if (typeof value !== 'string') throw createError({ statusCode: 400, statusMessage: `${key} must be text.` })
  return value.trim()
}

export const parsePersonnelHistoryPayload = (body: unknown, kind: PersonnelHistoryKind): PersonnelHistoryWrite => {
  const record = requirePersonnelRecordBody(body)
  const values = {
    organization: readPersonnelRecordText(record, 'organization'),
    description: readPersonnelRecordText(record, 'description'),
    educationLevel: readPersonnelRecordText(record, 'educationLevel'),
    startDate: readPersonnelRecordText(record, 'startDate'),
    endDate: readPersonnelRecordText(record, 'endDate'),
    reference: readPersonnelRecordText(record, 'reference'),
    remarks: readPersonnelRecordText(record, 'remarks'),
  }
  const message = Object.values(validatePersonnelHistoryValues(values, kind))[0]
  if (message) throw createError({ statusCode: 400, statusMessage: message })
  return {
    ...(kind === 'employment'
      ? { employer_name: values.organization, job_title: values.description }
      : { institution_name: values.organization, qualification_name: values.description, education_level: values.educationLevel || null }),
    start_date: values.startDate || null,
    end_date: values.endDate || null,
    reference: values.reference || null,
    remarks: values.remarks || null,
  }
}
