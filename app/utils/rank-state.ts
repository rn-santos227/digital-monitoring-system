import type { RankListItem, RankTablePagination } from '~/types/domain/rank'

export const doesRankMatchSearch = (rank: Pick<RankListItem, 'code' | 'name'>, searchTerm: string) => {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  if (!normalizedSearchTerm) {
    return true
  }

  return rank.code.toLowerCase().includes(normalizedSearchTerm) || rank.name.toLowerCase().includes(normalizedSearchTerm)
}

export const recalculateRankPaginationTotals = (pagination: RankTablePagination, totalItems: number): RankTablePagination => {
  const normalizedTotalPages = totalItems > 0 ? Math.ceil(totalItems / pagination.pageSize) : 0

  return {
    ...pagination,
    totalItems,
    totalPages: normalizedTotalPages,
    page: normalizedTotalPages === 0 ? 1 : Math.min(pagination.page, normalizedTotalPages),
  }
}
