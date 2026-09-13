export const TRAINING_MODULES = {
  trainings: 'training',
  trainingCategories: 'training',
} as const

export const TRAINING_SEARCHABLE_FIELD_COLUMNS = Object.freeze({
  trainingTitle: 'training_title',
  startDate: 'start_date',
  endDate: 'end_date',
  defaultRemarks: 'default_remarks',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})

export const TRAINING_RECORD_SEARCHABLE_FIELD_COLUMNS = Object.freeze({
  recordNo: 'record_no',
  trainingTitle: 'training_title',
  certificateNo: 'certificate_no',
  startDate: 'start_date',
  endDate: 'end_date',
  validUntil: 'valid_until',
  remarks: 'remarks',
})

export const TRAINING_PERMISSION_GROUPS = {
  trainingManagement: [
    'training.view',
    'training.create',
    'training.update',
    'training.delete',
  ],
} as const
