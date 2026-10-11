import { useCompaniesStore } from '@/app/stores/companies'
import { defineStoreCollectionTests } from '@/tests/helpers/store-contract'

defineStoreCollectionTests({
  name: 'companies',
  useStore: useCompaniesStore,
  listPath: '/api/companies',
  fetchAction: 'fetchCompanies',
  createAction: 'createCompany',
  deleteAction: 'deleteCompany',
  updateActions: ['updateCompany'],
  row: {
    id: 'record',
    code: 'CO',
    name: 'Test Company',
    battalionId: null,
    battalionCode: null,
    battalionName: null,
    isActive: true,
  },
  payload: { code: 'CO', name: 'Test Company', isActive: true },
  updatePayload: { name: 'Updated Company' },
})
