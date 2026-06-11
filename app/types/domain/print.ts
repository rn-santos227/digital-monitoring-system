import type { DataTableColumn } from '~/constants/ui.constants'

export interface PrintTableFormat {
  documentTitle: string
  filePrefix: string
  columns: readonly DataTableColumn[]
}

