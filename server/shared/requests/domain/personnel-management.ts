export interface CreatePersonnelRequest {
  personnelCode?: string
  serviceNumber?: string
  email?: string
  lastName?: string
  firstName?: string
  middleName?: string | null
  sex?: 'Male' | 'Female'
  birthdate?: string | null
  rankId?: string
  companyId?: string | null
  battalionId?: string | null
  employmentStatusId?: string
  serviceStatusId?: string
  contactNumber?: string | null
  position?: string | null
  dateEnlisted?: string | null
}

export interface UpdatePersonnelRequest {
  personnelCode?: string
  serviceNumber?: string
  email?: string
  lastName?: string
  firstName?: string
  middleName?: string | null
  sex?: 'Male' | 'Female'
  birthdate?: string | null
  rankId?: string
  companyId?: string | null
  battalionId?: string | null
  employmentStatusId?: string
  serviceStatusId?: string
  contactNumber?: string | null
  position?: string | null
  dateEnlisted?: string | null
}


export interface PersonnelBatchUploadRowRequest {
  personnelCode?: string
  serviceNumber?: string
  email?: string
  lastName?: string
  firstName?: string
  middleName?: string | null
  sex?: 'Male' | 'Female'
  birthdate?: string | null
  rankId?: string
  companyId?: string | null
  battalionId?: string | null
  employmentStatusId?: string
  serviceStatusId?: string
  contactNumber?: string | null
  position?: string | null
  dateEnlisted?: string | null
}

export type PersonnelSearchMatch = 'any' | 'all'
export type PersonnelSearchOperator = 'contains' | 'equals' | 'notEquals' | 'startsWith' | 'endsWith'

export interface PersonnelAdvancedSearchConditionRequest {
  id?: string
  field?: string
  operator?: PersonnelSearchOperator
  value?: string
}
