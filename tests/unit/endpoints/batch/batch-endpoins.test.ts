import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import ExcelJS from 'exceljs'
import { describe, expect, it } from 'vitest'

import {
  BULK_DOMAIN_DEFINITIONS,
  getBulkDomainDefinition,
  parseBulkIds,
  parseBulkUpdateItems,
} from '../../../../server/shared/utils/bulk-management'
import { parsePersonnelBatchUploadWorkbook } from '../../../../server/shared/utils/personnel-batch-upload'

describe('bulk mutation endpoints', () => {
  it.each(['bulk.patch.ts', 'bulk.delete.ts'])('protects and audits %s', async (fileName) => {
    const source = await readFile(
      resolve(process.cwd(), 'server/api/[domain]', fileName),
      'utf8',
    )

    expect(source).toContain('export default defineEventHandler')
    expect(source).toContain('requireBulkPermission')
    expect(source).toContain('recordManagementAuditLog')
    expect(source).toContain('AUDIT_LOG_OUTCOMES.success')
    expect(source).toContain('AUDIT_LOG_OUTCOMES.failed')
  })
})
