import { createError } from 'h3'
import type {
  CreateBattalionRequest,
  CreateCompanyRequest,
  UpdateBattalionRequest,
  UpdateCompanyRequest,
} from '../../requests'
import { normalizeOptionalText } from '../../utils'

export const parseCreateBattalionPayload = (body: CreateBattalionRequest) => {
  const code = normalizeOptionalText(body.code)?.toUpperCase()
  const name = normalizeOptionalText(body.name)

  if (!code) {
    throw createError({ statusCode: 400, statusMessage: 'Battalion code is required.' })
  }

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Battalion name is required.' })
  }

  return {
    code,
    name,
    is_active: body.isActive ?? true,
  }
}

