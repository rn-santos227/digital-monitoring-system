import { createError } from 'h3'
import type { PersonnelFeedbackValues } from '../../models'
import { validatePersonnelFeedbackValues } from '../../utils/personnel-feedback'
import { readPersonnelRecordText, requirePersonnelRecordBody } from './personnel-history'

export const parsePersonnelFeedbackPayload = (body: unknown): PersonnelFeedbackValues => {
  const record = requirePersonnelRecordBody(body)
  // Author identifiers and timestamps are never accepted from a client.
  const values = {
    feedback: readPersonnelRecordText(record, 'feedback'),
    reviewDate: readPersonnelRecordText(record, 'reviewDate'),
    rating: record.rating === undefined || record.rating === null ? null : record.rating,
    attestAuthorship: record.attestAuthorship === true,
  }
  if (values.rating !== null && typeof values.rating !== 'number') {
    throw createError({ statusCode: 400, statusMessage: 'Rating must be a number.' })
  }
  const normalized: PersonnelFeedbackValues = { ...values, rating: values.rating }
  const message = Object.values(validatePersonnelFeedbackValues(normalized))[0]
  if (message) throw createError({ statusCode: 400, statusMessage: message })
  return normalized
}
