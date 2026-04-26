export const TRAINING_MODULES = {
  trainings: 'training',
  trainingCategories: 'training',
} as const

export const TRAINING_PERMISSION_GROUPS = {
  trainingManagement: [
    'training.view',
    'training.create',
    'training.update',
    'training.delete',
  ],
} as const
