import { useEquipmentCategoriesStore } from '@/app/stores/equipment-categories'
import { defineStoreCollectionTests } from '@/tests/helpers/store-contract'

defineStoreCollectionTests({
  name: 'equipment categories',
  useStore: useEquipmentCategoriesStore,
  listPath: '/api/equipment-categories',
  fetchAction: 'fetchEquipmentCategories',
  createAction: 'createEquipmentCategory',
  deleteAction: 'deleteEquipmentCategory',
  updateActions: ['updateEquipmentCategory'],
  row: {
    id: 'record',
    code: 'RADIO',
    name: 'Communications',
    itemCount: 0,
    isActive: true,
  },
  payload: { code: 'RADIO', name: 'Communications', isActive: true },
  updatePayload: { name: 'Updated Category' },
})
