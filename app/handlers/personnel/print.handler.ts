import { PERSONNEL_PRINT_DOCUMENT_TITLE, PERSONNEL_PRINT_FILE_PREFIX } from '~/constants/print-patterns.constants'
import { PERSONNEL_DETAIL_PRINT_FORMAT, PRINT_FETCH_PAGE_SIZE } from '~/constants/print-formats.constants'
import { PERSONNEL_TABLE_COLUMNS } from '~/constants/table.constants'
import type { PersonnelDetail, PersonnelListCompactItem, PersonnelSearchQuery } from '~/types/domain/personnel'
import { getPersonnelEndpoint, searchPersonnelEndpoint } from '~/utils/personnel-endpoints'
import { printTableRecords } from '~/utils/print'
import { createDetailPrintHandler } from '~/handlers/shared/print.handler'

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

  const handleDownloadAndPrintPersonnel = async (filters: Partial<PersonnelSearchQuery>): Promise<readonly PersonnelListCompactItem[]> => {
    const allItems = await fetchAllPersonnelForPrint(filters)
    const printableItems = allItems.map((item) => ({
      ...item,
      assignment: [item.companyName, item.battalionName].filter(Boolean).join(' / ') || 'Unassigned',
    }))

    printTableRecords(printableItems, {
      documentTitle: PERSONNEL_PRINT_DOCUMENT_TITLE,
      filePrefix: PERSONNEL_PRINT_FILE_PREFIX,
      columns: PERSONNEL_TABLE_COLUMNS,
    })
    return allItems
  }

  const printPersonnelProfile = createDetailPrintHandler<PersonnelDetail & { fullName: string }>(PERSONNEL_DETAIL_PRINT_FORMAT)
}
