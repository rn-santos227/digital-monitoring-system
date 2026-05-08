import type { DialogInput } from '~/composables/useDialog'
import type { Toast } from '~/composables/useToast'
import { showErrorDialog } from '~/utils/error-handling'

interface UseDeleteDeploymentHandlerOptions {
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  deleteDeployment: (id: string) => Promise<void>
  addToast: (toast: Omit<Toast, 'id'>) => string
}

const resolveDeploymentId = (row: Record<string, unknown>): string => String(row.id ?? '')

export const useDeleteDeploymentHandler = ({
  showDialog,
  deleteDeployment,
  addToast,
}: UseDeleteDeploymentHandlerOptions) => {
  const onDeleteDeployment = async (row: Record<string, unknown>) => {
    const deploymentId = resolveDeploymentId(row)

    if (!deploymentId) {
      return
    }

    const result = await showDialog({
      type: 'warning',
      title: 'Delete deployment record?',
      message: 'This action cannot be undone. Do you want to continue?',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    })

    if (!result.confirmed) {
      return
    }

    try {
      await deleteDeployment(deploymentId)
      await showDialog({
        type: 'success',
        title: 'Deployment deleted',
        message: 'The deployment record has been deleted successfully.',
        confirmLabel: 'OK',
      })
    } catch (error) {
      const message = await showErrorDialog({
        showDialog,
        title: 'Deployment deletion failed',
        error,
        fallbackMessage: 'Unable to delete deployment record right now.',
      })
      addToast({
        title: 'Delete deployment failed',
        message,
        variant: 'error',
      })
    }
  }

  return { onDeleteDeployment }
}
