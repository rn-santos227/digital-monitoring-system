export interface BulkMutationItem {
  id?: string
  updates?: Record<string, unknown>
}

export interface BulkUpdateRequest {
  items?: BulkMutationItem[]
}

export interface BulkDeleteRequest {
  ids?: string[]
}

export interface BulkMutationResponse {
  ok: true
  affectedCount: number
  ids: string[]
}
