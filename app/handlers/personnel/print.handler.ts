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


      }
    }
  }
}
