import type { PersonnelSkillSource } from '../../models'

export interface SavePersonnelSkillRequest {
  name: string
  source: PersonnelSkillSource
  trainingRecordId?: string | null
  externalReference?: string | null
  dateObtained?: string | null
  validUntil?: string | null
}
