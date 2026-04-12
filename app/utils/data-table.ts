import type { DataTableColumn } from '~/constants/ui.constants'

export const resolveDataTableRowKey = <TRow extends Record<string, string | number | boolean | null | undefined>>(
  row: TRow,
  rowKey: keyof TRow,
): string => {
  const keyValue = row[rowKey]
  return keyValue === undefined || keyValue === null ? JSON.stringify(row) : String(keyValue)
}

export const resolveDataTableAlignClass = (align: DataTableColumn['align']): string => {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return 'text-left'
}

export const resolvePaginationPages = (currentPage: number, totalPages: number, maxVisiblePages: number): number[] => {
  if (totalPages <= 0) return []

  const normalizedMaxVisible = Math.max(1, maxVisiblePages)
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const halfWindow = Math.floor(normalizedMaxVisible / 2)

  let startPage = Math.max(1, safeCurrentPage - halfWindow)
  const endPage = Math.min(totalPages, startPage + normalizedMaxVisible - 1)
  startPage = Math.max(1, endPage - normalizedMaxVisible + 1)

  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)
}
