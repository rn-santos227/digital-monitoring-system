import ExcelJS from 'exceljs'
import type { PersonnelBatchUploadRowRequest } from '../requests'

type WorkbookLoadInput = Parameters<ExcelJS.Workbook['xlsx']['load']>[0]

const toUpperHeader = (value: unknown): string => {
  return String(value ?? '').trim().replace(/\s+/g, '_').toUpperCase()
}

const normalizeText = (value: unknown): string | undefined => {
  const normalized = String(value ?? '').trim()
  return normalized.length > 0 ? normalized : undefined
}

const parseExcelDate = (value: unknown): string | undefined => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30))
    excelEpoch.setUTCDate(excelEpoch.getUTCDate() + value)
    return excelEpoch.toISOString().slice(0, 10)
  }

  const raw = normalizeText(value)

  if (!raw) {
    return undefined
  }

  const parsed = new Date(raw)

  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return parsed.toISOString().slice(0, 10)
}

export const parsePersonnelBatchUploadWorkbook = async (buffer: Uint8Array | ArrayBuffer): Promise<PersonnelBatchUploadRowRequest[]> => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer as WorkbookLoadInput)

  const worksheet = workbook.worksheets[0]

  if (!worksheet) {
    return []
  }

  const headerRow = worksheet.getRow(1)
  const headerIndexes = new Map<string, number>()

  headerRow.eachCell((cell, colNumber) => {
    const header = toUpperHeader(cell.value)

    if (header) {
      headerIndexes.set(header, colNumber)
    }
  })

  const rows: PersonnelBatchUploadRowRequest[] = []

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return
    }

    const getByHeaders = (...headers: string[]) => {
      for (const header of headers) {
        const columnIndex = headerIndexes.get(header)

        if (!columnIndex) {
          continue
        }

        const rawValue = row.getCell(columnIndex).value

        if (rawValue !== null && rawValue !== undefined && String(rawValue).trim().length > 0) {
          return rawValue
        }
      }

      return undefined
    }

    const serviceNumber = normalizeText(getByHeaders('SN', 'SERVICE_NUMBER', 'AFPSN', 'SERIAL_NUMBER'))
    const firstName = normalizeText(getByHeaders('FIRST_NAME', 'FNAME'))
    const lastName = normalizeText(getByHeaders('LAST_NAME', 'LNAME'))

    if (!serviceNumber || !firstName || !lastName) {
      return
    }

    rows.push({
      personnelCode: normalizeText(getByHeaders('PERSONNEL_CODE', 'PERSONNEL_ID', 'ID')) ?? serviceNumber,
      serviceNumber,
      lastName,
      firstName,
      middleName: normalizeText(getByHeaders('MIDDLE_NAME', 'MNAME', 'MI')) ?? null,
      sex: normalizeText(getByHeaders('SEX', 'GENDER')) as ('Male' | 'Female' | undefined),
      birthdate: parseExcelDate(getByHeaders('BIRTHDATE', 'DATE_OF_BIRTH', 'DOB')) ?? null,
      rankId: normalizeText(getByHeaders('RANK_ID', 'RANK_CODE', 'RANK')),
      companyId: normalizeText(getByHeaders('COMPANY_ID', 'COMPANY_CODE', 'COMPANY')) ?? null,
      battalionId: normalizeText(getByHeaders('BATTALION_ID', 'BATTALION_CODE', 'BATTALION')) ?? null,
      employmentStatusId: normalizeText(getByHeaders('EMPLOYMENT_STATUS_ID', 'EMPLOYMENT_STATUS')),
      serviceStatusId: normalizeText(getByHeaders('SERVICE_STATUS_ID', 'SERVICE_STATUS')),
      contactNumber: normalizeText(getByHeaders('CONTACT_NUMBER', 'CONTACT_NO', 'CONTACT')) ?? null,
      position: normalizeText(getByHeaders('AFPPOS', 'POSITION')) ?? null,
      dateEnlisted: parseExcelDate(getByHeaders('DATE_ENLISTED', 'DATEENLISTED', 'ENLISTED_DATE')) ?? null,
    })
  })

  return rows
}
