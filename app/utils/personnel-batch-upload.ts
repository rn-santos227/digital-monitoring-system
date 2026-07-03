import * as ExcelJS from 'exceljs'
import type { CreatePersonnelPayload } from '~/types/domain/personnel'

interface ParsedPersonnelBatchRow {
  personnelCode: string
  serviceNumber: string
  email: string
  lastName: string
  firstName: string
  middleName: string | null
  sex: 'Male' | 'Female'
  birthdate: string | null
  rankId: string
  companyId: string | null
  battalionId: string | null
  contactNumber: string | null
  position: string | null
  dateEnlisted: string | null
}

const toHeaderKey = (value: unknown): string => {
  return String(value ?? '').trim().replace(/\s+/g, '_').toUpperCase()
}

const normalizeText = (value: unknown): string | null => {
  const normalized = String(value ?? '').trim()
  return normalized.length > 0 ? normalized : null
}

const normalizeSex = (value: unknown): 'Male' | 'Female' | null => {
  const normalized = normalizeText(value)?.toLowerCase()

  if (!normalized) {
    return null
  }

  if (normalized === 'm' || normalized === 'male') {
    return 'Male'
  }

  if (normalized === 'f' || normalized === 'female') {
    return 'Female'
  }

  return null
}

const parseDateValue = (value: unknown): string | null => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30))
    excelEpoch.setUTCDate(excelEpoch.getUTCDate() + value)
    return excelEpoch.toISOString().slice(0, 10)
  }

  const text = normalizeText(value)

  if (!text) {
    return null
  }

  const parsed = new Date(text)

  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed.toISOString().slice(0, 10)
}

export const parsePersonnelBatchExcelFile = async (file: File): Promise<ParsedPersonnelBatchRow[]> => {
  const workbook = new ExcelJS.Workbook()
  const data = await file.arrayBuffer()
  await workbook.xlsx.load(data)

  const worksheet = workbook.worksheets[0]

  if (!worksheet) {
    return []
  }

  const headerMap = new Map<string, number>()
  worksheet.getRow(1).eachCell((cell, index) => {
    const key = toHeaderKey(cell.value)

    if (key) {
      headerMap.set(key, index)
    }
  })

  const getCellValueByHeaders = (row: { getCell: (index: number) => { value: unknown } }, ...headers: string[]): unknown => {
    for (const header of headers) {
      const columnIndex = headerMap.get(header)

      if (!columnIndex) {
        continue
      }

      const value = row.getCell(columnIndex).value

      if (value !== null && value !== undefined && String(value).trim().length > 0) {
        return value
      }
    }

    return null
  }

  const rows: ParsedPersonnelBatchRow[] = []

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return
    }

    const serviceNumber = normalizeText(getCellValueByHeaders(row, 'SN', 'SERVICE_NUMBER', 'SERIAL_NUMBER', "AFPSN"))
    const firstName = normalizeText(getCellValueByHeaders(row, 'FIRST_NAME', 'FNAME'))
    const lastName = normalizeText(getCellValueByHeaders(row, 'LAST_NAME', 'LNAME'))
    const sex = normalizeSex(getCellValueByHeaders(row, 'SEX', 'GENDER'))
    const rankId = normalizeText(getCellValueByHeaders(row, 'RANK_ID', 'RANK_CODE', 'RANK'))

    if (!serviceNumber || !firstName || !lastName || !sex || !rankId) {
      return
    }

    const email = normalizeText(getCellValueByHeaders(row, 'EMAIL', 'PERSONNEL_EMAIL')) ?? `${serviceNumber.toLowerCase()}@gmail.com`

    rows.push({
      personnelCode: normalizeText(getCellValueByHeaders(row, 'PERSONNEL_CODE', 'PERSONNEL_ID', 'ID')) ?? serviceNumber,
      serviceNumber,
      email,
      firstName,
      lastName,
      middleName: normalizeText(getCellValueByHeaders(row, 'MIDDLE_NAME', 'MNAME')),
      sex,
      birthdate: parseDateValue(getCellValueByHeaders(row, 'BIRTHDATE', 'DOB', 'DATE_OF_BIRTH')),
      rankId,
      companyId: normalizeText(getCellValueByHeaders(row, 'COMPANY_ID', 'COMPANY_CODE', 'COMPANY')),
      battalionId: normalizeText(getCellValueByHeaders(row, 'BATTALION_ID', 'BATTALION_CODE', 'BATTALION')),
      contactNumber: normalizeText(getCellValueByHeaders(row, 'CONTACT_NUMBER', 'CONTACT_NO', 'CONTACT')),
      position: normalizeText(getCellValueByHeaders(row, 'AFPPOS', 'POSITION')),
      dateEnlisted: parseDateValue(getCellValueByHeaders(row, 'DATE_ENLISTED', 'DATEENLISTED', 'ENLISTED_DATE')),
    })
  })

  return rows
}

export const mapParsedBatchRowToCreatePayload = (
  row: ParsedPersonnelBatchRow,
  employmentStatusId: string,
  serviceStatusId: string,
): CreatePersonnelPayload => {
  return {
    personnelCode: row.personnelCode,
    serviceNumber: row.serviceNumber,
    email: row.email,
    lastName: row.lastName,
    firstName: row.firstName,
    middleName: row.middleName,
    sex: row.sex,
    birthdate: row.birthdate,
    rankId: row.rankId,
    companyId: row.companyId,
    battalionId: row.battalionId,
    employmentStatusId,
    serviceStatusId,
    contactNumber: row.contactNumber,
    position: row.position,
    dateEnlisted: row.dateEnlisted ?? new Date().toISOString().slice(0, 10),
  }
}
