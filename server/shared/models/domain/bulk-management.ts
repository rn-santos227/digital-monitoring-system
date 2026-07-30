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

