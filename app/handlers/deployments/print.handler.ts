import { TABLE_PRINT_FORMATS } from '~/constants/print-formats.constants'
import { createTablePrintHandler } from '~/handlers/shared/print.handler'

export const usePrintDeploymentsHandler = () => ({
  printDeployments: createTablePrintHandler<object>(TABLE_PRINT_FORMATS.deployments),
  printDeploymentRecords: createTablePrintHandler<object>(TABLE_PRINT_FORMATS.deploymentRecords),
})
