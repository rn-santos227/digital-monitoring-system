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

}
