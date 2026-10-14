import type { PersonnelFeedbackItem, PersonnelFeedbackRow, PersonnelFeedbackValues } from '../models'
import { PERSONNEL_FEEDBACK_MAX_LENGTH } from '../constants/lib/personnel-feedback'
import { isValidPersonnelRecordDate } from './personnel-history'

export const validatePersonnelFeedbackValues = (values: PersonnelFeedbackValues): Record<string, string> => {
  const errors: Record<string, string> = {}
  if (!values.feedback.trim() || values.feedback.trim().length > PERSONNEL_FEEDBACK_MAX_LENGTH) {
    errors.feedback = 'Performance feedback is required and must not exceed 6000 characters.'
  }
  if (!isValidPersonnelRecordDate(values.reviewDate)) errors.reviewDate = 'A valid review date is required.'
  if (values.rating !== null && (!Number.isInteger(values.rating) || values.rating < 1 || values.rating > 5)) {
    errors.rating = 'Rating must be a whole number from 1 to 5, or left blank.'
  }
  if (values.attestAuthorship !== true) errors.attestAuthorship = 'Confirm that you authored this feedback before officiating it.'
  return errors
}

export const mapPersonnelFeedbackItem = (row: PersonnelFeedbackRow): PersonnelFeedbackItem => ({
  id: row.id,
  personnelId: row.personnel_id,
  feedback: row.feedback,
  reviewDate: row.review_date,
  rating: row.rating,
  authorUserId: row.author_user_id,
  authorPersonnelId: row.author_personnel_id,
  authorName: row.author_name,
  authorTitle: row.author_title,
  authorRank: row.author_rank,
  authorServiceNumber: row.author_service_number,
  officiatedAt: row.officiated_at,
})
