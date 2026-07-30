import { createError } from 'h3'
import type { BulkDomainDefinition, BulkMutationItem } from '../models'
import { MAX_BULK_MUTATION_ITEMS, PERMISSION_CODES } from '../constants'

const timestamps = ['created_at', 'updated_at'] as const
const mutable = (...columns: string[]) =>
  columns.filter(
    (column) => !timestamps.includes(column as (typeof timestamps)[number]),
  )

export const BULK_DOMAIN_DEFINITIONS: Readonly<
  Record<string, BulkDomainDefinition>
> = {

}
