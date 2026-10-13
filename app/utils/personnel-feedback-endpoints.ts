import { PERSONNEL_FEEDBACK_API_ENDPOINTS } from '~/constants/api.constants'
import type { CreatePersonnelFeedbackRequest, CreatePersonnelFeedbackResponse, PersonnelFeedbackOfficial, PersonnelFeedbackResponse } from '~/types/domain/personnel-feedback'
import { createSessionHeaders } from '~/utils/auth-session'

export const getPersonnelFeedbackEndpoint = async (personnelId: string, page: number, pageSize: number) => {
  return await $fetch<PersonnelFeedbackResponse>(PERSONNEL_FEEDBACK_API_ENDPOINTS.feedback(personnelId), {
    method: 'GET', headers: createSessionHeaders(), query: { page, pageSize },
  })
}
export const createPersonnelFeedbackEndpoint = async (personnelId: string, body: CreatePersonnelFeedbackRequest) => {
  return await $fetch<CreatePersonnelFeedbackResponse>(PERSONNEL_FEEDBACK_API_ENDPOINTS.feedback(personnelId), {
    method: 'POST', headers: createSessionHeaders(), body,
  })
}
export const getPersonnelFeedbackOfficialEndpoint = async () => {
  return await $fetch<PersonnelFeedbackOfficial>(PERSONNEL_FEEDBACK_API_ENDPOINTS.official, {
    method: 'GET', headers: createSessionHeaders(),
  })
}
