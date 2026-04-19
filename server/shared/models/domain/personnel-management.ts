export interface PersonnelListItem {
  id: string
  personnelCode: string
  serviceNumber: string
  fullName: string
  sex: 'Male' | 'Female'
  rankName: string
  companyName: string | null
  battalionName: string | null
  employmentStatus: string
  serviceStatus: string
  createdAt: string
  updatedAt: string
}

export interface PersonnelListResponse {
  items: PersonnelListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface CreatePersonnelBody {
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

export interface UpdatePersonnelBody {
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
