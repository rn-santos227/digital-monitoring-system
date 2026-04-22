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


export const buildBattalionUpdates = (body: UpdateBattalionRequest) => {
  const updates: {
    code?: string
    name?: string
    is_active?: boolean
  } = {}

  if (body.code !== undefined) {
    const code = normalizeOptionalText(body.code)?.toUpperCase()

    if (!code) {
      throw createError({ statusCode: 400, statusMessage: 'Battalion code cannot be empty.' })
    }

    updates.code = code
  }

  if (body.name !== undefined) {
    const name = normalizeOptionalText(body.name)

    if (!name) {
      throw createError({ statusCode: 400, statusMessage: 'Battalion name cannot be empty.' })
    }

    updates.name = name
  }

  if (body.isActive !== undefined) {
    updates.is_active = Boolean(body.isActive)
  }

  return updates
}

