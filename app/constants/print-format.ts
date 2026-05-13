export const PRINT_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = Object.freeze({
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

export const PRINT_WINDOW_FEATURES = 'noopener,noreferrer'
export const PRINT_CSV_MIME_TYPE = 'text/csv;charset=utf-8;'

export const PERSONNEL_PRINT_DOCUMENT_STYLES = [
  'body { font-family: Arial, sans-serif; padding: 20px; color: #0f172a; }',
  'h1 { margin: 0 0 8px; font-size: 20px; }',
  'p { margin: 0 0 16px; font-size: 12px; color: #475569; }',
  'table { width: 100%; border-collapse: collapse; font-size: 12px; }',
  'th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; vertical-align: top; }',
  'th { background: #f1f5f9; }',
].join(' ')

export const PERSONNEL_PRINT_GENERATED_AT_LABEL = 'Generated at:'
export const PERSONNEL_PRINT_TOTAL_RECORDS_LABEL = 'Total records:'
