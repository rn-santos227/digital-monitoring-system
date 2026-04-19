export interface PersonnelListItemCompact {
  id: string
  personnelCode: string
  serviceNumber: string
  fullName: string
  rankName: string
  companyName: string | null
  battalionName: string | null
  serviceStatus: string
}

export interface PersonnelListCompactResponse {
  items: PersonnelListItemCompact[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PersonnelDetailResponse {
  id: string
  personnelCode: string
  serviceNumber: string
  lastName: string
  firstName: string
  middleName: string | null
  sex: 'Male' | 'Female'
  birthdate: string | null
  rankId: string
  rankCode: string
  rankName: string
  companyId: string | null
  companyCode: string | null
  companyName: string | null
  battalionId: string | null
  battalionCode: string | null
  battalionName: string | null
  employmentStatusId: string
  employmentStatus: string
  serviceStatusId: string
  serviceStatus: string
  contactNumber: string | null
  dateEnlisted: string | null
  createdAt: string
  updatedAt: string
}
