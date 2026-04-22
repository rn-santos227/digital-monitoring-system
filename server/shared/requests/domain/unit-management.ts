export interface CreateBattalionRequest {
  code?: string
  name?: string
  isActive?: boolean
}

export interface UpdateBattalionRequest {
  code?: string
  name?: string
  isActive?: boolean
}

export interface CreateCompanyRequest {
  battalionId?: string | null
  code?: string
  name?: string
  isActive?: boolean
}

export interface UpdateCompanyRequest {
  battalionId?: string | null
  code?: string
  name?: string
  isActive?: boolean
}
