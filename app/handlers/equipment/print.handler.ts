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
