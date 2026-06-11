import type { DataTableColumn } from '~/constants/ui.constants'

export interface PrintTableFormat {
  documentTitle: string
  filePrefix: string
  columns: readonly DataTableColumn[]
}

export interface PrintDetailField {
  key: string
  label: string
  dataType?: 'text' | 'date'
}

export interface PrintDetailSection {
  title: string
  fields: readonly PrintDetailField[]
}


