import type { Ref } from 'vue'
import {
  REPORTS_EQUIPMENT_TAB_TITLE,
  REPORTS_PERSONNEL_TAB_TITLE,
  REPORTS_SUMMARY_CARD_TITLE,
} from '~/constants/page.constants'
import { printReportSections } from './print.handler'
import type { ReportTabId, ReportSummaryMetric } from '~/types/domain/reports'

interface UseReportPrintHandlerOptions {
  activeTab: Ref<ReportTabId>
  activeMetrics: Readonly<Ref<ReportSummaryMetric[]>>
}

export const useReportPrintHandler = ({
  activeTab,
  activeMetrics,
}: UseReportPrintHandlerOptions) => {
  const handlePrintReport = (): void => {
    printReportSections(activeTab.value === 'personnel' ? REPORTS_PERSONNEL_TAB_TITLE : REPORTS_EQUIPMENT_TAB_TITLE, [
      {
        title: REPORTS_SUMMARY_CARD_TITLE,
        rows: activeMetrics.value,
      },
    ])
  }

  return {
    handlePrintReport,
  }
}
