import { EQUIPMENT_INCIDENT_DETAIL_PRINT_FORMAT, TABLE_PRINT_FORMATS } from '~/constants/print-formats.constants'
import { createDetailPrintHandler, createTablePrintHandler } from '~/handlers/shared/print.handler'
import type { EquipmentIncidentListItem, EquipmentIncidentTableRow } from '~/types/domain/incident'

export const usePrintIncidentsHandler = () => ({
  printEquipmentIncidents: createTablePrintHandler<EquipmentIncidentTableRow>(TABLE_PRINT_FORMATS.equipmentIncidents),
  printEquipmentIncidentProfile: createDetailPrintHandler<EquipmentIncidentListItem>(EQUIPMENT_INCIDENT_DETAIL_PRINT_FORMAT),
})
