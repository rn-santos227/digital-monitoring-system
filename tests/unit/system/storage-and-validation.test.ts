import { afterEach, describe, expect, it, vi } from 'vitest'

import { FILE_UPLOAD_BUCKET_ENV_KEYS } from '@/server/config/storage-s3'
import {
  buildStorageObjectPath,
  isSupabaseStorageQuotaError,
  resolveStorageBucketName,
} from '@/server/shared/utils/file-management'
import {
  hasValueWhenRequired,
  isEndDateOnOrAfterStartDate,
  isNonNegativeNumber,
} from '@/server/shared/utils/validation'
import {
  isValidEmail,
  normalizeWhitespaceToken,
  stripUnsafeFileNameCharacters,
  toCompactTimestamp,
} from '@/server/shared/utils/regex'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.useRealTimers()
})

describe('storage object naming and quota detection', () => {
  it('uses the first nonblank configured bucket or the shared default', () => {
    FILE_UPLOAD_BUCKET_ENV_KEYS.forEach((key) => vi.stubEnv(key, ''))
    expect(resolveStorageBucketName()).toBe('record-attachments')
    vi.stubEnv('GLOBAL_S3_BUCKET', ' fallback ')
    expect(resolveStorageBucketName()).toBe('fallback')
    vi.stubEnv('DMS_STORAGE_BUCKET', ' domain ')
    vi.stubEnv('SUPABASE_STORAGE_BUCKET', ' primary ')
    expect(resolveStorageBucketName()).toBe('primary')
  })

  it('normalizes filenames and creates distinct paths within the current UTC date', () => {
    vi.useFakeTimers({ toFake: ['Date'] }).setSystemTime(
      new Date('2026-10-04T23:00:00Z'),
    )
    const first = buildStorageObjectPath('Report Draft.pdf')
    const second = buildStorageObjectPath('Report Draft.pdf')
    expect(first).toMatch(
      /^records\/2026-10-04\/[a-f0-9-]{36}-[a-f0-9]{12}-report-draft\.pdf$/,
    )
    expect(first).not.toBe(second)
    expect(buildStorageObjectPath('../../report.pdf').split('/')).toHaveLength(
      3,
    )
  })

  it.each([
    'QUOTA exceeded',
    'Storage limit reached',
    'insufficient_storage',
    'Bucket FULL',
  ])('recognizes storage capacity errors: %s', (message) => {
    expect(isSupabaseStorageQuotaError(message)).toBe(true)
  })

  it('does not label unrelated failures as capacity problems', () => {
    expect(isSupabaseStorageQuotaError('permission denied')).toBe(false)
  })
})

describe('shared value validation', () => {
  it.each([
    ['2026-10-01', '2026-10-04', true],
    ['2026-10-04', '2026-10-04', true],
    ['2026-10-05', '2026-10-04', false],
    [null, '2026-10-04', true],
    ['2026-10-04', null, true],
  ] as const)('checks date ordering %s to %s', (start, end, expected) => {
    expect(isEndDateOnOrAfterStartDate(start, end)).toBe(expected)
  })

  it.each([
    [undefined, true],
    [null, true],
    [0, true],
    [2, true],
    [-1, false],
    [Number.NaN, false],
  ] as const)('checks nonnegative values %s', (value, expected) => {
    expect(isNonNegativeNumber(value)).toBe(expected)
  })

  it('requires nonblank values only for required fields', () => {
    expect(hasValueWhenRequired(false, null)).toBe(true)
    expect(hasValueWhenRequired(true, null)).toBe(false)
    expect(hasValueWhenRequired(true, ' ')).toBe(false)
    expect(hasValueWhenRequired(true, ' value ')).toBe(true)
  })

  it('normalizes whitespace, safe filename tokens, and compact timestamps', () => {
    expect(normalizeWhitespaceToken('  first\t last\n name ', '_')).toBe(
      'first_last_name',
    )
    expect(normalizeWhitespaceToken(undefined, '_')).toBe('')
    expect(stripUnsafeFileNameCharacters('report @#1.pdf')).toBe('report1.pdf')
    expect(toCompactTimestamp(new Date('2026-10-04T12:34:56.789Z'))).toBe(
      '20261004123456',
    )
    expect(isValidEmail(' UNIT@example.test ')).toBe(true)
    expect(isValidEmail('invalid')).toBe(false)
  })
})
