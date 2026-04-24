import type { CreatePersonnelPayload } from '~/types/domain/personnel'
import { validateFields } from '~/utils/field-validation'
import { EMPLOYMENT_STATUS_VALUES, SERVICE_STATUS_VALUES, SEX_VALUES } from '~/types/enums'
import { REGEX_PATTERNS } from '~/utils/regex'

interface CreatePersonnelForm {
  personnelCode: string
  serviceNumber: string
  lastName: string
  firstName: string
  middleName: string
  sex: string
  birthdate: string
  rankId: string
  companyId: string
  battalionId: string
  employmentStatusId: string
  serviceStatusId: string
  contactNumber: string
  dateEnlisted: string
}

export const validateCreatePersonnelForm = (form: CreatePersonnelForm) => {
  const validation = validateFields([
    { field: 'personnelCode', label: 'Personnel code', value: form.personnelCode, required: true, maxLength: 32 },
    { field: 'serviceNumber', label: 'Service number', value: form.serviceNumber, required: true, maxLength: 32 },
    { field: 'lastName', label: 'Last name', value: form.lastName, required: true, maxLength: 80 },
    { field: 'firstName', label: 'First name', value: form.firstName, required: true, maxLength: 80 },
    { field: 'middleName', label: 'Middle name', value: form.middleName, maxLength: 80 },
    { field: 'rankId', label: 'Rank', value: form.rankId, required: true, maxLength: 64 },
    { field: 'companyId', label: 'Company ID', value: form.companyId, maxLength: 64 },
    { field: 'battalionId', label: 'Battalion ID', value: form.battalionId, maxLength: 64 },
    { field: 'employmentStatusId', label: 'Employment status', value: form.employmentStatusId, required: true, maxLength: 64 },
    { field: 'serviceStatusId', label: 'Service status', value: form.serviceStatusId, required: true, maxLength: 64 },
    {
      field: 'contactNumber',
      label: 'Contact number',
      value: form.contactNumber,
      maxLength: 32,
      pattern: REGEX_PATTERNS.numberOny,
      patternMessage: 'Contact number allows numbers, spaces, parentheses, plus signs, and hyphens only.',
    },
    {
      field: 'birthdate',
      label: 'Birthdate',
      value: form.birthdate,
      pattern: REGEX_PATTERNS.isoDate,
      patternMessage: 'Birthdate must use YYYY-MM-DD format.',
    },
    {
      field: 'dateEnlisted',
      label: 'Date enlisted',
      value: form.dateEnlisted,
      pattern: REGEX_PATTERNS.isoDate,
      patternMessage: 'Date enlisted must use YYYY-MM-DD format.',
    },
  ])

  const normalizedSex = form.sex.trim()

  const errors: Record<string, string> = {
    ...validation.errors,
    ...(normalizedSex ? {} : { sex: 'Sex is required.' }),
  }

  const hasUnitAssignment = Boolean(validation.values.companyId || validation.values.battalionId)
  if (!hasUnitAssignment) {
    errors.companyId = 'Provide at least one unit assignment (company or battalion).'
    errors.battalionId = 'Provide at least one unit assignment (company or battalion).'
  }

  const isValidSex = SEX_VALUES.includes(normalizedSex as (typeof SEX_VALUES)[number])
  if (!isValidSex) {
    errors.sex = 'Sex must be either Male or Female.'
  }

  if (!EMPLOYMENT_STATUS_VALUES.includes((validation.values.employmentStatusId ?? '') as (typeof EMPLOYMENT_STATUS_VALUES)[number])) {
    errors.employmentStatusId = 'Employment status must match the approved values.'
  }

  if (!SERVICE_STATUS_VALUES.includes((validation.values.serviceStatusId ?? '') as (typeof SERVICE_STATUS_VALUES)[number])) {
    errors.serviceStatusId = 'Service status must match the approved values.'
  }

  const payload: CreatePersonnelPayload | null = Object.keys(errors).length > 0
    ? null
    : {
        personnelCode: validation.values.personnelCode!,
        serviceNumber: validation.values.serviceNumber!,
        lastName: validation.values.lastName!,
        firstName: validation.values.firstName!,
        middleName: validation.values.middleName || null,
        sex: normalizedSex as (typeof SEX_VALUES)[number],
        birthdate: validation.values.birthdate || null,
        rankId: validation.values.rankId!,
        companyId: validation.values.companyId || null,
        battalionId: validation.values.battalionId || null,
        employmentStatusId: validation.values.employmentStatusId!,
        serviceStatusId: validation.values.serviceStatusId!,
        contactNumber: validation.values.contactNumber || null,
        dateEnlisted: validation.values.dateEnlisted || null,
      }

  return {
    errors,
    payload,
  }
}
