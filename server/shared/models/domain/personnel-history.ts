export type PersonnelHistoryKind = 'employment' | 'education'

export interface PersonnelHistoryValues {
  organization: string
  description: string
  educationLevel: string
  startDate: string
  endDate: string
  reference: string
  remarks: string
}

export interface PersonnelHistoryItem {
  id: string
  personnelId: string
  organization: string
  description: string
  educationLevel: string | null
  startDate: string | null
  endDate: string | null
  reference: string | null
  remarks: string | null
  createdAt: string
  updatedAt: string
}

export interface PersonnelHistoryRow {
  id: string
  personnel_id: string
  employer_name?: string
  job_title?: string
  institution_name?: string
  qualification_name?: string
  education_level?: string | null
  start_date: string | null
  end_date: string | null
  reference: string | null
  remarks: string | null
  created_at: string
  updated_at: string
}

export interface PersonnelHistoryWrite {
  employer_name?: string
  job_title?: string
  institution_name?: string
  qualification_name?: string
  education_level?: string | null
  start_date: string | null
  end_date: string | null
  reference: string | null
  remarks: string | null
}
