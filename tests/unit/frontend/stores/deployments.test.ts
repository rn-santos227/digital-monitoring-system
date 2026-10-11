import { useDeploymentsStore } from '@/app/stores/deployments'
import { defineStoreCollectionTests } from '@/tests/helpers/store-contract'

defineStoreCollectionTests({
  name: 'deployments',
  useStore: useDeploymentsStore,
  section: 'deployments',
  listPath: '/api/deployments',
  listThrows: false,
  decrementUnlisted: true,
  fetchAction: 'fetchDeployments',
  createAction: 'createDeployment',
  deleteAction: 'deleteDeployment',
  updateActions: ['updateDeploymentDetails', 'updateDeploymentLocation'],
  row: {
    id: 'record',
    deploymentArea: 'Test Area',
    startDate: '2026-10-04',
    statusName: 'Planned',
  },
  payload: {
    deploymentArea: 'Test Area',
    startDate: '2026-10-04',
    statusId: 'status',
  },
  updatePayload: { deploymentArea: 'Updated Area' },
})

defineStoreCollectionTests({
  name: 'deployment records',
  useStore: useDeploymentsStore,
  section: 'records',
  listPath: '/api/deployment-records',
  listThrows: false,
  fetchAction: 'fetchDeploymentRecords',
  createAction: 'createDeploymentRecord',
  deleteAction: 'deleteDeploymentRecord',
  updateActions: ['updateDeploymentRecord', 'updateDeploymentRecordLocation'],
  row: {
    id: 'record',
    recordNo: 'DEP-1',
    deploymentArea: 'Test Area',
    remarks: '',
  },
  payload: { personnel_id: 'personnel', deployment_id: 'deployment' },
  updatePayload: { remarks: 'Updated' },
})
