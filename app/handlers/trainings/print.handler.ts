import { TABLE_PRINT_FORMATS } from '~/constants/print-formats.constants'
import { createTablePrintHandler } from '~/handlers/shared/print.handler'

export const usePrintTrainingsHandler = () => ({
  printTrainingCategories: createTablePrintHandler<object>(TABLE_PRINT_FORMATS.trainingCategories),
  printTrainingRecords: createTablePrintHandler<object>(TABLE_PRINT_FORMATS.trainingRecords),
  printTrainings: createTablePrintHandler<object>(TABLE_PRINT_FORMATS.trainings),
})
