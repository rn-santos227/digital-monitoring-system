import type { AuditAdvancedSearchConditionRequest } from '../../shared/requests'
import { buildAuditSearchConditionExpressions } from '../../shared/utils'

interface AuditSearchBuilder {
  or: (expression: string) => AuditSearchBuilder
  filter: (column: string, operator: string, value: string) => AuditSearchBuilder
}
