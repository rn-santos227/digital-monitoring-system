import { createError } from 'h3'
import type { CreateRankRequest } from '../../requests'
import { normalizeOptionalText, parseNumber } from '../../utils'

export const parseCreateRankPayload = (body: CreateRankRequest) => {
  const code = normalizeOptionalText(body.code)?.toUpperCase()
  const name = normalizeOptionalText(body.name)

  if (!code) {
    throw createError({ statusCode: 400, statusMessage: 'Rank code is required.' })
  }

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Rank name is required.' })
  }

  const parsedSortOrder = Math.trunc(parseNumber(body.sortOrder, 0))

  return {
    code,
    name,
    sort_order: Number.isFinite(parsedSortOrder) ? parsedSortOrder : 0,
  }
}
