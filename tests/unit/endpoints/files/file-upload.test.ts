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

  it('accepts any MIME type when no MIME prefixes are configured', () => {
    const filePart = {
      data: encodeText('data'),
      filename: 'attachment.bin',
    }

    expect(() => validateUploadFilePart(filePart, {
      maxSizeBytes: 1024,
      allowedMimePrefixes: [],
    })).not.toThrow()
  })

  it('rejects a missing file payload', () => {
    expect(() => validateUploadFilePart(undefined, {
      maxSizeBytes: 1024,
    })).toThrow('File payload is required.')

    expect(() => validateUploadFilePart({
      data: encodeText('data'),
    }, {
      maxSizeBytes: 1024,
    })).toThrow('File payload is required.')
  })

  it('rejects a file larger than the maximum upload size', () => {
    expect(() => validateUploadFilePart({
      data: new Uint8Array(5),
      filename: 'oversized.pdf',
      type: 'application/pdf',
    }, {
      maxSizeBytes: 4,
    })).toThrow('File size exceeds the maximum allowed upload size.')
  })

  it('requires a MIME type when an allowlist is configured', () => {
    expect(() => validateUploadFilePart({
      data: encodeText('data'),
      filename: 'unknown-file',
    }, {
      maxSizeBytes: 1024,
      allowedMimePrefixes: ['image/'],
    })).toThrow('File type is required for this upload.')
  })

  it('rejects MIME types outside the configured allowlist', () => {
    expect(() => validateUploadFilePart({
      data: encodeText('executable'),
      filename: 'unsafe.exe',
      type: 'application/x-msdownload',
    }, {
      maxSizeBytes: 1024,
      allowedMimePrefixes: ['image/', 'application/pdf'],
    })).toThrow('File type is not allowed for this upload.')
  })

  it('parses and normalizes allowed MIME prefixes from multipart fields', () => {
    const parts = [
      {
        name: 'allowedMimePrefixes',
        data: encodeText(' Image/, application/PDF, , text/plain '),
      },
    ]

    expect(parseMultipartTextField(parts, 'allowedMimePrefixes')).toBe(
      'Image/, application/PDF, , text/plain',
    )

    expect(parseAllowedMimePrefixes(parts)).toEqual([
      'image/',
      'application/pdf',
      'text/plain',
    ])
  })

  it('normalizes unsafe upload file names', () => {
    expect(normalizeFileName(' Personnel Report (Final).PDF ')).toBe(
      'personnel-report-final.pdf',
    )
    expect(normalizeFileName('***')).toBe('attachment')
  })

  it('accepts HTTP attachment URLs and rejects unsafe protocols', () => {
    expect(parseExternalAttachmentUrl('https://files.example.mil/report.pdf').href).toBe(
      'https://files.example.mil/report.pdf',
    )

  })
})
