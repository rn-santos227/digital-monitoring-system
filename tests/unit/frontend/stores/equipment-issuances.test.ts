import { useEquipmentIssuancesStore } from '@/app/stores/equipment-issuances'
import { defineStoreCollectionTests } from '@/tests/helpers/store-contract'

defineStoreCollectionTests({
  name: 'equipment issuances',
  useStore: useEquipmentIssuancesStore,
  listPath: '/api/equipment-issuances',
  fetchAction: 'fetchEquipmentIssuances',
  createAction: 'createEquipmentIssuance',
  deleteAction: 'deleteEquipmentIssuance',
  updateActions: ['updateEquipmentIssuance'],
  row: {
    id: 'record',
    issuanceNo: 'ISS-1',
    assetTag: 'TAG-1',
    statusName: 'Issued',
  },
  payload: {
    equipmentAssetId: 'asset',
    issuedToPersonnelId: 'personnel',
    quantityIssued: 1,
  },
  updatePayload: { remarks: 'Returned' },
})
