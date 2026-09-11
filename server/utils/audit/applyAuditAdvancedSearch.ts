import type { AuditAdvancedSearchConditionRequest } from '../../shared/requests'
import { buildAuditSearchConditionExpressions } from '../../shared/utils'

interface AuditSearchBuilder {
  or: (expression: string) => AuditSearchBuilder
  filter: (column: string, operator: string, value: string) => AuditSearchBuilder
}


export const applyAuditAdvancedSearch = <TQuery>(
  sourceQuery: TQuery,
  conditions: readonly AuditAdvancedSearchConditionRequest[],
  match: 'any' | 'all',
): TQuery => {
  let query = sourceQuery as unknown as AuditSearchBuilder

  if (match === 'any') {
    const groups = conditions.map((condition) => {
      const expressions = buildAuditSearchConditionExpressions(condition)
        .map(expression => `${expression.column}.${expression.operator}.${expression.operand}`)
      return expressions.length > 1 ? `and(${expressions.join(',')})` : expressions[0] ?? ''
    })
    return query.or(groups.join(',')) as unknown as TQuery
  }

  conditions.forEach((condition) => {
    buildAuditSearchConditionExpressions(condition).forEach((expression) => {
      query = query.filter(expression.column, expression.operator, expression.operand)
    })
  })

  return query as unknown as TQuery
}
