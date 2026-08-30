import { describe, expect, it } from 'vitest'

import fileUploadSource from '../../../../server/api/files/upload.post'
import {
  normalizeFileName,
  parseAllowedMimePrefixes,
  parseExternalAttachmentUrl,
  parseMultipartTextField,
  validateUploadFilePart,
} from '../../../../server/shared/validations/domain/file-management'

