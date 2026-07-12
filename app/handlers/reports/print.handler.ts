import type { ReportPrintableSection } from '~/types/domain/reports'

export const printReportSections = (title: string, sections: readonly ReportPrintableSection[]): void => {
  void title
  void sections
  window.print()
}
