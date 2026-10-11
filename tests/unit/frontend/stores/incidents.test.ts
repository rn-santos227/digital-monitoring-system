import { useIncidentsStore } from '@/app/stores/incidents'
import { defineStoreCollectionTests } from '@/tests/helpers/store-contract'

defineStoreCollectionTests({
  name: 'incidents',
  useStore: useIncidentsStore,
  listPath: '/api/incidents',
  fetchAction: 'fetchEquipmentIncidents',
  createAction: 'createEquipmentIncident',
  deleteAction: 'deleteEquipmentIncident',
  updateActions: [
    'updateEquipmentIncident',
    'updateEquipmentIncidentDeployment',
    'updateEquipmentIncidentDetails',
    'updateEquipmentIncidentEquipment',
    'updateEquipmentIncidentPersonnel',
    'updateEquipmentIncidentLocation',
    'updateEquipmentIncidentStatus',
  ],
  row: {
    id: 'record',
    incidentNo: 'INC-1',
    description: 'Test Incident',
    remarks: '',
  },
  payload: { equipmentAssetId: 'asset', description: 'Test Incident' },
  updatePayload: { remarks: 'Reviewed' },
})
