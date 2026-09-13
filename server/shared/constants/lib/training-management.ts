export const TRAINING_MODULES = {
  trainings: 'training',
  trainingCategories: 'training',
} as const

export const TRAINING_SEARCHABLE_FIELD_COLUMNS = Object.freeze({
  trainingTitle: 'training_title',
  startDate: 'start_date',

})

export const TRAINING_PERMISSION_GROUPS = {
  trainingManagement: [
    'training.view',
    'training.create',
    'training.update',
    'training.delete',
  ],
} as const
