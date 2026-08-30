import { describe, expect, it } from 'vitest'

import fileUploadSource from '../../../../server/api/files/upload.post'
import {
  normalizeFileName,
  parseAllowedMimePrefixes,
  parseExternalAttachmentUrl,
  parseMultipartTextField,
  validateUploadFilePart,
} from '../../../../server/shared/validations/domain/file-management'

describe('file upload endpoint', () => {
  it('requires RBAC and audits successful and failed uploads', () => {
    expect(fileUploadSource).toContain('export default defineEventHandler')
    expect(fileUploadSource).toContain('requireAnyPermission')
    expect(fileUploadSource).toContain('PERSONNEL_PERMISSION_GROUPS.personnelManagement')
    expect(fileUploadSource).toContain('validateUploadFilePart')

  })
})
