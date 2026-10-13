import { PERSONNEL_SKILLS_API_ENDPOINTS } from '~/constants/api.constants'
import type {
  PersonnelSkillsResponse,
  PersonnelSkillTrainingOptionsResponse,
  SavePersonnelSkillRequest,
  SavePersonnelSkillResponse,
} from '~/types/domain/personnel-skills'
import { createSessionHeaders } from '~/utils/auth-session'

export const getPersonnelSkillsEndpoint = async (personnelId: string, page = 1, pageSize = 10) => {
  return await $fetch<PersonnelSkillsResponse>(PERSONNEL_SKILLS_API_ENDPOINTS.skills(personnelId), {
    method: 'GET', headers: createSessionHeaders(), query: { page, pageSize },
  })
}

export const createPersonnelSkillEndpoint = async (personnelId: string, body: SavePersonnelSkillRequest) => {
  return await $fetch<SavePersonnelSkillResponse>(PERSONNEL_SKILLS_API_ENDPOINTS.skills(personnelId), {
    method: 'POST', headers: createSessionHeaders(), body,
  })
}

export const updatePersonnelSkillEndpoint = async (personnelId: string, skillId: string, body: SavePersonnelSkillRequest) => {
  return await $fetch<SavePersonnelSkillResponse>(PERSONNEL_SKILLS_API_ENDPOINTS.skill(personnelId, skillId), {
    method: 'PATCH', headers: createSessionHeaders(), body,
  })
}

export const deletePersonnelSkillEndpoint = async (personnelId: string, skillId: string) => {
  return await $fetch<{ ok: true }>(PERSONNEL_SKILLS_API_ENDPOINTS.skill(personnelId, skillId), {
    method: 'DELETE', headers: createSessionHeaders(),
  })
}

export const getPersonnelSkillTrainingOptionsEndpoint = async (personnelId: string, term: string, selectedId: string) => {
  return await $fetch<PersonnelSkillTrainingOptionsResponse>(PERSONNEL_SKILLS_API_ENDPOINTS.trainingOptions(personnelId), {
    method: 'GET', headers: createSessionHeaders(), query: { term, selectedId: selectedId || undefined },
  })
}
