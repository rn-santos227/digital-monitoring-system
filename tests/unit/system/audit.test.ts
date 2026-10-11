import { describe, expect, it, vi } from 'vitest'

import { SESSION_TOKEN_HEADER_NAME } from '@/server/shared/constants'
import {
  buildAuditSearchConditionExpressions,
  buildLoginAuditRequestData,
  mapAuditLogDetail,
  mapAuditLogListItem,
  normalizeAuditRequestHeaders,
} from '@/server/shared/utils/audit'
import {
  parseAuditAdvancedSearchConditions,
  parseAuditLogSearchQuery,
  parseRecordPrintedTableAuditPayload,
} from '@/server/shared/validation/domain/audit'
import { applyAuditAdvancedSearch } from '@/server/utils/audit/applyAuditAdvancedSearch'
import { buildAuditLegacySearchExpressions } from '@/server/utils/audit/buildAuditLegacySearchExpressions'
import {
  formatAuditJson,
  formatAuditTimestamp,
  mapAuditLogItemToTableRow,
  resolveAuditActorLabel,
} from '@/app/utils/audit'
import { auditFixture } from '@/tests/helpers/audit-fixture'

describe('audit credential redaction and display', () => {
  it('omits authorization, cookie, and session credentials while retaining nonsensitive headers', () => {
    expect(
      normalizeAuditRequestHeaders({
        Authorization: 'secret',
        Cookie: 'secret',
        [SESSION_TOKEN_HEADER_NAME]: 'secret',
        accept: ['application/json', 'text/plain'],
        missing: undefined,
      }),
    ).toEqual({ accept: 'application/json, text/plain' })
    expect(
      buildLoginAuditRequestData('unit@example.test', 'secret-password'),
    ).toEqual({ email: 'unit@example.test', hasPassword: true })
    expect(buildLoginAuditRequestData()).toEqual({
      email: null,
      hasPassword: false,
    })
  })

  it('uses actor name, email, and system fallbacks in that order', () => {
    expect(resolveAuditActorLabel(auditFixture)).toBe('Unit User')
    expect(
      resolveAuditActorLabel({
        ...auditFixture,
        actor: { fullName: ' ', email: 'unit@example.test' },
      }),
    ).toBe('unit@example.test')
    expect(resolveAuditActorLabel({ ...auditFixture, actor: null })).toBe(
      'System',
    )
    expect(
      mapAuditLogItemToTableRow({ ...auditFixture, statusCode: null }),
    ).toMatchObject({ recordId: 'N/A', ipAddress: 'N/A', statusCode: 'N/A' })
    expect(mapAuditLogItemToTableRow(auditFixture).statusCode).toBe('200')
    expect(formatAuditTimestamp('invalid')).toBe('invalid')
    expect(formatAuditJson(null)).toBe('No data captured.')
    expect(formatAuditJson({})).toBe('No data captured.')
    expect(formatAuditJson({ field: 'value' })).toBe('{\n  "field": "value"\n}')
  })

  it.each(['object', 'array', 'empty', 'null'] as const)(
    'normalizes %s actor relations in list and detail responses',
    (kind) => {
      const actor = {
        id: 'user',
        full_name: 'Unit User',
        email: 'unit@example.test',
        avatar_url: null,
        is_active: false,
      }
      const user =
        kind === 'object'
          ? actor
          : kind === 'array'
            ? [actor]
            : kind === 'empty'
              ? []
              : null
      const row = {
        id: 'audit',
        user_id: 'user',
        action: 'UPDATE',
        table_name: 'personnel',
        record_id: null,
        old_data: null,
        new_data: null,
        request_data: null,
        response_data: null,
        request_headers: null,
        ip_address: null,
        status_code: 200,
        metadata: null,
        created_at: 'created',
        user,
      }
      const expectedActor =
        kind === 'object' || kind === 'array'
          ? { fullName: 'Unit User', email: 'unit@example.test' }
          : null
      expect(mapAuditLogListItem(row).actor).toEqual(expectedActor)
      expect(mapAuditLogDetail(row).actor).toEqual(
        expectedActor
          ? { ...expectedActor, id: 'user', avatarUrl: null, isActive: false }
          : null,
      )
      expect(mapAuditLogDetail({ ...row, user: {} }).actor).toEqual({
        id: null,
        fullName: null,
        email: null,
        avatarUrl: null,
        isActive: null,
      })
    },
  )
})

describe('audit search parsing and query construction', () => {
  const condition = { field: 'action', operator: 'equals', value: ' UPDATE ' }

  it.each([
    'invalid',
    '{}',
    '[]',
    '[null]',
    JSON.stringify(Array.from({ length: 13 }, () => condition)),
    JSON.stringify([{ ...condition, field: 'invalid' }]),
    JSON.stringify([{ ...condition, operator: 'invalid' }]),
    JSON.stringify([{ ...condition, value: '' }]),
    JSON.stringify([{ ...condition, operator: 'between' }]),
  ])('rejects invalid conditions %s', (serialized) => {
    expect(() => parseAuditAdvancedSearchConditions(serialized)).toThrow(
      expect.objectContaining({ statusCode: 400 }),
    )
  })

  it('normalizes conditions, requires a filter, and preserves match mode', () => {
    expect(
      parseAuditAdvancedSearchConditions(JSON.stringify([condition])),
    ).toEqual([
      {
        field: 'action',
        operator: 'equals',
        value: 'UPDATE',
        valueTo: undefined,
      },
    ])
    expect(() => parseAuditLogSearchQuery({})).toThrow(
      expect.objectContaining({ statusCode: 400 }),
    )
    expect(
      parseAuditLogSearchQuery({
        conditions: JSON.stringify([condition]),
        match: 'any',
      }).match,
    ).toBe('any')
    expect(
      parseAuditLogSearchQuery({
        term: ' UPDATE ',
        fields: 'action',
        userName: ' User ',
        startDate: '2026-10-01',
        endDate: '2026-10-04',
      }),
    ).toMatchObject({
      term: 'UPDATE',
      userName: 'User',
      match: 'all',
      conditions: [],
    })
  })

  it.each([
    { operator: 'contains', expectedOperator: 'ilike', operand: '*value*' },
    { operator: 'equals', expectedOperator: 'eq', operand: 'value' },
    { operator: 'notEquals', expectedOperator: 'neq', operand: 'value' },
    { operator: 'startsWith', expectedOperator: 'ilike', operand: 'value*' },
    { operator: 'endsWith', expectedOperator: 'ilike', operand: '*value' },
  ] as const)(
    'builds $operator expressions without query separators',
    ({ operator, expectedOperator, operand }) => {
      expect(
        buildAuditSearchConditionExpressions({
          field: 'tableName',
          operator,
          value: '"(value),\\',
        }),
      ).toEqual([{ column: 'table_name', operator: expectedOperator, operand }])
    },
  )

  it('builds grouped date ranges and all/any conditions', () => {
    const between = {
      field: 'createdAt',
      operator: 'between',
      value: '2026-10-01',
      valueTo: '2026-10-04',
    } as const
    expect(buildAuditSearchConditionExpressions(between)).toEqual([
      { column: 'created_at', operator: 'gte', operand: '2026-10-01' },
      { column: 'created_at', operator: 'lte', operand: '2026-10-04' },
    ])
    const builder = {
      or: vi.fn().mockReturnThis(),
      filter: vi.fn().mockReturnThis(),
    }
    expect(applyAuditAdvancedSearch(builder, [between], 'all')).toBe(builder)
    expect(builder.filter).toHaveBeenCalledTimes(2)
    applyAuditAdvancedSearch(
      builder,
      [between, { field: 'action', operator: 'equals', value: 'UPDATE' }],
      'any',
    )
    expect(builder.or).toHaveBeenCalledWith(
      'and(created_at.gte.2026-10-01,created_at.lte.2026-10-04),action.eq.UPDATE',
    )
  })

  it('builds legacy text, IP, and numeric searches and rejects unsupported fields', () => {
    expect(buildAuditLegacySearchExpressions('', 'action')).toEqual([])
    expect(buildAuditLegacySearchExpressions('200', 'statusCode')).toEqual([
      'status_code.eq.200',
    ])
    expect(buildAuditLegacySearchExpressions('127.0.0.1', 'ipAddress')).toEqual(
      ['ip_address.eq.127.0.0.1'],
    )
    expect(buildAuditLegacySearchExpressions('UPDATE', 'action')).toEqual([
      'action.ilike.%UPDATE%',
    ])
    expect(buildAuditLegacySearchExpressions('UPDATE').length).toBeGreaterThan(
      1,
    )
    expect(() =>
      buildAuditLegacySearchExpressions('text', 'statusCode'),
    ).toThrow(expect.objectContaining({ statusCode: 400 }))
    expect(() => buildAuditLegacySearchExpressions('text', 'invalid')).toThrow(
      expect.objectContaining({ statusCode: 400 }),
    )
  })

  it('validates print audit table names and object-shaped filters', () => {
    expect(
      parseRecordPrintedTableAuditPayload({
        tableName: ' personnel ',
        tableLabel: ' Personnel ',
        filters: { status: 'Active' },
      }),
    ).toEqual({
      tableName: 'personnel',
      tableLabel: 'Personnel',
      filters: { status: 'Active' },
    })
    expect(
      parseRecordPrintedTableAuditPayload({ tableName: 'personnel' }),
    ).toEqual({ tableName: 'personnel', tableLabel: null, filters: null })
    expect(() =>
      parseRecordPrintedTableAuditPayload({ tableName: '' }),
    ).toThrow(expect.objectContaining({ statusCode: 400 }))
    expect(() =>
      parseRecordPrintedTableAuditPayload({
        tableName: 'personnel',
        filters: [] as unknown as Record<string, unknown>,
      }),
    ).toThrow(expect.objectContaining({ statusCode: 400 }))
  })
})
