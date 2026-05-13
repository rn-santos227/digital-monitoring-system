import {
  PERSONNEL_PRINT_CSV_HEADERS,
  PERSONNEL_PRINT_DOCUMENT_TITLE,
  PERSONNEL_PRINT_FILE_PREFIX,
  PERSONNEL_PRINT_TABLE_HEADERS,
  PERSONNEL_PRINT_UNASSIGNED_LABEL,
  PRINT_FETCH_PAGE_SIZE,
} from '~/constants/print-patterns.constants'
import {
  PERSONNEL_PRINT_DOCUMENT_STYLES,
  PERSONNEL_PRINT_GENERATED_AT_LABEL,
  PERSONNEL_PRINT_TOTAL_RECORDS_LABEL,
  PRINT_CSV_MIME_TYPE,
  PRINT_DATE_TIME_OPTIONS,
  PRINT_WINDOW_FEATURES,
} from '~/constants/print-formats.constants'
import type { PersonnelListCompactItem, PersonnelSearchQuery } from '~/types/domain/personnel'
import { getPersonnelEndpoint, searchPersonnelEndpoint } from '~/utils/personnel-endpoints'

const escapeHtml = (value: string): string => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

const buildPrintablePersonnelHtml = (items: PersonnelListCompactItem[]): string => {
  const generatedAt = new Date().toLocaleString(undefined, PRINT_DATE_TIME_OPTIONS)
  const rows = items.map((item, index) => {
    const assignment = [item.companyName, item.battalionName].filter(Boolean).join(' / ') || PERSONNEL_PRINT_UNASSIGNED_LABEL
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(item.personnelCode)}</td>
        <td>${escapeHtml(item.serviceNumber)}</td>
        <td>${escapeHtml(item.fullName)}</td>
        <td>${escapeHtml(item.rankName)}</td>
        <td>${escapeHtml(assignment)}</td>
        <td>${escapeHtml(item.serviceStatus)}</td>
      </tr>
    `
  }).join('')

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(PERSONNEL_PRINT_DOCUMENT_TITLE)}</title>
        <style>${PERSONNEL_PRINT_DOCUMENT_STYLES}</style>
      </head>
      <body>
        <h1>${escapeHtml(PERSONNEL_PRINT_DOCUMENT_TITLE)}</h1>
        <p>${escapeHtml(PERSONNEL_PRINT_GENERATED_AT_LABEL)} ${escapeHtml(generatedAt)} | ${escapeHtml(PERSONNEL_PRINT_TOTAL_RECORDS_LABEL)} ${items.length}</p>
        <table>
          <thead>
            <tr>
              ${PERSONNEL_PRINT_TABLE_HEADERS.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `
}

const downloadPersonnelCsvFile = (items: PersonnelListCompactItem[]): void => {
  const csvRows = items.map((item) => {
    const row = [
      item.personnelCode,
      item.serviceNumber,
      item.fullName,
      item.rankName,
      item.companyName ?? PERSONNEL_PRINT_UNASSIGNED_LABEL,
      item.battalionName ?? PERSONNEL_PRINT_UNASSIGNED_LABEL,
      item.serviceStatus,
    ]

    return row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')
  })

  const csvContent = [PERSONNEL_PRINT_CSV_HEADERS.join(','), ...csvRows].join('\n')
  const blob = new Blob([csvContent], { type: PRINT_CSV_MIME_TYPE })
  const fileUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = fileUrl
  link.download = `${PERSONNEL_PRINT_FILE_PREFIX}-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(fileUrl)
}

const printPersonnelRecords = (items: PersonnelListCompactItem[]): void => {
  const printWindow = window.open('', '_blank', PRINT_WINDOW_FEATURES)

  if (!printWindow) {
    throw new Error('Unable to open print preview window.')
  }

  printWindow.document.open()
  printWindow.document.write(buildPrintablePersonnelHtml(items))
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
}

export const usePrintPersonnelHandler = () => {
  const fetchAllPersonnelForPrint = async (filters: Partial<PersonnelSearchQuery>): Promise<PersonnelListCompactItem[]> => {
    const fetchedItems: PersonnelListCompactItem[] = []
    let currentPage = 1
    let totalPages = 1

    while (currentPage <= totalPages) {
      const requestQuery: PersonnelSearchQuery = {
        page: currentPage,
        pageSize: PRINT_FETCH_PAGE_SIZE,
        term: filters.term?.trim() || undefined,
        fields: filters.fields?.trim() || undefined,
      }

      const response = requestQuery.term
        ? await searchPersonnelEndpoint(requestQuery)
        : await getPersonnelEndpoint(requestQuery)

      fetchedItems.push(...response.items)
      totalPages = response.totalPages
      currentPage += 1
    }

    return fetchedItems
  }

  const handleDownloadAndPrintPersonnel = async (filters: Partial<PersonnelSearchQuery>): Promise<PersonnelListCompactItem[]> => {
    const allItems = await fetchAllPersonnelForPrint(filters)
    downloadPersonnelCsvFile(allItems)
    printPersonnelRecords(allItems)
    return allItems
  }

  return {
    handleDownloadAndPrintPersonnel,
  }
}
