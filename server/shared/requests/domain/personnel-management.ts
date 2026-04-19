export interface CreatePersonnelRequest {
  personnelCode?: string
  serviceNumber?: string
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
  dateEnlisted?: string | null
}

export interface UpdatePersonnelRequest {
  personnelCode?: string
  serviceNumber?: string
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
  dateEnlisted?: string | null
}
