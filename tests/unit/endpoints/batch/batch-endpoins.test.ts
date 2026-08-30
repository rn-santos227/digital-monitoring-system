import ExcelJS from 'exceljs'
import { describe, expect, it } from 'vitest'

import bulkDeleteSource from '../../../../server/api/[domain]/bulk.delete'
import bulkPatchSource from '../../../../server/api/[domain]/bulk.patch'
import personnelBatchUploadSource from '../../../../server/api/personnel/batch-upload.post'

import {
  BULK_DOMAIN_DEFINITIONS,
  getBulkDomainDefinition,
  parseBulkIds,
  parseBulkUpdateItems,
} from '../../../../server/shared/utils/bulk-management'
import { parsePersonnelBatchUploadWorkbook } from '../../../../server/shared/utils/personnel-batch-upload'

describe('bulk mutation endpoints', () => {
  it.each([
    ['bulk.patch.ts', bulkPatchSource],
    ['bulk.delete.ts', bulkDeleteSource],
  ])('protects and audits %s', (fileName, source) => {
    expect(source).toContain('export default defineEventHandler')
    expect(source).toContain('requireBulkPermission')
    expect(source).toContain('recordManagementAuditLog')
    expect(source).toContain('AUDIT_LOG_OUTCOMES.success')
    expect(source).toContain('AUDIT_LOG_OUTCOMES.failed')
  })

  it('defines update and delete behavior for every bulk CRUD domain', () => {
   for (const [domain, definition] of Object.entries(BULK_DOMAIN_DEFINITIONS)) {
      expect(getBulkDomainDefinition(domain)).toBe(definition)
      expect(definition.table).not.toBe('')
      expect(definition.updatePermissions?.length ?? 0).toBeGreaterThan(0)
      expect(definition.writableColumns.length).toBeGreaterThan(0)

      if (definition.deletePermissions) {
        expect(definition.deletePermissions.length).toBeGreaterThan(0)
      }
    }
  })

  it('normalizes batch delete identifiers and rejects duplicates', () => {
    expect(parseBulkIds([' record-1 ', 'record-2'])).toEqual([
      'record-1',
      'record-2',
    ])
    expect(() => parseBulkIds(['record-1', 'record-1'])).toThrow(
      'Record ids must be non-empty and unique.',
    )
    expect(() => parseBulkIds([])).toThrow('Provide between 1 and 100 records.')
  })

  it('allows only domain-approved columns in batch updates', () => {
    expect(parseBulkUpdateItems([
      {
        id: ' asset-1 ',
        updates: {
          asset_tag: 'RADIO-001',
        },
      },
    ], ['asset_tag'])).toEqual([
      {
        id: 'asset-1',
        updates: { asset_tag: 'RADIO-001' },
      },
    ])
    expect(() => parseBulkUpdateItems([
      { id: 'asset-1', updates: { created_at: '2026-01-01' } },
    ], ['asset_tag'])).toThrow('Unsupported update fields: created_at.')
    expect(() => parseBulkUpdateItems([
      { id: 'asset-1', updates: { created_at: '2026-01-01' } },
    ], [])).toThrow('Unsupported update fields: created_at.')
  })
})

describe('personnel batch upload endpoint', () => {
  it('protects and audits the batch upload route', () => {
    expect(personnelBatchUploadSource).toContain('export default defineEventHandler')
    expect(personnelBatchUploadSource).toContain('requirePermission')
    expect(personnelBatchUploadSource).toContain('recordManagementAuditLog')
    expect(personnelBatchUploadSource).toContain('AUDIT_LOG_OUTCOMES.success')
    expect(personnelBatchUploadSource).toContain('AUDIT_LOG_OUTCOMES.failed')
  })

  it('maps spreadsheet aliases, dates, and fallback values', async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Personnel')
    worksheet.addRow(['SN', 'FNAME', 'LNAME', 'RANK_CODE', 'EMPLOYMENT_STATUS', 'SERVICE_STATUS', 'DOB'])
    worksheet.addRow([' AFP-100 ', ' Juan ', ' Dela Cruz ', 'CPT', 'ACTIVE', 'READY', new Date('1990-05-04T00:00:00Z')])
    const buffer = await workbook.xlsx.writeBuffer()

    await expect(parsePersonnelBatchUploadWorkbook(buffer)).resolves.toEqual([
      expect.objectContaining({
        personnelCode: 'AFP-100',
        serviceNumber: 'AFP-100',
        email: 'afp-100@afp.mil.ph',
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        rankId: 'CPT',
        employmentStatusId: 'ACTIVE',
        serviceStatusId: 'READY',
        birthdate: '1990-05-04',
      })
    ])
  })

  it('skips incomplete spreadsheet rows', async () => {

  })
})
