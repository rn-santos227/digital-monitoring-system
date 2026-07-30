import { createError } from 'h3'
import type { BulkDomainDefinition, BulkMutationItem } from '../models'
import { MAX_BULK_MUTATION_ITEMS, PERMISSION_CODES } from '../constants'
