export const PERSONNEL_HISTORY_CONFIG = Object.freeze({
  employment: {
    table: 'personnel_employment_records',
    endpoint: '/api/personnel/:id/employment-records',
    actionPrefix: 'PERSONNEL_EMPLOYMENT',
    selectColumns: 'id,personnel_id,employer_name,job_title,start_date,end_date,reference,remarks,created_at,updated_at',
  },
  education: {
    table: 'personnel_education_records',
    endpoint: '/api/personnel/:id/education-records',
    actionPrefix: 'PERSONNEL_EDUCATION',
    selectColumns: 'id,personnel_id,institution_name,qualification_name,education_level,start_date,end_date,reference,remarks,created_at,updated_at',
  },
} as const)

export const PERSONNEL_HISTORY_ORGANIZATION_MAX_LENGTH = 200
export const PERSONNEL_HISTORY_DESCRIPTION_MAX_LENGTH = 200
export const PERSONNEL_HISTORY_REFERENCE_MAX_LENGTH = 1000
export const PERSONNEL_HISTORY_REMARKS_MAX_LENGTH = 3000
