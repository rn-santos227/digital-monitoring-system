export interface UnitListResponse<TItem> {
  items: TItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface BattalionListItem {
  id: string
  code: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CompanyListItem {
  id: string
  battalionId: string | null
  battalionCode: string | null
  battalionName: string | null
  code: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BattalionRow {
  id: string
  code: string
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BattalionReferenceRow {
  id: string
  code: string
  name: string
}

export interface CompanyRow {
  id: string
  battalion_id: string | null
  code: string
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
  battalion: BattalionReferenceRow | BattalionReferenceRow[] | null
}

export interface BattalionSuggestionItem {
  id: string
  code: string
  name: string
  isActive: boolean
}

export interface CompanySuggestionItem {
  id: string
  battalionId: string | null
  battalionCode: string | null
  battalionName: string | null
  code: string
  name: string
  isActive: boolean
}

export interface UnitSuggestionResponse<TItem> {
  items: TItem[]
}
