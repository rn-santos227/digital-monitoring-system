import { describe, expect, it } from 'vitest'

import fileUploadSource from '../../../../server/api/files/upload.post'
import {
  normalizeFileName,
  parseExternalAttachmentUrl,
  validateUploadFilePart,
} from '../../../../server/shared/validations/domain/file-management'

const encodeText = (value: string): Uint8Array => new TextEncoder().encode(value)
const validJpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0xff, 0xd9])
const validPng = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

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
      data: validJpeg,
      filename: 'personnel-photo.jpg',
      type: 'image/jpeg',
    }

    expect(() => validateUploadFilePart(filePart, {
      maxSizeBytes: 1024,
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

  it('requires an approved MIME type and matching safe extension', () => {
    expect(() => validateUploadFilePart({
      data: validPng,
      filename: 'unknown-file.png',
    }, {
      maxSizeBytes: 1024,
    })).toThrow('Only JPEG, PNG, and WebP images')

    expect(() => validateUploadFilePart({
      data: validPng,
      filename: 'image.js',
      type: 'image/png',
    }, {
      maxSizeBytes: 1024,
    })).toThrow('Only JPEG, PNG, and WebP images')
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
    expect(() => parseExternalAttachmentUrl('file:///etc/passwd')).toThrow(
      'External URL protocol is not allowed.',
    )
    expect(() => parseExternalAttachmentUrl('not a URL')).toThrow(
      'External URL is invalid.',
    )
  })
})
