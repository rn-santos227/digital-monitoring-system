export type PersonnelSkillSource = 'training' | 'external'

export interface PersonnelSkillTrainingRow {
  id: string
  personnel_id: string
  record_no: string
  training_title: string
  certificate_no: string | null
  training_status: { name: string } | { name: string }[] | null
}

export interface PersonnelSkillRow {
  id: string
  personnel_id: string
  qualification_type: string
  date_obtained: string | null
  valid_until: string | null
  skill_source: PersonnelSkillSource | null
  training_record_id: string | null
  external_reference: string | null
  created_at: string
  updated_at: string
  training_record: PersonnelSkillTrainingRow | PersonnelSkillTrainingRow[] | null
}

export interface PersonnelSkillWrite {
  qualification_type: string
  date_obtained: string | null
  valid_until: string | null
  skill_source: PersonnelSkillSource
  training_record_id: string | null
  external_reference: string | null
}

export interface PersonnelSkillItem {
  id: string
  personnelId: string
  name: string
  dateObtained: string | null
  validUntil: string | null
  source: PersonnelSkillSource | null
  trainingRecordId: string | null
  trainingTitle: string | null
  trainingRecordNo: string | null
  trainingStatus: string | null
  certificateNo: string | null
  externalReference: string | null
  createdAt: string
  updatedAt: string
}

export interface PersonnelSkillFormValues {
  name: string
  source: PersonnelSkillSource
  trainingRecordId: string
  externalReference: string
  dateObtained: string
  validUntil: string
}

export interface PersonnelSkillAuditInput {
  userId: string
  action: 'create' | 'update' | 'delete'
  outcome: 'success' | 'failed'
  personnelId: string | null
  recordId?: string | null
  requestData?: object | null
  oldData?: object | null
  newData?: object | null
  error?: unknown
}
