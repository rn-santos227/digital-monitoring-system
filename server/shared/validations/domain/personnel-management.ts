import { createError } from 'h3'
import type { CreatePersonnelRequest, PersonnelAdvancedSearchConditionRequest, UpdatePersonnelRequest } from '../../requests'
import { isValidEmail, normalizeOptionalText } from '../../utils'

const normalizeOptionalDate = (value: unknown): string | null => {
  if (value === null) {
    return null
  }

  const normalized = normalizeOptionalText(value)

  if (!normalized) {
    return null
  }

  const date = new Date(normalized)

  if (Number.isNaN(date.getTime())) {
    throw createError({ statusCode: 400, statusMessage: `Invalid date value: ${normalized}` })
  }

  return normalized
}

const normalizeOptionalId = (value: unknown): string | null | undefined => {
  if (value === undefined) {
    return undefined
  }

  if (value === null) {
    return null
  }

  const normalized = normalizeOptionalText(value)

  if (!normalized) {
    return null
  }

  return normalized
}


export const parseCreatePersonnelPayload = (body: CreatePersonnelRequest) => {
  const personnelCode = normalizeOptionalText(body.personnelCode)
  const serviceNumber = normalizeOptionalText(body.serviceNumber)
  const email = normalizeOptionalText(body.email)
  const lastName = normalizeOptionalText(body.lastName)
  const firstName = normalizeOptionalText(body.firstName)
  const middleName = body.middleName === undefined ? null : normalizeOptionalText(body.middleName)
  const sex = body.sex
  const birthdate = normalizeOptionalDate(body.birthdate)
  const rankId = normalizeOptionalText(body.rankId)
  const companyId = normalizeOptionalId(body.companyId) ?? null
  const battalionId = normalizeOptionalId(body.battalionId) ?? null
  const employmentStatusId = normalizeOptionalText(body.employmentStatusId)
  const serviceStatusId = normalizeOptionalText(body.serviceStatusId)
  const contactNumber = body.contactNumber === undefined ? null : normalizeOptionalText(body.contactNumber)
  const position = body.position === undefined ? null : normalizeOptionalText(body.position)
  const dateEnlisted = normalizeOptionalDate(body.dateEnlisted)

  if (!personnelCode) {
    throw createError({ statusCode: 400, statusMessage: 'Personnel code is required.' })
  }

  if (!serviceNumber) {
    throw createError({ statusCode: 400, statusMessage: 'Service number is required.' })
  }

  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'Email is required.' })
  }

  if (!isValidEmail(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Email must be valid.' })
  }

  if (!lastName || !firstName) {
    throw createError({ statusCode: 400, statusMessage: 'Last name and first name are required.' })
  }

  if (sex !== 'Male' && sex !== 'Female') {
    throw createError({ statusCode: 400, statusMessage: 'Sex must be either Male or Female.' })
  }

  if (!rankId || !employmentStatusId || !serviceStatusId) {
    throw createError({ statusCode: 400, statusMessage: 'Rank, employment status, and service status are required.' })
  }

  return {
    personnel_code: personnelCode,
    service_number: serviceNumber,
      email,
    last_name: lastName,
    first_name: firstName,
    middle_name: middleName,
    sex,
    birthdate,
    rank_id: rankId,
    company_id: companyId,
    battalion_id: battalionId,
    employment_status_id: employmentStatusId,
    service_status_id: serviceStatusId,
    contact_number: contactNumber,
    position,
    date_enlisted: dateEnlisted,
  }
}

export const buildPersonnelUpdates = (body: UpdatePersonnelRequest) => {
  const updates: Record<string, unknown> = {}

  if (body.personnelCode !== undefined) {
    const personnelCode = normalizeOptionalText(body.personnelCode)

    if (!personnelCode) {
      throw createError({ statusCode: 400, statusMessage: 'Personnel code cannot be empty.' })
    }

    updates.personnel_code = personnelCode
  }

  if (body.serviceNumber !== undefined) {
    const serviceNumber = normalizeOptionalText(body.serviceNumber)

    if (!serviceNumber) {
      throw createError({ statusCode: 400, statusMessage: 'Service number cannot be empty.' })
    }

    updates.service_number = serviceNumber
  }

  if (body.email !== undefined) {
    const email = normalizeOptionalText(body.email)

    if (!email) {
      throw createError({ statusCode: 400, statusMessage: 'Email cannot be empty.' })
    }

    if (!isValidEmail(email)) {
      throw createError({ statusCode: 400, statusMessage: 'Email must be valid.' })
    }

    updates.email = email
  }

  if (body.lastName !== undefined) {
    const lastName = normalizeOptionalText(body.lastName)

    if (!lastName) {
      throw createError({ statusCode: 400, statusMessage: 'Last name cannot be empty.' })
    }

    updates.last_name = lastName
  }

  if (body.firstName !== undefined) {
    const firstName = normalizeOptionalText(body.firstName)

    if (!firstName) {
      throw createError({ statusCode: 400, statusMessage: 'First name cannot be empty.' })
    }

    updates.first_name = firstName
  }

  if (body.middleName !== undefined) {
    updates.middle_name = normalizeOptionalText(body.middleName)
  }

  if (body.sex !== undefined) {
    if (body.sex !== 'Male' && body.sex !== 'Female') {
      throw createError({ statusCode: 400, statusMessage: 'Sex must be either Male or Female.' })
    }

    updates.sex = body.sex
  }

  if (body.birthdate !== undefined) {
    updates.birthdate = normalizeOptionalDate(body.birthdate)
  }

  if (body.rankId !== undefined) {
    const rankId = normalizeOptionalText(body.rankId)

    if (!rankId) {
      throw createError({ statusCode: 400, statusMessage: 'Rank id cannot be empty.' })
    }

    updates.rank_id = rankId
  }

  if (body.companyId !== undefined) {
    updates.company_id = normalizeOptionalId(body.companyId) ?? null
  }

  if (body.battalionId !== undefined) {
    updates.battalion_id = normalizeOptionalId(body.battalionId) ?? null
  }

  if (body.employmentStatusId !== undefined) {
    const employmentStatusId = normalizeOptionalText(body.employmentStatusId)

    if (!employmentStatusId) {
      throw createError({ statusCode: 400, statusMessage: 'Employment status id cannot be empty.' })
    }

    updates.employment_status_id = employmentStatusId
  }

  if (body.serviceStatusId !== undefined) {
    const serviceStatusId = normalizeOptionalText(body.serviceStatusId)

    if (!serviceStatusId) {
      throw createError({ statusCode: 400, statusMessage: 'Service status id cannot be empty.' })
    }

    updates.service_status_id = serviceStatusId
  }

  if (body.contactNumber !== undefined) {
    updates.contact_number = normalizeOptionalText(body.contactNumber)
  }

  if (body.position !== undefined) {
    updates.position = normalizeOptionalText(body.position)
  }

  if (body.dateEnlisted !== undefined) {
    updates.date_enlisted = normalizeOptionalDate(body.dateEnlisted)
  }

  return updates
}

export const parsePersonnelAdvancedSearchConditions = (
  serializedConditions: string,
): PersonnelAdvancedSearchConditionRequest[] => {
  if (!serializedConditions) {
    return []
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(serializedConditions)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Advanced search conditions must be valid JSON.' })
  }
}
