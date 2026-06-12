import {
  PRINT_CSV_MIME_TYPE,
  PRINT_DATE_TIME_OPTIONS,
  PRINT_DOCUMENT_STYLES,
  PRINT_GENERATED_AT_LABEL,
  PRINT_NOT_AVAILABLE_LABEL,
  PRINT_TOTAL_RECORDS_LABEL,
  PRINT_WINDOW_FEATURES,
} from '~/constants/print-formats.constants'
import type { DataTableColumn } from '~/constants/ui.constants'
import type { PrintDetailFormat, PrintTableFormat } from '~/types/domain/print'

const escapeHtml = (value: string): string => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

const getRecordValue = (item: object, key: string): unknown => Reflect.get(item, key)

const formatPrintValue = (value: unknown, column?: Pick<DataTableColumn, 'dataType'>): string => {
  if (value === null || value === undefined || value === '') {
    return PRINT_NOT_AVAILABLE_LABEL
  }

  if (column?.dataType === 'date') {
    const parsedDate = new Date(String(value))
    return Number.isNaN(parsedDate.getTime())
      ? String(value)
      : parsedDate.toLocaleDateString()
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (Array.isArray(value)) {
    return value.map((entry) => formatPrintValue(entry)).join(', ')
  }

  return String(value)
}

const openPrintDocument = (html: string): void => {
  const printWindow = window.open('', '_blank', PRINT_WINDOW_FEATURES)

  if (!printWindow) {
    throw new Error('Unable to open print preview window.')
  }

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
}

const downloadCsvFile = (rows: readonly string[][], filePrefix: string): void => {
  const csvContent = rows
    .map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csvContent], { type: PRINT_CSV_MIME_TYPE })
  const fileUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = fileUrl
  link.download = `${filePrefix}-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(fileUrl)
}

export const printTableRecords = <TItem extends object>(
  items: readonly TItem[],
  format: PrintTableFormat,
): readonly TItem[] => {
  const generatedAt = new Date().toLocaleString(undefined, PRINT_DATE_TIME_OPTIONS)
  const headerCells = ['#', ...format.columns.map((column) => column.label)]
  const formattedRows = items.map((item, index) => [
    String(index + 1),
    ...format.columns.map((column) => formatPrintValue(getRecordValue(item, column.key), column)),
  ])
  const tableRows = formattedRows.map((row) => `
    <tr>
      ${row.map((value) => `<td>${escapeHtml(value)}</td>`).join('')}
    </tr>
  `).join('')
  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(format.documentTitle)}</title>
        <style>${PRINT_DOCUMENT_STYLES}</style>
      </head>
      <body>
        <h1>${escapeHtml(format.documentTitle)}</h1>
        <p>${escapeHtml(PRINT_GENERATED_AT_LABEL)} ${escapeHtml(generatedAt)} | ${escapeHtml(PRINT_TOTAL_RECORDS_LABEL)} ${items.length}</p>
        <table>
          <thead>
            <tr>${headerCells.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `

  downloadCsvFile([
    format.columns.map((column) => column.label),
    ...items.map((item) => format.columns.map((column) => formatPrintValue(getRecordValue(item, column.key), column))),
  ], format.filePrefix)
  openPrintDocument(html)
  return items
}

export const printDetailRecord = <TItem extends object>(
  item: TItem,
  format: PrintDetailFormat,
): TItem => {
  const generatedAt = new Date().toLocaleString(undefined, PRINT_DATE_TIME_OPTIONS)
  const sections = format.sections.map((section) => `
    <section>
      <h2>${escapeHtml(section.title)}</h2>
      <dl>
        ${section.fields.map((field) => `
          <div>
            <dt>${escapeHtml(field.label)}</dt>
            <dd>${escapeHtml(formatPrintValue(getRecordValue(item, field.key), field))}</dd>
          </div>
        `).join('')}
      </dl>
    </section>
  `).join('')
  downloadCsvFile([['Field', 'Value'], ...csvRows], format.filePrefix)
  openPrintDocument(html)
  return item

}
