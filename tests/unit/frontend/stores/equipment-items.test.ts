import { useEquipmentItemsStore } from '@/app/stores/equipment-items'
import { defineStoreCollectionTests } from '@/tests/helpers/store-contract'

defineStoreCollectionTests({
  name: 'equipment items',
  useStore: useEquipmentItemsStore,
  listPath: '/api/equipment-items',
  fetchAction: 'fetchEquipmentItems',
  createAction: 'createEquipmentItem',
  deleteAction: 'deleteEquipmentItem',
  updateActions: ['updateEquipmentItem'],
  row: {
    id: 'record',
    equipmentCode: 'RADIO-1',
    name: 'Test Radio',
    categoryId: 'category',
    categoryName: 'Communications',
  },
  payload: {
    equipmentCode: 'RADIO-1',
    name: 'Test Radio',
    categoryId: 'category',
  },
  updatePayload: { name: 'Updated Radio' },
})
