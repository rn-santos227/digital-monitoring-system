import { useTrainingsStore } from '@/app/stores/trainings'
import { defineStoreCollectionTests } from '@/tests/helpers/store-contract'

defineStoreCollectionTests({
  name: 'trainings',
  useStore: useTrainingsStore,
  section: 'trainings',
  listPath: '/api/trainings',
  decrementUnlisted: true,
  fetchAction: 'fetchTrainings',
  createAction: 'createTraining',
  deleteAction: 'deleteTraining',
  updateActions: ['updateTraining'],
  row: { id: 'record', trainingTitle: 'Test Training', defaultRemarks: '' },
  payload: { trainingTitle: 'Test Training', statusId: 'status' },
  updatePayload: { trainingTitle: 'Updated Training' },
})

defineStoreCollectionTests({
  name: 'training categories',
  useStore: useTrainingsStore,
  section: 'categories',
  listPath: '/api/training-categories',
  decrementUnlisted: true,
  fetchAction: 'fetchTrainingCategories',
  createAction: 'createTrainingCategory',
  deleteAction: 'deleteTrainingCategory',
  updateActions: ['updateTrainingCategory'],
  row: { id: 'record', code: 'BASIC', name: 'Basic', usageCount: 0 },
  payload: { code: 'BASIC', name: 'Basic' },
  updatePayload: { name: 'Updated Category' },
})

defineStoreCollectionTests({
  name: 'training records',
  useStore: useTrainingsStore,
  section: 'records',
  listPath: '/api/training-records',
  decrementUnlisted: true,
  fetchAction: 'fetchTrainingRecords',
  createAction: 'createTrainingRecord',
  deleteAction: 'deleteTrainingRecord',
  updateActions: ['updateTrainingRecord'],
  row: { id: 'record', certificateNo: 'CERT-1', remarks: '' },
  payload: { trainingId: 'training', personnelId: 'personnel' },
  updatePayload: { remarks: 'Updated' },
})
