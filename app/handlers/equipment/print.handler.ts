import {
  EQUIPMENT_ITEM_DETAIL_PRINT_FORMAT,
  TABLE_PRINT_FORMATS,
} from '~/constants/print-formats.constants'
import type {
  EquipmentAssetTableRow,
  EquipmentCategoryTableRow,
  EquipmentIssuanceTableRow,
  EquipmentItemListItem,
  EquipmentItemTableRow,
} from '~/types/domain/equipment'
import {
  createDetailPrintHandler,
  createTablePrintHandler,
} from '~/handlers/shared/print.handler'

export const usePrintEquipmentHandler = () => ({
  printEquipmentAssets: createTablePrintHandler<EquipmentAssetTableRow>(TABLE_PRINT_FORMATS.equipmentAssets),
  printEquipmentCategories: createTablePrintHandler<EquipmentCategoryTableRow>(TABLE_PRINT_FORMATS.equipmentCategories),
  printEquipmentIssuances: createTablePrintHandler<EquipmentIssuanceTableRow>(TABLE_PRINT_FORMATS.equipmentIssuances),
  printEquipmentItems: createTablePrintHandler<EquipmentItemTableRow>(TABLE_PRINT_FORMATS.equipmentItems),
})
