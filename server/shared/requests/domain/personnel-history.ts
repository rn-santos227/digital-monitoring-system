export interface SavePersonnelHistoryRequest {
  organization: string
  description: string
  educationLevel?: string | null
  startDate?: string | null
  endDate?: string | null
  reference?: string | null
  remarks?: string | null
}
