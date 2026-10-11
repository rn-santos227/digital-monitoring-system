import ExcelJS from 'exceljs'
import { describe, expect, it, vi } from 'vitest'

import { parsePersonnelBatchUploadWorkbook } from '@/server/shared/utils/personnel-batch-upload'
import {
  mapParsedBatchRowToCreatePayload,
  parsePersonnelBatchExcelFile,
} from '@/app/utils/personnel-batch-upload'

const createWorkbook = async (
  headers: string[],
  rows: ExcelJS.CellValue[][],
) => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Personnel')
  sheet.addRow(headers)
  rows.forEach((row) => sheet.addRow(row))
  const bytes = await workbook.xlsx.writeBuffer()
  const data = new Uint8Array(bytes).slice().buffer
  return { data, file: new File([data], 'personnel.xlsx') }
}

describe('personnel workbook parsing with real XLSX buffers', () => {
  it('accepts header aliases, trims values, parses date cells, and skips incomplete rows', async () => {
    const { data, file } = await createWorkbook(
      [
        ' service number ',
        ' first name ',
        'last name',
        'gender',
        'rank',
        'date of birth',
        'enlisted date',
        'email',
        'company code',
        'battalion',
        'position',
      ],
      [
        [
          ' AFP001 ',
          ' Ada ',
          ' Santos ',
          'Female',
          'SGT',
          new Date('2000-01-02T00:00:00Z'),
          43831,
          ' ada@example.test ',
          'C1',
          'B1',
          ' Medic ',
        ],
        ['', 'Incomplete', 'Record', 'Male', 'SGT'],
        ['AFP002', 'Ben', 'Reyes', 'm', 'CPL', 'invalid', null],
        ['AFP003', 'Missing', 'Rank', 'unknown', null],
      ],
    )
    const serverRows = await parsePersonnelBatchUploadWorkbook(data)
    expect(serverRows).toHaveLength(3)
    expect(serverRows[0]).toMatchObject({
      serviceNumber: 'AFP001',
      firstName: 'Ada',
      lastName: 'Santos',
      sex: 'Female',
      birthdate: '2000-01-02',
      dateEnlisted: '2020-01-01',
      email: 'ada@example.test',
      companyId: 'C1',
      battalionId: 'B1',
      position: 'Medic',
    })
    expect(serverRows[1]).toMatchObject({
      email: 'afp002@afp.mil.ph',
      birthdate: null,
      dateEnlisted: null,
    })
    const frontendRows = await parsePersonnelBatchExcelFile(file)
    expect(frontendRows).toHaveLength(2)
    expect(frontendRows[0]).toMatchObject({
      serviceNumber: 'AFP001',
      sex: 'Female',
      birthdate: '2000-01-02',
      dateEnlisted: '2020-01-01',
    })
    expect(frontendRows[1]).toMatchObject({
      serviceNumber: 'AFP002',
      email: 'afp002@gmail.com',
      sex: 'Male',
      birthdate: null,
    })
  })

  it.each(['M', 'male', 'F', 'female'])(
    'normalizes supported frontend sex values %s',
    async (sex) => {
      const { file } = await createWorkbook(
        ['SN', 'FNAME', 'LNAME', 'SEX', 'RANK', 'DOB'],
        [['AFP1', 'Unit', 'User', sex, 'SGT', '2001-02-03']],
      )
      const rows = await parsePersonnelBatchExcelFile(file)
      expect(rows[0]?.sex).toBe(
        sex.toLowerCase().startsWith('m') ? 'Male' : 'Female',
      )
      expect(rows[0]?.birthdate).toBe('2001-02-03')
    },
  )

  it('maps supplied statuses and uses today only when the enlistment date is absent', async () => {
    vi.useFakeTimers({ toFake: ['Date'] }).setSystemTime(
      new Date('2026-10-04T12:00:00Z'),
    )
    try {
      const { file } = await createWorkbook(
        ['SN', 'FNAME', 'LNAME', 'SEX', 'RANK'],
        [['AFP1', 'Unit', 'User', 'M', 'SGT']],
      )
      const [row] = await parsePersonnelBatchExcelFile(file)
      if (!row) throw new Error('Expected a parsed personnel row')
      expect(
        mapParsedBatchRowToCreatePayload(row, 'employed', 'active'),
      ).toMatchObject({
        personnelCode: 'AFP1',
        employmentStatusId: 'employed',
        serviceStatusId: 'active',
        dateEnlisted: '2026-10-04',
      })
      expect(
        mapParsedBatchRowToCreatePayload(
          { ...row, dateEnlisted: '2020-01-01' },
          'employed',
          'active',
        ).dateEnlisted,
      ).toBe('2020-01-01')
    } finally {
      vi.useRealTimers()
    }
  })

  it('returns no rows for workbooks without sheets', async () => {
    const bytes = await new ExcelJS.Workbook().xlsx.writeBuffer()
    const data = new Uint8Array(bytes).slice().buffer
    expect(await parsePersonnelBatchUploadWorkbook(data)).toEqual([])
    expect(
      await parsePersonnelBatchExcelFile(new File([data], 'empty.xlsx')),
    ).toEqual([])
  })

  it('rejects corrupt uploads instead of silently accepting them', async () => {
    const data = new Uint8Array([1, 2, 3]).buffer
    await expect(parsePersonnelBatchUploadWorkbook(data)).rejects.toThrow()
    await expect(
      parsePersonnelBatchExcelFile(new File([data], 'corrupt.xlsx')),
    ).rejects.toThrow()
  })
})
