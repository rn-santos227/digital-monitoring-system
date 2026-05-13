import { createError } from 'h3'
import type {
  CreateBattalionRequest,
  CreateCompanyRequest,
  UpdateBattalionRequest,
  UpdateCompanyRequest,
} from '../../requests'
import type { AssignUnitPersonnelRequest } from '../../requests'
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

export const parseCreateCompanyPayload = (body: CreateCompanyRequest) => {
  const battalionId = body.battalionId === undefined ? null : normalizeOptionalText(body.battalionId)
  const code = normalizeOptionalText(body.code)?.toUpperCase()
  const name = normalizeOptionalText(body.name)

  if (!code) {
    throw createError({ statusCode: 400, statusMessage: 'Company code is required.' })
  }

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Company name is required.' })
  }

  return {
    battalion_id: battalionId,
    code,
    name,
    is_active: body.isActive ?? true,
  }
}


export const buildCompanyUpdates = (body: UpdateCompanyRequest) => {
  const updates: {
    battalion_id?: string | null
    code?: string
    name?: string
    is_active?: boolean
  } = {}

  if (body.battalionId !== undefined) {
    updates.battalion_id = normalizeOptionalText(body.battalionId)
  }

  if (body.code !== undefined) {
    const code = normalizeOptionalText(body.code)?.toUpperCase()

    if (!code) {
      throw createError({ statusCode: 400, statusMessage: 'Company code cannot be empty.' })
    }

    updates.code = code
  }

  if (body.name !== undefined) {
    const name = normalizeOptionalText(body.name)

    if (!name) {
      throw createError({ statusCode: 400, statusMessage: 'Company name cannot be empty.' })
    }

    updates.name = name
  }

  if (body.isActive !== undefined) {
    updates.is_active = Boolean(body.isActive)
  }

  return updates
}

export const parseAssignUnitPersonnelPayload = (body: AssignUnitPersonnelRequest) => {
  const personnelId = normalizeOptionalText(body.personnelId)

  if (!personnelId) {
    throw createError({ statusCode: 400, statusMessage: 'Personnel id is required.' })
  }

  return { personnelId }
}
