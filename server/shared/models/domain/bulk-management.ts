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

export interface BulkDeleteReference {
  table: string
  column: string
}

export interface BulkDomainDefinition {
  table: string
  updatePermissions?: readonly string[]
  deletePermissions?: readonly string[]
  writableColumns: readonly string[]
  deleteReferences: readonly BulkDeleteReference[]
}
