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

  })
})
