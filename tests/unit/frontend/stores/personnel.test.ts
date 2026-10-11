import { usePersonnelStore } from '@/app/stores/personnel'
import { defineStoreCollectionTests } from '@/tests/helpers/store-contract'

defineStoreCollectionTests({
  name: 'personnel',
  useStore: usePersonnelStore,
  listPath: '/api/personnel',
  fetchAction: 'fetchPersonnel',
  createAction: 'createPersonnel',
  deleteAction: 'deletePersonnel',
  updateActions: ['updatePersonnel'],
  row: {
    id: 'record',
    personnelCode: 'P-1',
    serviceNumber: 'S-1',
    email: 'unit@example.test',
    fullName: 'Test Personnel',
    rankName: 'Sergeant',
    companyName: null,
    battalionName: null,
    serviceStatus: 'Standby',
    profileImageUrl: null,
  },
  payload: {
    personnelCode: 'P-1',
    serviceNumber: 'S-1',
    firstName: 'Test',
    lastName: 'Personnel',
  },
  updatePayload: { serviceStatus: 'Deployed' },
})
