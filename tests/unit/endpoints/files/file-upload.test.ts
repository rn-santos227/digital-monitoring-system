import { describe, expect, it } from 'vitest'

import fileUploadSource from '../../../../server/api/files/upload.post'
import {
  normalizeFileName,
  parseAllowedMimePrefixes,
  parseExternalAttachmentUrl,
  parseMultipartTextField,
  validateUploadFilePart,
} from '../../../../server/shared/validations/domain/file-management'

const encodeText = (value: string): Uint8Array => new TextEncoder().encode(value)

describe('file upload endpoint', () => {
  it('requires RBAC and audits successful and failed uploads', () => {
    expect(fileUploadSource).toContain('export default defineEventHandler')
    expect(fileUploadSource).toContain('requireAnyPermission')
    expect(fileUploadSource).toContain('PERSONNEL_PERMISSION_GROUPS.personnelManagement')
    expect(fileUploadSource).toContain('validateUploadFilePart')
    expect(fileUploadSource).toContain('recordManagementAuditLog')
    expect(fileUploadSource).toContain('AUDIT_LOG_OUTCOMES.success')
    expect(fileUploadSource).toContain('AUDIT_LOG_OUTCOMES.failed')
  })

  it('accepts a file within the configured size and MIME constraints', () => {
    const filePart = {
      name: 'file',
      data: encodeText('report contents'),
      filename: 'readiness-report.pdf',
      type: 'application/pdf',
    }

    expect(() => validateUploadFilePart(filePart, {
      maxSizeBytes: 1024,
      allowedMimePrefixes: ['application/pdf'],
    })).not.toThrow()
  })
})
