export const PERSONNEL_SKILL_SELECT_COLUMNS = [
  'id,personnel_id,qualification_type,date_obtained,valid_until',
  'skill_source,training_record_id,external_reference,created_at,updated_at',
  'training_record:training_records!personnel_qualifications_skill_training_owner_fkey(id,personnel_id,record_no,training_title,certificate_no,training_status:training_statuses(name))',
].join(',')

export const PERSONNEL_SKILL_TRAINING_SELECT_COLUMNS =
  'id,personnel_id,record_no,training_title,certificate_no,training_status:training_statuses(name)'

export const PERSONNEL_SKILL_NAME_MAX_LENGTH = 160
export const PERSONNEL_SKILL_REFERENCE_MAX_LENGTH = 1000
export const PERSONNEL_SKILL_TRAINING_OPTIONS_LIMIT = 25
export const PERSONNEL_SKILL_AUDIT_ACTIONS = Object.freeze({
  create: 'PERSONNEL_SKILL_CREATE',
  update: 'PERSONNEL_SKILL_UPDATE',
  delete: 'PERSONNEL_SKILL_DELETE',
})

export const PERSONNEL_SKILL_AUDIT_ENDPOINTS = Object.freeze({
  create: '/api/personnel/:id/skills',
  update: '/api/personnel/:id/skills/:skillId',
  delete: '/api/personnel/:id/skills/:skillId',
})
