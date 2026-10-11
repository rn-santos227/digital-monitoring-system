import { useBattalionsStore } from '@/app/stores/battalions'
import { defineStoreCollectionTests } from '@/tests/helpers/store-contract'

defineStoreCollectionTests({
  name: 'battalions',
  useStore: useBattalionsStore,
  listPath: '/api/battalions',
  fetchAction: 'fetchBattalions',
  createAction: 'createBattalion',
  deleteAction: 'deleteBattalion',
  updateActions: ['updateBattalion'],
  row: {
    id: 'record',
    code: 'UNIT',
    name: 'Test Battalion',
    isActive: true,
    companyCount: 0,
  },
  payload: { code: 'UNIT', name: 'Test Battalion', isActive: true },
  updatePayload: { name: 'Updated Battalion' },
})
