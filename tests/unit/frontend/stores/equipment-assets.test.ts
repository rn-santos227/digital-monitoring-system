import { useEquipmentAssetsStore } from '@/app/stores/equipment-assets'
import { defineStoreCollectionTests } from '@/tests/helpers/store-contract'

defineStoreCollectionTests({
  name: 'equipment assets',
  useStore: useEquipmentAssetsStore,
  listPath: '/api/equipment-assets',
  fetchAction: 'fetchEquipmentAssets',
  createAction: 'createEquipmentAsset',
  deleteAction: 'deleteEquipmentAsset',
  updateActions: ['updateEquipmentAsset'],
  row: {
    id: 'record',
    assetTag: 'TAG-1',
    assetStatusName: 'Available',
    equipmentItemName: 'Radio',
  },
  payload: { assetTag: 'TAG-1', equipmentItemId: 'item' },
  updatePayload: { assetStatusName: 'Issued' },
})
