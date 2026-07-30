export interface BulkMutationItem {
  id?: string
  updates?: Record<string, unknown>
}

export interface BulkUpdateRequest {
  items?: BulkMutationItem[]
}
