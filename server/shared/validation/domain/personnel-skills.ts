import { createError } from 'h3'
import type { PersonnelSkillFormValues, PersonnelSkillWrite } from '../../models'
import { validatePersonnelSkillValues } from '../../utils/personnel-skills'
import { UUID_PATTERN } from '../../utils/regex'

export const parsePersonnelSkillTrainingOptionsQuery = (query: Record<string, unknown>) => {
  const term = typeof query.term === 'string' ? query.term.trim().slice(0, 160) : ''
  const selectedId = typeof query.selectedId === 'string' ? query.selectedId.trim() : ''
  if (selectedId && !UUID_PATTERN.test(selectedId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid supporting training id.' })
  }
  return { term, selectedId }
}

export const parsePersonnelSkillPayload = (body: unknown): PersonnelSkillWrite => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({ statusCode: 400, statusMessage: 'Skill details are required.' })
  }
  const values = body as Record<string, unknown>
  const getText = (key: string): string => {
    const value = values[key]
    if (value === undefined || value === null) return ''
    if (typeof value !== 'string') {
      throw createError({ statusCode: 400, statusMessage: `${key} must be text.` })
    }
    return value.trim()
  }
  const source = getText('source')
  if (source !== 'training' && source !== 'external') {
    throw createError({ statusCode: 400, statusMessage: 'Select training or an external reference as the skill source.' })
  }
  const form: PersonnelSkillFormValues = {
    name: getText('name'),
    source,
    trainingRecordId: getText('trainingRecordId'),
    externalReference: getText('externalReference'),
    dateObtained: getText('dateObtained'),
    validUntil: getText('validUntil'),
  }
  const errors = validatePersonnelSkillValues(form)
  const message = Object.values(errors)[0]
  if (message) throw createError({ statusCode: 400, statusMessage: message })

  return {
    qualification_type: form.name,
    skill_source: form.source,
    training_record_id: form.source === 'training' ? form.trainingRecordId : null,
    external_reference: form.source === 'external' ? form.externalReference : null,
    date_obtained: form.dateObtained || null,
    valid_until: form.validUntil || null,
  }
}
